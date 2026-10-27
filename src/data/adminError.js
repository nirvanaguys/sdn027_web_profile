export function friendlyAdminError(error) {
  const details = [];
  const seen = new Set();
  for (let current = error; current && !seen.has(current); current = current.cause) {
    seen.add(current);
    details.push(current.code || '', current.message || '');
  }
  const text = details.join(' ');
  if (/unauthorized|permission-denied/i.test(text)) return 'Akun ini belum memiliki izin untuk menyimpan perubahan. Hubungi pengelola website.';
  if (/unauthenticated|user-token-expired/i.test(text) || error?.status === 401) return 'Sesi masuk sudah berakhir. Silakan masuk kembali, lalu coba lagi.';
  if (/belum dikonfigurasi|bucket-not-found|no-default-bucket/i.test(text)) return 'Layanan penyimpanan foto belum siap. Hubungi pengelola website untuk mengaktifkannya.';
  if (/retry-limit-exceeded|batas waktu|network|unavailable|CORS/i.test(text)) return 'Tidak dapat terhubung ke layanan penyimpanan. Periksa koneksi internet lalu coba lagi. Jika masih gagal, hubungi pengelola website.';
  if (/5 MB/.test(text)) return 'Foto terlalu besar atau kosong. Pilih foto yang berukuran maksimal 5 MB.';
  if (/Gunakan foto JPG/.test(text)) return 'Format foto belum didukung. Pilih foto JPG, PNG, atau WebP.';
  if (/Pilih foto terlebih dahulu/.test(text)) return 'Pilih foto terlebih dahulu sebelum menyimpan.';
  return 'Terjadi kendala pada aplikasi. Coba muat ulang halaman. Jika masih gagal, hubungi pengelola website.';
}
