# Upload foto aman: Hostinger shared hosting / hPanel

Galeri dan foto Beranda menggunakan `POST /api/upload.php` pada origin yang sama. Browser mengambil Firebase ID token pengguna login dan mengirim header `Authorization: Bearer <idToken>`. PHP memverifikasi token secara remote melalui Google Identity Toolkit `accounts:lookup` dengan API key project Firebase server, lalu memeriksa **UID Firebase** pada allowlist server (bukan email dari browser). PHP mengirim file ke Cloudinary memakai signature SHA-256 dengan secret server. Tidak perlu Composer, Node server, atau Firebase Storage untuk upload ini.

## Wajib sebelum dianggap aman

**Nonaktifkan/hapus preset unsigned Cloudinary lama, atau ubah menjadi signed di Cloudinary Console → Settings → Upload → Upload presets.** Menghapus preset dari `.env` atau mengganti frontend saja TIDAK menutup jalur upload unsigned yang sudah diketahui publik. Pastikan aplikasi lain yang memakai preset itu sudah dimigrasi. Jangan menghapus aset lama: URL foto yang tersimpan tetap berlaku. Jika secret pernah masuk frontend/repository, rotasi secret secara manual.

Tidak ada perubahan cloud, billing, preset, UID, atau deployment otomatis oleh kode ini.

## Deployment manual hPanel

1. Di Firebase Console → Authentication → Users, salin UID akun admin yang sudah ada. Gunakan project yang sama dengan frontend. Allowlist `allowed_uids`/`allowed_emails` kosong berarti semua upload ditolak. UI mendukung `VITE_ADMIN_UID` (disarankan) atau fallback `VITE_ADMIN_EMAIL`; gunakan satu identitas admin yang konsisten pada frontend, rules, dan backend upload.
2. Pilih PHP **8.2 atau lebih baru** pada hPanel. Aktifkan **curl**, **fileinfo**, dan HTTPS. Pastikan outbound HTTPS ke `identitytoolkit.googleapis.com` dan `api.cloudinary.com` diizinkan serta CA certificates bekerja. Jangan mematikan verifikasi TLS. Firebase web API key server harus milik project yang benar, mengizinkan Identity Toolkit API, dan dapat digunakan dari server (key browser yang dibatasi HTTP referrer tidak cocok; buat key khusus server dalam project yang sama bila perlu, batasi API dan IP egress hosting jika stabil).
3. Struktur contoh (sesuaikan nama akun/domain):
   ```text
   /home/u123/domains/sekolah.example/
     private/gallery-upload.php       # rahasia; BUKAN di public_html
     public_html/
       index.html                    # hasil dist
       assets/                       # hasil dist
       api/upload.php                # salinan api/upload.php dari repo
   ```
   Salin `api/config.example.php` menjadi `private/gallery-upload.php`, isi `firebase_api_key`, `allowed_uids` dan/atau `allowed_emails` (minimal salah satu terisi), `cloudinary_cloud_name`, `cloudinary_api_key`, dan `cloudinary_api_secret` dari console masing-masing. Gunakan izin direktori `700` dan file `600` bila PHP berjalan sebagai akun hosting; bila berbeda, beri hanya akses baca yang diperlukan, bukan world-readable. Jangan upload config contoh atau config nyata ke `public_html/api`.
