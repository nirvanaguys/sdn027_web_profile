# Upload foto galeri

Panel Admin → Galeri menerima JPG, PNG, dan WebP maksimal 5 MB. File disimpan di Firebase Storage pada `gallery/<UUID>.<ext>`, sedangkan Firestore tetap menyimpan `judul` dan `url`. Foto lama tetap kompatibel. Edit judul tidak mengharuskan upload ulang.

## Aktivasi sebelum penggunaan produksi

1. Buka project yang benar di Firebase Console → Storage. Pastikan bucket tersedia. Jika diminta mengaktifkan billing/upgrade paket, minta persetujuan pemilik terlebih dahulu.
2. Konfigurasikan `VITE_FIREBASE_STORAGE_BUCKET` dengan nama bucket tersebut di lingkungan lokal/hosting. Jangan masukkan awalan `gs://`. Restart dev server atau build ulang setelah konfigurasi berubah.
3. Pada Storage → Rules, terapkan isi `storage.rules`. Aturan ini memberi akses baca publik untuk foto galeri dan upload/hapus hanya untuk email admin yang sama dengan `firestore.rules`. Jangan menimpa aturan bucket yang dipakai aplikasi lain: gabungkan aturan dengan hati-hati.
4. Login sebagai admin, tambah foto percobaan, simpan, muat ulang halaman dan pastikan foto muncul di galeri publik. Uji juga edit judul tanpa mengganti foto, ganti foto, serta penolakan file salah format/lebih dari 5 MB.

Aturan disediakan sebagai file lokal; tidak otomatis terpasang ke Firebase. Tidak ada perubahan billing, kredensial, maupun deployment otomatis.

## Pengujian lokal

- `node --test tests/gallery-upload.test.js`
- `npm run lint`
- `npm run build`

Tes alur upload memakai adapter penyimpanan uji, bukan koneksi Firebase produksi. Upload nyata dan aturan akses cloud harus diverifikasi setelah bucket/aturan aktif.

## Perilaku file

Upload baru dibersihkan sebisa mungkin jika penyimpanan dokumen gagal. Foto lama tidak dihapus otomatis ketika diganti atau dokumen galeri dihapus, agar tautan yang sudah dipakai di tempat lain tidak rusak. File tak terpakai dapat dibersihkan secara manual setelah dipastikan tidak digunakan. Pemeriksaan format menggunakan MIME type; ini bukan pemeriksaan isi berkas atau pemindaian malware.
