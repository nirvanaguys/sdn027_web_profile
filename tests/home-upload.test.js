import test from 'node:test';
import assert from 'node:assert/strict';

test('Beranda menyimpan URL upload baru tanpa mengubah konten lain', async () => {
  const { saveHomePhoto } = await import('../src/data/galleryUpload.js');
  const data = { heroTitle: 'Sekolah', heroImage: 'old', mission: ['Belajar'] };
  const file = new File(['foto'], 'foto.jpg', { type: 'image/jpeg' });
  let saved;
  const result = await saveHomePhoto(data, file, {
    upload: async () => ({ url: 'new', path: 'gallery/new.jpg' }),
    save: async (item) => { saved = item; return item; },
  });
  assert.deepEqual(saved, { ...data, heroImage: 'new' });
  assert.deepEqual(result, saved);
});

test('Beranda tanpa foto baru mempertahankan foto lama', async () => {
  const { saveHomePhoto } = await import('../src/data/galleryUpload.js');
  const data = { heroTitle: 'Sekolah', heroImage: 'old' };
  assert.deepEqual(await saveHomePhoto(data, null, {
    upload: async () => assert.fail('Tidak perlu upload'),
    save: async (item) => { assert.deepEqual(item, data); return item; },
  }), data);
});
