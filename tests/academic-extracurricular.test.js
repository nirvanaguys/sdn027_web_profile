import test from 'node:test';
import assert from 'node:assert/strict';

test('normalizeAcademic menerima format objek lama dan triple baru', async () => {
  const { normalizeAcademic } = await import('../src/data/content.js');
  const legacy = normalizeAcademic({ extracurriculars: [{ title: 'Futsal', description: 'Olahraga' }] });
  assert.deepEqual(legacy.extracurriculars, [['Futsal', 'Olahraga', '']]);

  const modern = normalizeAcademic({ extracurriculars: [{ title: 'Voli', description: 'Tim', image: 'https://example.test/voli.jpg' }] });
  assert.deepEqual(modern.extracurriculars, [['Voli', 'Tim', 'https://example.test/voli.jpg']]);
});
