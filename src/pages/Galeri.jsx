import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import SectionHead from "../components/SectionHead";
import { getGallery } from "../data/api";

const ITEMS_PER_PAGE = 8;

export default function Galeri() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getGallery()
      .then(setGallery)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(gallery.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentGallery = gallery.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="container-page py-14 md:py-20">
      <SectionHead
        eyebrow="Dokumentasi"
        title="Galeri Sekolah"
        sub="Potret kegiatan belajar, acara, dan suasana sehari-hari di lingkungan SDN 027 Balikpapan Utara."
      />

      {loading ? (
        <p className="text-center text-ink/50">Memuat galeri…</p>
      ) : error ? (
        <p role="alert" className="text-center text-red-600">
          {error}
        </p>
      ) : gallery.length === 0 ? (
        <p className="text-center text-ink/50">
          Belum ada foto galeri.
        </p>
      ) : (
        <>
          <div className="grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[180px] md:grid-cols-4">
            {currentGallery.map((g, i) => (
              <figure
                key={g.id}
                className={`group relative overflow-hidden rounded-3xl shadow-sm ${
                  i === 0
                    ? "col-span-2 row-span-2"
                    : i === 5
                      ? "col-span-2"
                      : ""
                }`}
              >
                <img
                  src={g.url}
                  alt={g.judul}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-primary-900/85 to-transparent p-4 text-sm font-bold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.judul}
                </figcaption>
              </figure>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Navigasi halaman galeri"
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={currentPage === 1}
                className="rounded-full border border-primary-100 px-4 py-2 text-sm font-bold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sebelumnya
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Halaman ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`h-10 min-w-10 rounded-full px-3 text-sm font-bold transition ${
                      currentPage === page
                        ? "bg-primary-600 text-white"
                        : "border border-primary-100 text-primary-700 hover:bg-primary-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="rounded-full border border-primary-100 px-4 py-2 text-sm font-bold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
              </button>
            </nav>
          )}
        </>
      )}

      <p className="mt-8 flex items-center justify-center gap-2 text-sm text-ink/50">
        <Camera size={16} />
        Foto kegiatan baru akan terus ditambahkan oleh admin sekolah.
      </p>
    </div>
  );
}