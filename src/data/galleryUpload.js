export function validateGalleryFile(file) {
  if (!file) throw new Error('Pilih foto terlebih dahulu.');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Gunakan foto JPG, PNG, atau WebP.');
  }
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > 5 * 1024 * 1024) {
    throw new Error('Foto harus berisi data dan berukuran maksimal 5 MB.');
  }
}

export async function saveHomePhoto(data, file, { upload, save }) {
  if (!file) return save(data);
  validateGalleryFile(file);
  const photo = await upload(file);
  return save({ ...data, heroImage: photo.url });
}

export async function saveGalleryPhoto({ judul, file, url }, { upload, save, remove }) {
  if (!file && url) return save({ judul, url });
  validateGalleryFile(file);
  const photo = await upload(file);
  try {
    return await save({ judul, url: photo.url });
  } catch (error) {
    try {
      await remove(photo.path);
    } catch (cleanupError) {
      console.warn('Gagal membersihkan upload yang belum tersimpan:', cleanupError);
    }
    throw error;
  }
}
