<?php
declare(strict_types=1);

// Copy outside public_html to ../private/gallery-upload.php (default location).
// For another private location, set server-only GALLERY_UPLOAD_CONFIG to its absolute path.
// Never commit the completed configuration or place it under the web root.
return [
    'firebase_api_key' => 'replace-with-firebase-web-api-key',
    // Gunakan salah satu atau keduanya.
    'allowed_uids' => [
        'replace-with-stable-firebase-uid',
    ],
    'allowed_emails' => [
        'replace-with-admin@example.sch.id',
    ],
    'cloudinary_cloud_name' => 'replace-with-cloud-name',
    'cloudinary_api_key' => 'replace-with-api-key',
    'cloudinary_api_secret' => 'replace-with-api-secret',
];
