import { getFirebaseServices } from './firebase';
import { validateGalleryFile } from './galleryUpload';

export async function uploadGalleryPhoto(file) {
  validateGalleryFile(file);
  const user = getFirebaseServices().auth.currentUser;
  if (!user) throw new Error('Silakan masuk sebagai admin sebelum upload.');
  const token = await user.getIdToken();
  const body = new FormData();
  body.append('file', file);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch('/api/upload.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
      signal: controller.signal,
      credentials: 'same-origin',
      redirect: 'error',
    });
    const result = await response.json();
    if (!response.ok) throw new Error('Upload ditolak.');
    if (typeof result.url !== 'string' || !result.url.startsWith('https://') || typeof result.path !== 'string' || !result.path) {
      throw new Error('Respons server upload tidak valid.');
    }
    return { url: result.url, path: result.path };
  } catch {
    if (controller.signal.aborted) throw new Error('Upload melewati batas waktu. Coba lagi.');
    throw new Error('Upload foto gagal. Periksa sesi admin dan koneksi atau hubungi pengelola hosting.');
  } finally {
    clearTimeout(timeout);
  }
}

export async function removeGalleryUpload(path) {
  if (!path) return;
  const user = getFirebaseServices().auth.currentUser;
  if (!user) return;
  const token = await user.getIdToken();
  const body = new URLSearchParams();
  body.set('action', 'delete');
  body.set('path', path);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('/api/upload.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
      redirect: 'error',
      credentials: 'same-origin',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('delete failed');
  } catch {
    // Cleanup best-effort: don't block UI save flow.
  } finally {
    clearTimeout(timeout);
  }
}
