export function waitForPhotoUpload(task, timeoutMs = 45000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Upload melewati batas waktu. Periksa koneksi serta aktivasi dan nama bucket Firebase Storage, lalu coba lagi.'));
      task.cancel();
    }, timeoutMs);
    task.then((snapshot) => { clearTimeout(timer); resolve(snapshot); }, (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}
