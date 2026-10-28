
import { validateGalleryFile } from './galleryUpload';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadGalleryPhoto(file) {
  validateGalleryFile(file);

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary belum dikonfigurasi. Periksa Cloud name dan Upload Preset di file .env.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  let response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
  } catch (error) {
    throw new Error(
      'Tidak dapat terhubung ke Cloudinary. Periksa koneksi internet.',
      { cause: error }
    );
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `Upload foto gagal: ${
        result?.error?.message || 'Periksa konfigurasi Cloudinary.'
      }`
    );
  }

  if (!result.secure_url) {
    throw new Error('Cloudinary tidak memberikan URL foto.');
  }

  return {
    url: result.secure_url,
    path: result.public_id || '',
  };
}

export async function removeGalleryUpload() {
  // Penghapusan aset Cloudinary memerlukan proses server yang aman.
  // Jangan menaruh API Secret di frontend.
}
