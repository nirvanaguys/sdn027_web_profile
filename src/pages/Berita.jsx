import { useEffect, useState } from "react";
import SectionHead from "../components/SectionHead";
import NewsCard from "../components/NewsCard";
import { getNews } from "../data/api";

const ITEMS_PER_PAGE = 6;

export default function Berita() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getNews()
      .then(setNews)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNews = news.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="container-page py-14 md:py-20">
      <SectionHead
        eyebrow="Kabar Terbaru"
        title="Berita & Pengumuman"
        sub="Informasi terkini seputar kegiatan, prestasi, dan pengumuman resmi SDN 027 Balikpapan Utara."
      />

      {loading ? (
        <p className="text-center text-ink/50">Memuat berita…</p>
      ) : error ? (
        <p role="alert" className="text-center text-red-600">
          {error}
        </p>
      ) : news.length === 0 ? (
        <p className="text-center text-ink/50">
          Belum ada berita. Berita baru akan muncul setelah ditambahkan oleh admin.
        </p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentNews.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Navigasi halaman berita"
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
    </div>
  );
}
