import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Substitute only the Firebase boundary; run the actual upload implementation.
async function loadUpload(user) {
  globalThis.__uploadAuth = { currentUser: user };
  let source = await readFile(new URL('../src/data/galleryStorage.js', import.meta.url), 'utf8');
  source = source.replaceAll('import.meta.env', '({ VITE_CLOUDINARY_CLOUD_NAME: "old-cloud", VITE_CLOUDINARY_UPLOAD_PRESET: "old-preset" })');
  source = source.replace(/import .* from '.\/firebase(?:\.js)?';/, 'const getFirebaseServices = () => ({ auth: globalThis.__uploadAuth });');
  source = source.replace("'./galleryUpload'", JSON.stringify(new URL('../src/data/galleryUpload.js', import.meta.url).href));
  source = source.replace("'./galleryUpload.js'", JSON.stringify(new URL('../src/data/galleryUpload.js', import.meta.url).href));
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}#${Math.random()}`);
}
test('signed-out and failed token retrieval never contact upload server', async (t) => {
  t.mock.method(globalThis, 'fetch', () => assert.fail('No upload allowed'));
  for (const user of [null, { getIdToken: async () => { throw new Error('token failure'); } }]) {
    const { uploadGalleryPhoto } = await loadUpload(user);
    await assert.rejects(uploadGalleryPhoto(photo()));
  }
});

test('fetch timeout aborts request and clears timer', async (t) => {
  const { uploadGalleryPhoto } = await loadUpload({ getIdToken: async () => 'id-token' });
  let signal;
  t.mock.method(globalThis, 'setTimeout', (callback, delay) => {
    assert.equal(delay, 45000);
    return setImmediate(callback);
  });
  t.mock.method(globalThis, 'clearTimeout', clearImmediate);
  t.mock.method(globalThis, 'fetch', (_url, options) => new Promise((_resolve, reject) => {
    signal = options.signal;
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }));
  await assert.rejects(uploadGalleryPhoto(photo()), /batas waktu/);
  assert.equal(signal.aborted, true);
});

test('errors and malformed responses do not expose upstream details', async (t) => {
  const { uploadGalleryPhoto } = await loadUpload({ getIdToken: async () => 'id-token' });
  for (const response of [
    { ok: false, json: async () => ({ error: 'SECRET upstream error' }) },
    { ok: true, json: async () => ({ url: 'http://unsafe', path: 'a' }) },
    { ok: true, json: async () => ({ url: 'https://example.test' }) },
    { ok: true, json: async () => { throw new Error('SECRET invalid JSON'); } },
  ]) {
    const mock = t.mock.method(globalThis, 'fetch', async () => response);
    await assert.rejects(uploadGalleryPhoto(photo()), (error) => !error.message.includes('SECRET'));
    mock.mock.restore();
  }
});

const photo = () => new File(['image'], 'photo.png', { type: 'image/png' });

test('cleanup upload menggunakan endpoint delete yang aman', async (t) => {
  const { removeGalleryUpload } = await loadUpload({ getIdToken: async () => 'id-token' });
  let calledWith;
  t.mock.method(globalThis, 'fetch', async (url, options) => { calledWith = { url, options }; return { ok: true, json: async () => ({ ok: true }) }; });
  await removeGalleryUpload('gallery/a');
  assert.ok(calledWith, 'delete must contact the upload server');
  assert.equal(calledWith.url, '/api/upload.php');
  assert.equal(calledWith.options.method, 'POST');
  assert.equal(calledWith.options.headers.Authorization, 'Bearer id-token');
  assert.match(calledWith.options.headers['Content-Type'], /application\/x-www-form-urlencoded/);
  assert.equal(calledWith.options.body.get('action'), 'delete');
  assert.equal(calledWith.options.body.get('path'), 'gallery/a');
});

test('cleanup tanpa path atau sesi tidak menghubungi server', async (t) => {
  const { removeGalleryUpload } = await loadUpload({ getIdToken: async () => { throw new Error('no session'); } });
  t.mock.method(globalThis, 'fetch', () => assert.fail('No delete allowed'));
  await removeGalleryUpload('');
});
