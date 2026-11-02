import test from 'node:test';
import assert from 'node:assert/strict';

test('Profil menyimpan URL foto kepala sekolah tanpa mengubah data lain', async () => {
  const { saveProfilePhoto } = await import('../src/data/galleryUpload.js');
  const data = { principalName: 'Kepala Sekolah', principalQuote: 'Sambutan', principalPhoto: '' };
  const file = new File(['foto'], 'kepsek.jpg', { type: 'image/jpeg' });
  let saved;
  const result = await saveProfilePhoto(data, file, {
    upload: async () => ({ url: 'https://example.test/kepsek.jpg', path: 'gallery/kepsek.jpg' }),
    save: async (item) => { saved = item; return item; },
  });
  assert.deepEqual(saved, { ...data, principalPhoto: 'https://example.test/kepsek.jpg' });
  assert.deepEqual(result, saved);
});

test('Profil tanpa foto baru mempertahankan foto lama', async () => {
  const { saveProfilePhoto } = await import('../src/data/galleryUpload.js');
  const data = { principalName: 'Kepala Sekolah', principalPhoto: 'https://example.test/old.jpg' };
  assert.deepEqual(await saveProfilePhoto(data, null, {
    upload: async () => assert.fail('Tidak perlu upload'),
    save: async (item) => { assert.deepEqual(item, data); return item; },
  }), data);
});