4. Default endpoint mencari `private/gallery-upload.php` tepat di sebelah `public_html` berdasarkan `DOCUMENT_ROOT`. Jika layout berbeda, atur environment **server-only** `GALLERY_UPLOAD_CONFIG` ke path absolut di luar semua document root lewat konfigurasi hosting yang didukung; jangan menaruh secret pada `.htaccess`. Endpoint menolak config di dalam document root sendiri, termasuk symlink yang menuju ke dalamnya. Pastikan file juga tidak disajikan oleh domain/subdomain lain. Jika `open_basedir` membatasi akses, izinkan direktori private via hPanel/dukungan Hostinger; jangan memindahkan secret ke public root untuk mengatasinya.
5. hPanel → PHP configuration: `file_uploads=On`, `upload_max_filesize=5M`, `post_max_size=8M`, `max_file_uploads=1`, `max_execution_time=60`, `display_errors=Off`. Batas aplikasi adalah **5 × 1024 × 1024 byte**; PHP juga memeriksa ukuran file nyata, bukan hanya metadata browser. Set batas request body di hosting/CDN agar upload raksasa tidak menghabiskan bandwidth sebelum PHP menolak.
6. Jalankan `npm run build` lalu salin **isi** `dist/` ke `public_html/`. Salin `api/upload.php` secara terpisah ke `public_html/api/upload.php` (Vite tidak menyalin PHP). Jangan upload source, `.env`, `.git`, tests, atau config rahasia. Tidak ada `VITE_CLOUDINARY_*` yang diperlukan; hapus variabel preset lama dari konfigurasi build. Semua `VITE_*` bersifat publik: jangan pernah memasukkan Cloudinary API secret ke sana.
7. Pastikan aturan SPA tidak menulis ulang `/api/upload.php` ke `index.html`, dan header Authorization diteruskan PHP. Contoh aturan **gabungkan**, jangan timpa aturan hosting lain:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTP:Authorization} .
   RewriteRule ^ - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
   RewriteRule ^api/ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^ index.html [L]
   ```
   Jangan menambahkan CORS wildcard: endpoint dirancang same-origin. Pakai HTTPS untuk website, bukan HTTP. Tidak perlu Node berjalan di hPanel.

## Verifikasi sesudah deploy (pemilik harus melakukan)

- `GET /api/upload.php` → HTTP 405 JSON, `Allow: POST` (bukan HTML SPA atau source PHP).
- POST tanpa Authorization → 401; token invalid/expired/project lain → ditolak; user Firebase biasa dengan UID/email di luar allowlist → 403; akun disabled → ditolak. Jangan menyalin token ke chat, log, URL, atau tiket dukungan.
- Login akun admin yang UID-nya diizinkan, upload JPEG/PNG/WebP kecil; simpan Galeri dan Beranda lalu reload dan pastikan URL foto tampil. Respons sukses tetap `{ "url": "https://res.cloudinary.com/...", "path": "gallery/..." }`.
- Coba file bukan gambar yang diganti ekstensi `.jpg`, file kosong, dan file >5 MB: harus ditolak. Validasi memakai fileinfo + header dimensi gambar, bukan nama/Content-Type dari browser. Ini bukan antivirus atau sanitasi ulang gambar.
- Uji preset unsigned lama langsung lewat mekanisme Cloudinary yang biasa Anda gunakan: pastikan sudah tidak menerima upload unsigned. **Jangan melewati langkah ini.**
- Jika 503: periksa lokasi/izin private config, allowlist, PHP extensions, batas `open_basedir`, key Firebase server, dan outbound HTTPS. Error publik sengaja generik. Jangan menyalakan debug yang merekam token, body autentikasi, URL Identity Toolkit berisi key, atau secret.

## Timeouts, cleanup, dan batas operasional

Browser membatalkan fetch setelah 45 detik (termasuk pembacaan body respons); PHP memakai connect timeout 5 detik, lookup 10 detik, Cloudinary 25 detik. Redirect upstream ditolak, TLS diverifikasi. Hanya file dan parameter Cloudinary yang dibuat server yang dikirim; filename, folder, public_id, preset, signature, atau email dari request tidak dipercaya.

Aset menggunakan ID acak dengan `overwrite=false`. Hapus aset memakai POST `action=delete` dengan `path` yang divalidasi server (hanya format `gallery/<hex32>`), dipanggil otomatis oleh frontend sebagai cleanup bila penyimpanan Firestore gagal setelah upload sukses. Foto lama tidak dihapus otomatis ketika diganti atau dokumen galeri dihapus, agar tautan yang sudah dipakai di tempat lain tidak rusak; file tak terpakai dapat dihapus manual melalui Cloudinary. Endpoint ini tidak mengubah Firestore rules atau kontrol akses konten lainnya. Aktifkan pembatasan request/rate di Hostinger/CDN dan pantau kuota untuk membatasi abuse/biaya; allowlist bukan pengganti rate limiting.

## Tes lokal tanpa cloud

```sh
node --test tests/*.test.js
php -l api/upload.php
php -l api/config.example.php
php -l tests/upload-backend.test.php
php tests/upload-backend.test.php
npm run lint
npm run build
```

Tes PHP membutuhkan PHP 8.2+, curl, fileinfo. Transport Google/Cloudinary dan `is_uploaded_file` diinjeksi hanya dari harness CLI, bukan request. Tes mencakup otorisasi UID, kesalahan upstream, MIME nyata, ukuran, signature dan respons; tidak ada upload cloud nyata. Untuk preview lokal gunakan origin PHP yang menyajikan hasil dist beserta `/api/upload.php`, atau reverse proxy lokal; Vite dev/preview sendiri tidak mengeksekusi PHP. Jangan deploy hanya frontend karena endpoint tidak akan tersedia.
