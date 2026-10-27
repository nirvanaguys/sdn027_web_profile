import test from 'node:test';
import assert from 'node:assert/strict';

const modulePath = '../src/data/galleryUpload.js';

test('edit judul mempertahankan URL lama tanpa upload', async () => {
  const { saveGalleryPhoto } = await import(modulePath);
  const result = await saveGalleryPhoto({ judul: 'Judul baru', url: 'https://example.test/old.jpg' }, {
    upload: async () => assert.fail('Tidak perlu upload ulang'),
    save: async (item) => item,
  });
  assert.deepEqual(result, { judul: 'Judul baru', url: 'https://example.test/old.jpg' });
});

test('hapus upload baru jika penyimpanan galeri gagal', async () => {
  const { saveGalleryPhoto } = await import(modulePath);
  const failure = new Error('Firestore gagal');
  let removed;
  await assert.rejects(saveGalleryPhoto({ judul: 'Foto', file: new File(['photo'], 'foto.png', { type: 'image/png' }) }, {
    upload: async () => ({ url: 'https://example.test/new.png', path: 'gallery/new.png' }),
    save: async () => { throw failure; },
    remove: async (path) => { removed = path; },
  }), (error) => error === failure);
  assert.equal(removed, 'gallery/new.png');
});

test('upload gagal tidak menulis dokumen galeri', async () => {
  const { saveGalleryPhoto } = await import(modulePath);
  await assert.rejects(saveGalleryPhoto({ judul: 'Foto', file: new File(['photo'], 'foto.webp', { type: 'image/webp' }) }, {
    upload: async () => { throw new Error('Upload gagal'); },
    save: async () => assert.fail('Jangan simpan saat upload gagal'),
  }), /Upload gagal/);
});

test('validasi jenis dan ukuran foto sebelum upload', async () => {
  const { validateGalleryFile, saveGalleryPhoto } = await import(modulePath);
  for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
    assert.doesNotThrow(() => validateGalleryFile({ type, size: 5 * 1024 * 1024 }));
  }
  for (const file of [null, { type: 'image/svg+xml', size: 1 }, { type: 'image/jpeg', size: 0 }, { type: 'image/png', size: 5 * 1024 * 1024 + 1 }]) {
    assert.throws(() => validateGalleryFile(file));
  }
  await assert.rejects(saveGalleryPhoto({ judul: 'Foto', file: { type: 'text/plain', size: 1 } }, {
    upload: async () => assert.fail('File tidak valid tidak boleh diupload'),
    save: async () => assert.fail('File tidak valid tidak boleh disimpan'),
  }), /JPG|PNG|WebP/);
});

test('upload foto baru sebelum menyimpan URL galeri', async () => {
  const { saveGalleryPhoto } = await import(modulePath);
  const file = new File(['photo'], 'foto.jpg', { type: 'image/jpeg' });
  const calls = [];
  const result = await saveGalleryPhoto({ judul: 'Sekolah', file }, {
    upload: async (received) => { assert.equal(received, file); calls.push('upload'); return { url: 'https://example.test/photo.jpg', path: 'gallery/new.jpg' }; },
    save: async (item) => { calls.push('save'); assert.deepEqual(item, { judul: 'Sekolah', url: 'https://example.test/photo.jpg' }); return { id: 'new', ...item }; },
    remove: async () => assert.fail('Foto yang berhasil disimpan tidak boleh dihapus'),
  });
  assert.deepEqual(calls, ['upload', 'save']);
  assert.equal(result.id, 'new');
});
