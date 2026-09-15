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
- Memiliki sistem admin sederhana untuk pengelolaan konten.

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
- **Dashboard Admin** — Sistem login untuk menambah/menghapus berita.

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
| Database | localStorage (simulasi database lokal) |
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

### 4. Jalankan Website

```bash
npm run dev
```

Setelah muncul pesan seperti ini:
```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

Buka browser dan kunjungi **http://localhost:5173/** — website profil SDN 027 sudah berjalan! 🎉

### 5. Akses Dashboard Admin

1. Klik tombol **"Admin"** di pojok kanan atas navbar.
2. Login dengan kredensial bawaan:
   - **Username:** `admin`
   - **Password:** `sdn027`
3. Setelah login, kamu bisa menambah/menghapus berita dan melihat galeri.

> 💡 Data berita dan galeri disimpan di `localStorage` browser. Jika kamu membuka website di browser lain atau menghapus cache, data akan kembali ke default.

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
├── public/              # File statis (favicon, gambar umum)
├── src/
│   ├── components/      # Komponen React modular
│   │   ├── Navbar.jsx   # Navigasi utama
│   │   ├── Footer.jsx   # Footer dengan kontak
│   │   ├── NewsCard.jsx # Kartu berita
│   │   └── SectionHead.jsx # Header section reusable
│   ├── pages/           # Halaman-halaman
│   │   ├── Home.jsx     # Beranda
│   │   ├── Profil.jsx   # Profil sekolah
│   │   ├── Akademik.jsx # Program akademik
│   │   ├── Berita.jsx   # Daftar berita
│   │   ├── Galeri.jsx   # Galeri foto
│   │   └── admin/
│   │       ├── Login.jsx    # Halaman login admin
│   │       └── Dashboard.jsx # Dashboard admin
│   ├── data/
│   │   └── store.js     # Simulasi database (localStorage)
│   ├── App.jsx          # Router utama aplikasi
│   ├── main.jsx         # Entry point React
│   └── index.css        # Entry point CSS (Tailwind)
├── index.html           # Template HTML utama
├── package.json         # Daftar dependency & script
├── tailwind.config.js   # Konfigurasi Tailwind
├── postcss.config.js    # Konfigurasi PostCSS
├── vite.config.js       # Konfigurasi Vite
└── README.md            # File ini 📖
```

---

## 🚀 Cara Deploy (Opsional)

Cara termudah dan gratis adalah menggunakan **Vercel**:

1. Buka https://vercel.com/ dan login dengan akun GitHub kamu.
2. Klik **"Add New Project"** → Import repo `sdn027_web_profile`.
3. Vercel akan otomatis mendeteksi ini proyek Vite. Klik **Deploy**.
4. Tunggu 1–2 menit, dan website akan memiliki URL publik (contoh: `sdn027-web-profile.vercel.app`).

### Alternatif: Netlify
1. Buka https://www.netlify.com/ dan login dengan akun GitHub.
2. Klik **"Add new site"** → **"Import an existing project"**.
3. Pilih repo `sdn027_web_profile`.
4. Build command: `npm run build`, Publish directory: `dist`.
5. Klik **Deploy**.

---

## 🌐 Build untuk Production

Jika ingin membuat versi siap *deploy*:
```bash
npm run build
```

Hasil *build* akan muncul di folder `dist/` yang siap di-upload ke hosting statis.

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik mata kuliah **Inovasi Sosial**. Bebas digunakan dan dimodifikasi untuk tujuan non-komersial.

---

<p align="center">
  <b>Made with ❤️ by Kelompok Inovasi Sosial — SDN 027 Balikpapan Utara</b>
</p>