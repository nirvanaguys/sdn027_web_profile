<?php
declare(strict_types=1);

function gallery_load_config(string $documentRoot, ?string $path = null): array
{
    $root = realpath($documentRoot);
    if ($root === false || $documentRoot === '') return [];
    // Standard Hostinger layout: domains/example.test/{public_html,private}.
    $resolved = realpath($path ?? dirname($root) . '/private/gallery-upload.php');
    if ($resolved === false || !is_file($resolved) || !is_readable($resolved) ||
        $resolved === $root || str_starts_with($resolved, $root . DIRECTORY_SEPARATOR)) return [];
    $config = require $resolved;
    return is_array($config) ? $config : [];
}

function gallery_http(string $url, $body, array $headers, int $timeout): array
{
    $curl = curl_init($url);
    if ($curl === false) throw new RuntimeException('Transport unavailable');
    $response = '';
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_WRITEFUNCTION => static function ($handle, string $chunk) use (&$response): int {
            if (strlen($response) + strlen($chunk) > 1048576) return 0;
            $response .= $chunk;
            return strlen($chunk);
        },
    ]);
    try {
        if (curl_exec($curl) === false) throw new RuntimeException('Transport failed');
        return [(int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE), json_decode($response, true, 32, JSON_THROW_ON_ERROR)];
    } finally {
        // Handle is released automatically when it leaves scope (PHP 8+).
        unset($curl);
    }
}

