import test from 'node:test';
import assert from 'node:assert/strict';

test('upload macet dibatalkan dan ditolak, bukan menunggu tanpa batas', async () => {
  const { waitForPhotoUpload } = await import('../src/data/photoUploadTask.js');
  let cancelled = false;
  const task = { then: () => {}, cancel: () => { cancelled = true; } };
  await assert.rejects(waitForPhotoUpload(task, 10), /batas waktu/);
  assert.equal(cancelled, true);
});

test('upload selesai mengembalikan snapshot', async () => {
  const { waitForPhotoUpload } = await import('../src/data/photoUploadTask.js');
  const snapshot = { bytesTransferred: 100 };
  assert.equal(await waitForPhotoUpload(Promise.resolve(snapshot), 100), snapshot);
});

test('error upload asli diteruskan', async () => {
  const { waitForPhotoUpload } = await import('../src/data/photoUploadTask.js');
  const error = new Error('storage/unauthorized');
  await assert.rejects(waitForPhotoUpload(Promise.reject(error), 100), (received) => received === error);
});
