import test from 'node:test';
import assert from 'node:assert/strict';

test('error teknis disembunyikan dari pengguna', async () => {
  const { friendlyAdminError } = await import('../src/data/adminError.js');
  assert.equal(friendlyAdminError(new TypeError('storage.setMaxUploadRetryTime is not a function')), 'Terjadi kendala pada aplikasi. Coba muat ulang halaman. Jika masih gagal, hubungi pengelola website.');
});

test('error izin, koneksi dan ukuran foto punya petunjuk sederhana', async () => {
  const { friendlyAdminError } = await import('../src/data/adminError.js');
  assert.match(friendlyAdminError(new Error('wrapper', { cause: { code: 'storage/unauthorized' } })), /izin/);
  assert.match(friendlyAdminError({ code: 'storage/retry-limit-exceeded' }), /koneksi internet/);
  assert.match(friendlyAdminError(new Error('Foto harus berisi data dan berukuran maksimal 5 MB.')), /5 MB/);
  assert.match(friendlyAdminError(new Error('Firebase Storage belum dikonfigurasi.')), /penyimpanan foto belum siap/);
});
