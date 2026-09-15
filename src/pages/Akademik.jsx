import { Compass, Medal, Music, FlaskConical, Clock } from "lucide-react";
import SectionHead from "../components/SectionHead";

const ekskul = [
  { icon: Compass, warna: "bg-leaf-50 text-leaf-600", judul: "Pramuka", isi: "Membentuk karakter, kemandirian, dan jiwa kepemimpinan." },
  { icon: Medal, warna: "bg-honey-50 text-honey-600", judul: "Olahraga", isi: "Sepak bola, bulu tangkis, dan senam pagi setiap pekan." },
  { icon: Music, warna: "bg-primary-50 text-primary-600", judul: "Seni & Tari", isi: "Tari tradisional, musik, dan prakarya untuk melatih kreativitas." },
  { icon: FlaskConical, warna: "bg-leaf-50 text-leaf-600", judul: "Klub Sains", isi: "Persiapan olimpiade sains dan matematika tingkat kota." },
];

const jadwal = [
  ["Senin – Kamis", "07.00 – 13.00 WITA"],
  ["Jumat", "07.00 – 11.30 WITA"],
  ["Sabtu", "Kegiatan ekstrakurikuler"],
];

export default function Akademik() {
  return (
    <div className="container-page py-14 md:py-20">
      <SectionHead
        eyebrow="Program Akademik"
        title="Belajar yang menyenangkan, hasil yang bermakna"
      />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card p-8">
          <h2 className="font-display text-2xl font-extrabold text-primary-900">Kurikulum & Pendekatan Belajar</h2>
          <p className="mt-4 leading-relaxed text-ink/70">
            SDN 027 Balikpapan Utara menerapkan kurikulum nasional yang disesuaikan dengan kebutuhan peserta didik. Pembelajaran dirancang aktif: anak diajak mengamati, mencoba, dan berdiskusi — bukan sekadar mencatat.
          </p>
          <ul className="mt-5 space-y-2 text-ink/70">
            {["Pembelajaran berbasis kegiatan dan proyek sederhana", "Penguatan literasi & numerasi setiap pagi", "Penilaian yang memperhatikan proses, bukan hanya nilai akhir"].map((p) => (
              <li key={p} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-honey-500" /> {p}</li>
            ))}
          </ul>
        </div>

        <div className="card p-8">
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-primary-900">
            <Clock size={20} className="text-honey-500" /> Jam Belajar
          </h2>
          <ul className="mt-5 divide-y divide-primary-100">
            {jadwal.map(([hari, jam]) => (
              <li key={hari} className="flex items-center justify-between py-3 text-sm">
                <span className="font-bold text-ink/70">{hari}</span>
                <span className="font-extrabold text-primary-700">{jam}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink/40">* Jadwal dapat menyesuaikan kalender pendidikan yang berlaku.</p>
        </div>
      </div>

      <h2 className="mt-14 font-display text-2xl font-extrabold text-primary-900">Ekstrakurikuler</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ekskul.map((e) => (
          <div key={e.judul} className="card p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${e.warna}`}><e.icon size={24} /></span>
            <h3 className="mt-4 font-display text-lg font-bold text-primary-900">{e.judul}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{e.isi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}