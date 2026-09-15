import { useEffect, useState } from "react";
import SectionHead from "../components/SectionHead";
import NewsCard from "../components/NewsCard";
import { getNews } from "../data/api";

export default function Berita() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { getNews().then(setNews).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false)); }, []);
  return (
    <div className="container-page py-14 md:py-20">
      <SectionHead
        eyebrow="Kabar Terbaru"
        title="Berita & Pengumuman"
        sub="Informasi terkini seputar kegiatan, prestasi, dan pengumuman resmi SDN 027 Balikpapan Utara."
      />
      {loading ? <p className="text-center text-ink/50">Memuat berita…</p> : error ? <p role="alert" className="text-center text-red-600">{error}</p> : news.length === 0 ? (
        <p className="text-center text-ink/50">Belum ada berita. Berita baru akan muncul setelah ditambahkan oleh admin.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => <NewsCard key={n.id} item={n} />)}
        </div>
      )}
    </div>
  );
}
