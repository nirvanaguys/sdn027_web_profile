export function validateGalleryFile(file) {
  if (!file) throw new Error('Pilih foto terlebih dahulu.');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Gunakan foto JPG, PNG, atau WebP.');
  }
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > 5 * 1024 * 1024) {
    throw new Error('Foto harus berisi data dan berukuran maksimal 5 MB.');
  }
}

async function cleanupUpload(photo, remove) {
  if (!photo || typeof remove !== 'function') return;
  try {
    await remove(photo.path);
  } catch (cleanupError) {
    console.warn('Gagal membersihkan upload yang belum tersimpan:', cleanupError);
  }
}

export async function saveHomePhoto(data, file, { upload, save, remove }) {
  if (!file) return save(data);
  validateGalleryFile(file);
  const photo = await upload(file);
  try {
    return await save({ ...data, heroImage: photo.url });
  } catch (error) {
    await cleanupUpload(photo, remove);
    throw error;
  }
}

export async function saveProfilePhoto(data, file, { upload, save, remove }) {
  if (!file) return save(data);
  validateGalleryFile(file);
  const photo = await upload(file);
  try {
    return await save({ ...data, principalPhoto: photo.url });
  } catch (error) {
    await cleanupUpload(photo, remove);
    throw error;
  }
}

export async function saveGalleryPhoto({ judul, file, url }, { upload, save, remove }) {
  if (!file && url) return save({ judul, url });
  validateGalleryFile(file);
  const photo = await upload(file);
  try {
    return await save({ judul, url: photo.url });
  } catch (error) {
    await cleanupUpload(photo, remove);
    throw error;
  }
}
