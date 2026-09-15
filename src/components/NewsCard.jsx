import { CalendarDays } from "lucide-react";

const catClass = {
  Kegiatan: "bg-leaf-100 text-leaf-700",
  Prestasi: "bg-honey-100 text-honey-700",
  Pengumuman: "bg-primary-100 text-primary-700",
};

export default function NewsCard({ item }) {
  const tanggal = /^\d{4}-\d{2}-\d{2}$/.test(item.tanggal)
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${item.tanggal}T00:00:00`))
    : item.tanggal;
  return (
    <article className="card flex flex-col p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${catClass[item.kategori] ?? "bg-ink/10 text-ink/60"}`}>
          {item.kategori || "Umum"}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-ink/50">
          <CalendarDays size={14} /> {tanggal}
        </span>
      </div>
      <h3 className="font-display text-lg font-bold leading-snug text-primary-900">{item.judul}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.isi}</p>
    </article>
  );
}
