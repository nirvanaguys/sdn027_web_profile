import { useEffect, useRef } from 'react';
import { friendlyAdminError } from '../../data/adminError';
import { validateGalleryFile } from '../../data/galleryUpload';

export default function GalleryPhotoField({ file, url, onChange, disabled }) {
  const previewRef = useRef(null);


  useEffect(() => {
    if (!file || !previewRef.current) return;
    const objectUrl = URL.createObjectURL(file);
    previewRef.current.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return <div className="mt-4">
    <label className="block text-sm font-bold text-ink/70">Pilih foto
      <input type="file" accept="image/jpeg,image/png,image/webp" required={!url} disabled={disabled}
        aria-describedby="gallery-photo-hint"
        className="mt-2 block w-full rounded-xl border border-primary-200 p-3 text-sm font-normal"
        onChange={(event) => {
          const selected = event.target.files?.[0];

          if (!selected) { onChange(null); return; }
          try { validateGalleryFile(selected); onChange(selected); }
          catch (failure) { event.target.value = ''; onChange(null); window.alert(friendlyAdminError(failure)); }
        }} />
    </label>
    <p id="gallery-photo-hint" className="mt-2 text-xs text-ink/50">JPG, PNG, atau WebP, maksimal 5 MB.{url && ' Kosongkan untuk tetap memakai foto lama.'}</p>

    {(file || url) && <img key={file ? 'upload' : url} ref={previewRef} src={file ? undefined : url} alt="Pratinjau foto galeri" className="mt-3 max-h-56 w-full rounded-xl object-contain" />}
  </div>;
}
