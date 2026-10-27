import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { initializeApp, deleteApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

test('konfigurasi retry upload kompatibel dengan Firebase yang terpasang', async () => {
  const source = await readFile(new URL('../src/data/galleryStorage.js', import.meta.url), 'utf8');
  const settings = source.split('\n').filter((line) => /storage\.(setMax|max).*RetryTime/.test(line)).join('\n');
  assert.ok(settings);
  const app = initializeApp({ projectId: 'local-test', storageBucket: 'local-test.appspot.com' }, 'settings-test');
  try {
    const storage = getStorage(app);
    new Function('storage', settings)(storage);
    assert.equal(storage.maxUploadRetryTime, 30000);
    assert.equal(storage.maxOperationRetryTime, 15000);
  } finally { await deleteApp(app); }
});
