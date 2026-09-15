import { Camera } from "lucide-react";
import SectionHead from "../components/SectionHead";
import { getGallery } from "../data/store";

export default function Galeri() {
  const gallery = getGallery();
  return (
    <div className="container-page py-14 md:py-20">
      <SectionHead
        eyebrow="Dokumentasi"
        title="Galeri Sekolah"
        sub="Potret kegiatan belajar, acara, dan suasana sehari-hari di lingkungan SDN 027 Balikpapan Utara."
      />
      <div className="grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[180px] md:grid-cols-4">
        {gallery.map((g, i) => (
          <figure
            key={g.id}
            className={`group relative overflow-hidden rounded-3xl shadow-sm ${i === 0 ? "col-span-2 row-span-2" : i === 5 ? "col-span-2" : ""}`}
          >
            <img src={g.url} alt={g.judul} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-primary-900/85 to-transparent p-4 text-sm font-bold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {g.judul}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-8 flex items-center justify-center gap-2 text-sm text-ink/50">
        <Camera size={16} /> Foto kegiatan baru akan terus ditambahkan oleh admin sekolah.
      </p>
    </div>
  );
}