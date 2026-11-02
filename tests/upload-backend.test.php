<?php
declare(strict_types=1);
require __DIR__ . '/../api/upload.php';
function check(bool $value, string $label): void {
    if (!$value) throw new RuntimeException($label);
    echo "PASS $label\n";
}
check(function_exists('gallery_handle'), 'upload handler exists');
check(function_exists('gallery_load_config'), 'private configuration loader exists');
check(function_exists('gallery_http'), 'bounded HTTPS transport exists');
check(gallery_load_config(__DIR__ . '/..', __DIR__ . '/../api/config.example.php') === [], 'public config rejected');
$config = ['firebase_api_key' => 'test-key', 'allowed_uids' => ['admin-uid'], 'allowed_emails' => ['admin@example.sch.id'], 'cloudinary_cloud_name' => 'test-cloud', 'cloudinary_api_key' => '123', 'cloudinary_api_secret' => 'test-secret'];
$post = ['REQUEST_METHOD' => 'POST', 'HTTP_AUTHORIZATION' => 'Bearer test.token.signature'];
foreach ([[400, ['error' => ['message' => 'INVALID_ID_TOKEN']]], [200, ['users' => [['localId' => 'outsider', 'email' => 'outsider@example.sch.id']]]], [200, ['users' => [['localId' => 'admin-uid', 'email' => 'admin@example.sch.id', 'disabled' => true]]]]] as $reply) {
    $result = gallery_handle($post, [], $config, fn() => $reply);
    check(in_array($result[0], [401, 403], true), 'invalid, non-admin, disabled tokens denied');
}
$lookup = function ($url, $body) {
    check($url === 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=test-key', 'lookup uses configured project key');
    check(json_decode($body, true) === ['idToken' => 'test.token.signature'], 'lookup receives bearer token only');
    return [200, ['users' => [['localId' => 'admin-uid', 'email' => 'admin@example.sch.id']]]];
};
    check(gallery_handle($post, [], $config, $lookup)[0] === 400, 'authorized request still needs file');
$never = function () { throw new RuntimeException('Unexpected network'); };
check(gallery_handle(['REQUEST_METHOD' => 'GET'], [], $config, $never)[0] === 405, 'POST required');
check(gallery_handle(['REQUEST_METHOD' => 'POST'], [], $config, $never)[0] === 401, 'Bearer required');
$tmp = tempnam(sys_get_temp_dir(), 'upload-test-');
try {
    file_put_contents($tmp, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aF1cAAAAASUVORK5CYII='));
    $file = ['error' => UPLOAD_ERR_OK, 'tmp_name' => $tmp, 'size' => filesize($tmp), 'type' => 'text/plain', 'name' => '../../evil.php'];
    $calls = 0;
    $http = function ($url, $body, $headers, $timeout) use (&$calls, $lookup) {
        $calls++;
        if ($calls === 1) return $lookup($url, $body);
        check($url === 'https://api.cloudinary.com/v1_1/test-cloud/image/upload', 'fixed image upload endpoint');
        check($timeout === 25, 'bounded cloud timeout');
        check($body['file'] instanceof CURLFile && $body['file']->getMimeType() === 'image/png', 'real MIME not browser metadata');
        check(!isset($body['upload_preset']) && !isset($body['folder']), 'no unsigned preset or client params');
        check(preg_match('/^gallery\/[a-f0-9]{32}$/D', $body['public_id']) === 1, 'server random public id');
        $signed = 'overwrite=false&public_id=' . $body['public_id'] . '&timestamp=' . $body['timestamp'] . 'test-secret';
        check(hash_equals(hash('sha256', $signed), $body['signature']), 'server signature');
        return [200, ['secure_url' => 'https://res.cloudinary.com/test-cloud/image/upload/a.png', 'public_id' => $body['public_id']]];
    };
    $result = gallery_handle($post, ['file' => $file], $config, $http, fn() => true);
    check($result[0] === 200 && isset($result[1]['url'], $result[1]['path']), 'authorized real image uploaded');
    check($calls === 2, 'only identity and cloud calls');
    foreach ([[500, ['error' => 'SECRET']], [200, ['secure_url' => 'http://evil.test', 'public_id' => 'wrong']], [200, null]] as $cloudReply) {
        $count = 0;
        $failedCloud = function ($url, $body) use (&$count, $lookup, $cloudReply) {
            return ++$count === 1 ? $lookup($url, $body) : $cloudReply;
        };
        $failure = gallery_handle($post, ['file' => $file], $config, $failedCloud, fn() => true);
        check($failure[0] === 502 && !str_contains(json_encode($failure), 'SECRET'), 'cloud errors fail closed without details');
    }
    check(gallery_handle($post, ['file' => $file], $config, $lookup, fn() => false)[0] === 400, 'requires HTTP uploaded file');
    $emailOnlyConfig = ['firebase_api_key' => 'test-key', 'allowed_uids' => [], 'allowed_emails' => ['admin@example.sch.id'], 'cloudinary_cloud_name' => 'test-cloud', 'cloudinary_api_key' => '123', 'cloudinary_api_secret' => 'test-secret'];
    $emailCalls = 0;
    $emailHttp = function ($url, $body, $headers, $timeout) use (&$emailCalls, $lookup) {
        ++$emailCalls;
        return $emailCalls === 1 ? $lookup($url, $body) : [200, ['secure_url' => 'https://res.cloudinary.com/test-cloud/image/upload/a.png', 'public_id' => $body['public_id']]];
    };
    check(gallery_handle($post, ['file' => $file], $emailOnlyConfig, $emailHttp, fn() => true)[0] === 200, 'email allowlist works without UID allowlist');
    $deletePath = 'gallery/' . bin2hex(random_bytes(16));
    $deleteCalls = 0;
    $deleteHttp = function ($url, $body) use (&$deleteCalls, $lookup, $deletePath) {
        ++$deleteCalls;
        if ($deleteCalls === 1) return $lookup($url, $body);
        check($url === 'https://api.cloudinary.com/v1_1/test-cloud/image/destroy', 'fixed destroy endpoint');
        check(($body['public_id'] ?? '') === $deletePath, 'destroy uses exact server-validated public_id');
        $signed = 'invalidate=true&public_id=' . $deletePath . '&timestamp=' . $body['timestamp'] . 'test-secret';
        check(hash_equals(hash('sha256', $signed), $body['signature']), 'destroy signed server-side');
        return [200, ['result' => 'ok']];
    };
    check(gallery_handle($post, [], $config, $deleteHttp, null, ['action' => 'delete', 'path' => $deletePath])[0] === 200, 'authorized cleanup deletes orphan asset');
    foreach ([['path' => '../../private/x'], ['path' => 'gallery/ZZZZ'], ['path' => 'other/a'], ['path' => ''], ['path' => ['x']] ] as $badDelete) {
        check(gallery_handle($post, [], $config, $lookup, null, ['action' => 'delete'] + $badDelete)[0] === 400, 'unsafe delete paths rejected');
    }
    check(gallery_handle($post, [], $config, $lookup, null, ['action' => 'delete', 'path' => 'other/a'])[0] === 400, 'delete outside gallery prefix rejected');
    foreach ([['error' => UPLOAD_ERR_INI_SIZE], ['tmp_name' => []], ['size' => 5242881]] as $change) {
        check(gallery_handle($post, ['file' => array_replace($file, $change)], $config, $lookup, fn() => true)[0] === 400, 'invalid upload metadata rejected');
    }
    file_put_contents($tmp, '<?php echo "not an image";');
    $file['size'] = filesize($tmp);
    check(gallery_handle($post, ['file' => $file], $config, $lookup, fn() => true)[0] === 400, 'forged image MIME rejected');
    file_put_contents($tmp, str_repeat('x', 5242881));
    clearstatcache(true, $tmp);
    $file['size'] = 1;
    check(gallery_handle($post, ['file' => $file], $config, $lookup, fn() => true)[0] === 400, 'actual size enforced');
    check(gallery_handle($post, [], [], $never)[0] === 503, 'missing config fails closed');
    check(gallery_handle($post, [], $config, $never)[0] === 503, 'network exceptions fail closed');
} finally { unlink($tmp); }