/** Dependency injection is for local tests only, never selected by request data. */
function gallery_handle(array $server, array $files, array $config, callable $http, ?callable $isUpload = null, array $postData = []): array
{
    if (($server['REQUEST_METHOD'] ?? '') !== 'POST') return [405, ['error' => 'Method not allowed.']];
    $authorization = $server['HTTP_AUTHORIZATION'] ?? $server['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!is_string($authorization) || !preg_match('/^Bearer ([A-Za-z0-9_.-]{1,8192})$/D', $authorization, $match)) {
        return [401, ['error' => 'Authentication required.']];
    }
    try {
        foreach (['firebase_api_key', 'cloudinary_cloud_name', 'cloudinary_api_key', 'cloudinary_api_secret'] as $key) {
            if (!isset($config[$key]) || !is_string($config[$key]) || trim($config[$key]) === '') {
                return [503, ['error' => 'Upload unavailable.']];
            }
        }
        $allowedUids = is_array($config['allowed_uids'] ?? null) ? $config['allowed_uids'] : [];
        $allowedEmails = is_array($config['allowed_emails'] ?? null) ? $config['allowed_emails'] : [];
        if ((count($allowedUids) === 0 && count($allowedEmails) === 0) ||
            !preg_match('/^[a-zA-Z0-9_-]+$/D', $config['cloudinary_cloud_name'])) {
            return [503, ['error' => 'Upload unavailable.']];
        }
        [$status, $identity] = $http(
            'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . rawurlencode($config['firebase_api_key']),
            json_encode(['idToken' => $match[1]], JSON_THROW_ON_ERROR),
            ['Content-Type: application/json'], 10
        );
        if ($status !== 200 || !is_array($identity) || count($identity['users'] ?? []) !== 1) {
            return [401, ['error' => 'Authentication failed.']];
        }
        $user = $identity['users'][0];
        $uid = is_string($user['localId'] ?? null) ? $user['localId'] : '';
        $email = is_string($user['email'] ?? null) ? strtolower(trim($user['email'])) : '';
        $uidAllowed = $uid !== '' && in_array($uid, $allowedUids, true);
        $emailAllowed = $email !== '' && in_array($email, array_map('strtolower', $allowedEmails), true);
        if ($uid === '' || !empty($user['disabled']) || (!$uidAllowed && !$emailAllowed)) {
            return [403, ['error' => 'Access denied.']];
        }
        if (($postData['action'] ?? '') === 'delete') {
            $path = is_string($postData['path'] ?? null) ? $postData['path'] : '';
            if (!preg_match('/^gallery\/[a-f0-9]{32}$/D', $path)) {
                return [400, ['error' => 'Invalid photo.']];
            }
            $params = ['public_id' => $path, 'invalidate' => 'true', 'timestamp' => (string) time()];
            $signature = hash('sha256', 'invalidate=true&public_id=' . $params['public_id'] . '&timestamp=' . $params['timestamp'] . $config['cloudinary_api_secret']);
            [$status, $result] = $http(
                'https://api.cloudinary.com/v1_1/' . $config['cloudinary_cloud_name'] . '/image/destroy',
                $params + ['api_key' => $config['cloudinary_api_key'], 'signature' => $signature],
                [], 25
            );
            $destroyed = is_string($result['result'] ?? null) ? strtolower($result['result']) : '';
            if ($status !== 200 || !in_array($destroyed, ['ok', 'not found'], true)) {
                return [502, ['error' => 'Upload failed.']];
            }
            return [200, ['ok' => true]];
        }

        $file = $files['file'] ?? null;
        if (!is_array($file) || ($file['error'] ?? null) !== UPLOAD_ERR_OK ||
            !is_string($file['tmp_name'] ?? null) || !is_int($file['size'] ?? null) ||
            $file['size'] <= 0 || $file['size'] > 5 * 1024 * 1024 ||
            !($isUpload ?? 'is_uploaded_file')($file['tmp_name'])) {
            return [400, ['error' => 'Invalid photo.']];
        }
        $size = filesize($file['tmp_name']);
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $image = @getimagesize($file['tmp_name']);
        $types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
        if ($size === false || $size <= 0 || $size > 5 * 1024 * 1024 ||
            !isset($types[$mime]) || !$image || ($image['mime'] ?? '') !== $mime) {
            return [400, ['error' => 'Invalid photo.']];
        }
        $params = ['overwrite' => 'false', 'public_id' => 'gallery/' . bin2hex(random_bytes(16)), 'timestamp' => (string) time()];
        $signature = hash('sha256', 'overwrite=false&public_id=' . $params['public_id'] . '&timestamp=' . $params['timestamp'] . $config['cloudinary_api_secret']);
        [$status, $result] = $http(
            'https://api.cloudinary.com/v1_1/' . $config['cloudinary_cloud_name'] . '/image/upload',
            $params + ['api_key' => $config['cloudinary_api_key'], 'signature' => $signature,
                'file' => new CURLFile($file['tmp_name'], $mime, 'photo.' . $types[$mime])],
            [], 25
        );
        $prefix = 'https://res.cloudinary.com/' . $config['cloudinary_cloud_name'] . '/image/upload/';
        if ($status !== 200 || !is_string($result['secure_url'] ?? null) ||
            !str_starts_with($result['secure_url'], $prefix) || ($result['public_id'] ?? '') !== $params['public_id']) {
            return [502, ['error' => 'Upload failed.']];
        }
        return [200, ['url' => $result['secure_url'], 'path' => $result['public_id']]];
    } catch (Throwable $error) {
        return [503, ['error' => 'Upload unavailable.']];
    }
}

// Including this file in CLI tests does not execute an HTTP request.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    ini_set('display_errors', '0');
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    set_error_handler(static function (int $severity, string $message): bool {
        if (!(error_reporting() & $severity)) return true; // Respect @ on image inspection.
        // Never echo or log upstream URLs, tokens, secret values, or PHP paths.
        throw new RuntimeException('Upload runtime failure');
    });
    try {
        // Reject unauthenticated requests before touching private config.
        $config = [];
        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' &&
            !empty($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '')) {
            $config = gallery_load_config($_SERVER['DOCUMENT_ROOT'] ?? '', getenv('GALLERY_UPLOAD_CONFIG') ?: null);
        }
        [$status, $result] = gallery_handle($_SERVER, $_FILES, $config, 'gallery_http', null, $_POST);
    } catch (Throwable $error) {
        $status = 503;
        $result = ['error' => 'Upload unavailable.'];
    } finally {
        restore_error_handler();
    }
    http_response_code($status);
    if ($status === 405) header('Allow: POST');
    echo json_encode($result, JSON_UNESCAPED_SLASHES);
}

