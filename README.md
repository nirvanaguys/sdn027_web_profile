# 🏫 Website Profil SDN 027 Balikpapan Utara

> Website profil resmi SDN 027 Balikpapan Utara — dikembangkan sebagai bagian dari proyek mata kuliah **Inovasi Sosial** untuk menyediakan media informasi digital bagi siswa, orang tua, guru, dan masyarakat sekitar.

![Status](https://img.shields.io/badge/Status-Aktif-success?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Web%20App-blue?style=flat-square)
![Framework](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

---

## 📖 Tentang Proyek

Website ini dikembangkan sebagai solusi digitalisasi untuk SDN 027 Balikpapan Utara yang sebelumnya belum memiliki website resmi. Proyek ini bertujuan menyediakan website profil yang:
- Memberikan informasi lengkap tentang sekolah (visi, misi, profil, akademik).
- Menyediakan portal berita dan pengumuman terkini.
- Menampilkan galeri kegiatan sekolah.
- Memiliki sistem admin terlindungi untuk pengelolaan konten.

### 🎯 Tujuan
- Menyediakan media informasi resmi bagi SDN 027 Balikpapan Utara.
- Mempermudah penyampaian informasi kepada siswa, orang tua, dan masyarakat.
- Mendukung digitalisasi sekolah melalui website yang mudah diakses.
- Memberikan pengalaman pengguna yang ramah anak namun tetap elegan dan profesional.

### 🌟 Fitur Utama
- **Beranda** — Hero section dengan statistik sekolah dan keunggulan.
- **Profil Sekolah** — Sejarah, sambutan kepala sekolah, visi & misi.
- **Program Akademik** — Kurikulum, jam belajar, ekstrakurikuler.
- **Berita & Pengumuman** — Informasi terkini dari sekolah.
- **Galeri Foto** — Dokumentasi kegiatan dan fasilitas sekolah.
- **Dashboard Admin** — Login Firebase Authentication untuk mengelola berita, galeri (upload foto langsung), konten Beranda/Profil/Akademik, foto kepala sekolah, dan foto kegiatan ekstrakurikuler.

---

## 👥 Anggota Kelompok

| No | Nama |
|:--:|------|
| 1 | Muhammad Wisnu Wardhana |
| 2 | Ade Putri Amanda |
| 3 | Annisa Yumna |
| 4 | Michele Yolanda Talita R |
| 5 | Wahyu Ramadan |
| 6 | Ariel |
| 7 | Fazly Pasya Pahlevi |
| 8 | Muhammad Yusuf Pratama |
| 9 | Hagia Hafisa |
| 10 | Andika Putra Pratama |

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|----------|-----------|
| Framework | **React 19** (via Vite 8) |
| Styling | **Tailwind CSS 3.4** |
| Routing | React Router DOM 7 |
| Icons | Lucide React |
| Autentikasi | Firebase Authentication (Email/Password) |
| Database | Cloud Firestore |
| Penyimpanan Foto | Cloudinary (upload via endpoint PHP `api/upload.php` dengan signature server) |
| Backend Upload | PHP 8.2+ (shared hosting, tanpa Composer/Node server) |
| Package Manager | npm |
| Build Tool | Vite |

---

## 📋 Persyaratan Sistem (*Requirements*)

Sebelum menjalankan proyek ini, pastikan komputer kamu sudah terpasang:

- ✅ **Node.js** versi **18.x** atau lebih baru (versi LTS direkomendasikan)
  - Cek versi: `node --version`
  - Unduh di: https://nodejs.org/
- ✅ **npm** versi **9.x** atau lebih baru (terbawa otomatis saat install Node.js)
  - Cek versi: `npm --version`
- ✅ **Git** (untuk meng-clone repository)
  - Unduh di: https://git-scm.com/
- ✅ **Code Editor** (direkomendasikan: [Visual Studio Code](https://code.visualstudio.com/))
- ✅ **Windows Execution Policy** (jika menggunakan PowerShell)
  - Jalankan: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- ✅ **PHP 8.2+** (opsional — hanya untuk mengetes upload foto `api/upload.php` secara lokal; hosting produksi wajib menyediakannya)

---

## ⚙️ Tata Cara Instalasi & Pengecekan

Ikuti langkah berikut untuk menjalankan website secara lokal di komputer kamu:

### 1. Clone Repository

Buka terminal / Command Prompt, lalu jalankan:
```bash
git clone https://github.com/nirvanaguys/sdn027_web_profile.git
cd sdn027_web_profile
```

### 2. Install Dependencies

Jalankan perintah ini untuk mengunduh semua *package* yang dibutuhkan:
```bash
npm install
```

> ⏱️ Tunggu hingga proses selesai (biasanya 1–3 menit tergantung koneksi internet).

### 3. Cek Konfigurasi Tailwind CSS

Pastikan file konfigurasi berikut sudah ada di root folder dan isinya benar:

**`tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {50:'#eef6fc',100:'#d9ecf8',200:'#b3d9f1',300:'#7ebfe6',400:'#4098d1',500:'#0B6FB8',600:'#0a5c99',700:'#0c4a7a',800:'#0f3c62',900:'#123350'},
        honey: {50:'#fff8ea',100:'#ffedc4',200:'#ffdb8a',300:'#ffc450',400:'#fbaa2a',500:'#F5A524',600:'#dc8a12',700:'#b66d0f',800:'#935915',900:'#794a16'},
        leaf: {50:'#eef7f1',100:'#d3ecdc',400:'#6cb389',500:'#4C9A6A',600:'#3d7d56',700:'#2f6243'},
        cream: '#FAF7F0',
        ink: '#16324F',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: { '4xl': '2rem' },
    },
  },
  plugins: [],
}
```

**`postcss.config.js`**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**`src/index.css`** — pastikan berisi:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body { @apply bg-cream font-body text-ink antialiased; }
  h1, h2, h3, h4 { @apply font-display; }
}

@layer components {
  .container-page { @apply mx-auto w-full max-w-6xl px-4 sm:px-6; }
  .btn { @apply inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold transition duration-200; }
  .btn-primary { @apply bg-primary-500 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-600 hover:-translate-y-0.5; }
  .btn-honey { @apply bg-honey-500 text-primary-900 shadow-lg shadow-honey-500/30 hover:bg-honey-600 hover:-translate-y-0.5; }
  .btn-ghost { @apply border-2 border-primary-200 bg-white/80 text-primary-700 hover:border-primary-400 hover:bg-white; }
  .card { @apply rounded-3xl border border-primary-100 bg-white shadow-sm; }
  .eyebrow { @apply inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary-600; }
  .highlight { background-image: linear-gradient(transparent 60%, theme('colors.honey.200') 60%); }
}
```

> ⚠️ **PENTING:** Jika ada perubahan pada file konfigurasi di atas, **wajib** restart server development.

### 4. Konfigurasi Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com/), lalu daftarkan **Web app**.
2. Aktifkan **Authentication → Sign-in method → Email/Password**, kemudian buat pengguna admin dengan email yang akan digunakan untuk masuk.
3. Buat database **Cloud Firestore**.
4. Salin `.env.example` menjadi `.env`, lalu tempel setiap nilai dari objek konfigurasi Web App Firebase. Isi `VITE_ADMIN_EMAIL` dengan email pengguna admin tadi, dan (disarankan) `VITE_ADMIN_UID` dengan UID akun admin dari Firebase Console → Authentication → Users.

```bash
cp .env.example .env
```

Di Windows, gunakan `copy .env.example .env`.

5. Di Firebase Console, buka **Firestore Database → Rules**. Salin isi [firestore.rules](./firestore.rules), ganti `GANTI_DENGAN_UID_ADMIN` dengan UID admin (atau hapus baris UID bila hanya ingin pakai email), pastikan email pada rules sama persis dengan akun admin, lalu publikasikan. Untuk upload foto, lihat panduan lengkap di [docs/gallery-upload.md](./docs/gallery-upload.md) (butuh hosting dengan PHP 8.2+ dan file `api/upload.php`).

Konfigurasi Web Firebase memang digunakan di aplikasi browser; keamanan penulisan data ditentukan oleh Firestore Security Rules, bukan dengan menyembunyikan `apiKey`. Lihat panduan resmi [setup Firebase Web](https://firebase.google.com/docs/web/setup) dan [Firebase Authentication Email/Password](https://firebase.google.com/docs/auth/web/password-auth).

### 5. Jalankan Website

```bash
npm run dev
```

Setelah muncul pesan seperti ini:
```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

Buka browser dan kunjungi **http://localhost:5173/** — website profil SDN 027 sudah berjalan! 🎉

> ⚠️ **Catatan upload foto:** `npm run dev` (Vite) **tidak mengeksekusi PHP**, jadi fitur upload foto (galeri/beranda/profil/ekskul) akan gagal di dev server biasa dan menampilkan error. Test upload hanya di environment yang menjalankan `api/upload.php` (staging/hosting PHP atau server PHP lokal). Konten teks (berita, profil, akademik) tetap bisa dites di dev karena langsung ke Firebase.

### 6. Akses Dashboard Admin

1. Buka halaman admin melalui URL: **`http://localhost:5173/admin`** (tidak ada tombol Admin di navbar publik, memang sengaja).
2. Login dengan email dan password pengguna Firebase Authentication yang Anda buat (hanya akun admin yang diizinkan; akun lain ditolak otomatis).
3. Setelah login, tersedia 5 tab: **Berita** (CRUD), **Galeri** (upload foto JPG/PNG/WebP maks 5 MB), **Beranda**, **Profil** (termasuk foto kepala sekolah), dan **Akademik** (termasuk upload foto per ekstrakurikuler).

> Data dikelola melalui koleksi Firestore `news`, `gallery`, dan `content` (dokumen `home`, `profile`, `academic`). Untuk membuat data awal, tambahkan langsung melalui dashboard admin.

---

## 🔧 Troubleshooting

### Error: "running scripts is disabled on this system"
**Solusi:** Jalankan perintah ini di PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Lalu ketik `Y` untuk konfirmasi.

### Error: "Failed to resolve import react-router-dom"
**Solusi:** Jalankan:
```bash
npm install react-router-dom lucide-react
```

### Tampilan polos tanpa styling Tailwind
**Solusi:**
1. Pastikan file `postcss.config.js` ada di root folder.
2. Hentikan server (`Ctrl+C`).
3. Jalankan: `npx vite --force`

### Port 5173 sudah terpakai
**Solusi:** Vite akan otomatis menggunakan port lain (misal 5174). Perhatikan URL yang ditampilkan di terminal.

---

## 📁 Struktur Folder

```
sdn027_web_profile/
├── api/
│   ├── upload.php            # Endpoint PHP: verifikasi token admin + upload signature ke Cloudinary
│   └── config.example.php    # Template config rahasia (salin ke luar web root, JANGAN commit yang berisi kunci)
├── docs/
│   └── gallery-upload.md     # Panduan deploy & verifikasi upload (Hostinger/hPanel)
├── public/                   # File statis (favicon, gambar umum)
├── src/
│   ├── components/           # Komponen React modular (Navbar, Footer, NewsCard, SectionHead)
│   ├── pages/                # Halaman publik (Home, Profil, Akademik, Berita, Galeri)
│   │   └── admin/            # Login, Dashboard (5 tab), GalleryPhotoField
│   ├── data/
│   │   ├── firebase.js       # Inisialisasi Firebase + aturan akun admin
│   │   ├── api.js            # Operasi Firebase Auth dan Firestore
│   │   ├── content.js        # Data default & normalisasi konten
│   │   ├── galleryUpload.js  # Alur simpan-foto (validasi, upload, cleanup saat gagal)
│   │   ├── galleryStorage.js # Client endpoint /api/upload.php (upload & hapus)
│   │   ├── adminError.js     # Pesan error ramah untuk admin
│   │   └── AuthContext.jsx   # Status sesi admin
│   ├── App.jsx               # Router utama + proteksi rute admin
│   ├── main.jsx              # Entry point React
│   └── index.css             # Entry point CSS (Tailwind)
├── tests/                    # Tes Node (npm test) + tes backend PHP
├── index.html                # Template HTML utama
├── firestore.rules           # Aturan akses Cloud Firestore (wajib dipublikasikan)
├── storage.rules             # Aturan Firebase Storage (opsional; upload foto utama lewat Cloudinary)
├── .env.example              # Contoh variabel environment
├── package.json              # Daftar dependency & script
├── tailwind.config.js        # Konfigurasi Tailwind
├── postcss.config.js         # Konfigurasi PostCSS
├── vite.config.js            # Konfigurasi Vite
└── README.md                 # File ini 📖
```

---

## 🧪 Menjalankan Tes

```bash
npm run lint     # oxlint (target: 0 warning)
npm test         # 23 unit test alur admin/upload (tanpa koneksi cloud)
npm run build    # build produksi ke dist/
```

Opsional (butuh PHP 8.2+ dengan curl & fileinfo) — untuk memverifikasi `api/upload.php`:
```bash
php -l api/upload.php
php tests/upload-backend.test.php
```

---

## 🚀 Cara Deploy

Website ini **butuh hosting dengan PHP 8.2+** agar upload foto berfungsi (endpoint `api/upload.php`), jadi hosting statis murni seperti Vercel/Netlify **tidak disarankan** — situs tetap jalan di sana, tetapi semua upload foto akan error.

Rekomendasi (sesuai konfigurasi proyek ini): **shared hosting dengan hPanel (mis. Hostinger)**. Panduan langkah demi langkah — struktur folder `public_html`/`private`, config rahasia, aturan `.htaccess`, hingga checklist verifikasi pasca-deploy — ada di **[docs/gallery-upload.md](./docs/gallery-upload.md)**.

Ringkasnya:
1. `npm run build` → salin **isi `dist/`** ke `public_html/`.
2. Salin `api/upload.php` ke `public_html/api/`.
3. Salin `api/config.example.php` → `private/gallery-upload.php` (di LUAR `public_html`), isi kunci Firebase/Cloudinary + allowlist admin.
4. Publikasikan `firestore.rules` di Firebase Console.
5. **Nonaktifkan preset unsigned Cloudinary lama** (lihat docs — langkah wajib keamanan).
6. Jalankan checklist smoke test pasca-deploy di docs.

### Environment variables saat build
Semua `VITE_*` diisi lewat konfigurasi build hosting masing-masing — nilainya ikut ter-bundle dan bersifat publik; jangan pernah menaruh secret Cloudinary/API di sana. Endpoint upload mengambil konfigurasi rahasia dari file private server (`private/gallery-upload.php`), bukan dari `.env`.

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik mata kuliah **Inovasi Sosial**. Bebas digunakan dan dimodifikasi untuk tujuan non-komersial.

---

<p align="center">
  <b>Made with ❤️ by Kelompok Inovasi Sosial — SDN 027 Balikpapan Utara</b>
</p>
