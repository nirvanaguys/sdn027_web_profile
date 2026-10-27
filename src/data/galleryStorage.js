import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { getFirebaseServices } from './firebase';
import { validateGalleryFile } from './galleryUpload';
import { waitForPhotoUpload } from './photoUploadTask';

export async function uploadGalleryPhoto(file) {
  validateGalleryFile(file);
  const { auth } = getFirebaseServices();
  if (!auth.app.options.storageBucket) {
    throw new Error('Firebase Storage belum dikonfigurasi. Atur VITE_FIREBASE_STORAGE_BUCKET terlebih dahulu.');
  }
  const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[file.type];
  const storage = getStorage(auth.app);
  storage.maxUploadRetryTime = 30000;
  storage.maxOperationRetryTime = 15000;
  const reference = ref(storage, `gallery/${crypto.randomUUID()}.${extension}`);
  try {
    await waitForPhotoUpload(uploadBytesResumable(reference, file, { contentType: file.type }));
  } catch (error) {
    throw new Error(`Upload foto gagal: ${error.message} Periksa aktivasi/nama bucket Firebase Storage dan aturan akses admin.`, { cause: error });
  }
  try {
    return { url: await getDownloadURL(reference), path: reference.fullPath };
  } catch (error) {
    try { await deleteObject(reference); } catch (cleanupError) {
      console.warn('Gagal membersihkan upload tanpa URL:', cleanupError);
    }
    throw new Error('Gagal mendapatkan URL foto. Silakan coba lagi.', { cause: error });
  }
}

export function removeGalleryUpload(path) {
  return deleteObject(ref(getStorage(getFirebaseServices().auth.app), path));
}
