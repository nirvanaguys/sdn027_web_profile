import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const apiSource = () => readFile(new URL('../src/data/api.js', import.meta.url), 'utf8');
const dashboardSource = () => readFile(new URL('../src/pages/admin/Dashboard.jsx', import.meta.url), 'utf8');

test('normalizeHome converts saved stat objects before form serialization', async () => {
  const { normalizeHome } = await import('../src/data/content.js');
  const normalized = normalizeHome({ stats: [{ value: '12', label: 'Kelas' }] });
  assert.deepEqual(normalized.stats, [['12', 'Kelas']]);
  assert.equal(normalized.stats.map((item) => item.join(' | ')).join('\n'), '12 | Kelas');
});

test('news and gallery do not silently replace Firebase results with demo content', async () => {
  const source = await apiSource();
  assert.doesNotMatch(source, /defaultNews|defaultGallery/);
});

test('admin blocks default-content saves when initial loading fails', async () => {
  const source = await dashboardSource();
  assert.match(source, /loadError/);
  assert.match(source, /setLoadError/);
  assert.match(source, /role="alert"/);
});
