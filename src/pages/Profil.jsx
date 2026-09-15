import { Quote, BadgeCheck, Building2, BookMarked, CalendarClock, MapPin } from "lucide-react";
import SectionHead from "../components/SectionHead";

const dataSekolah = [
  { icon: BadgeCheck, label: "Status", nilai: "Sekolah Negeri · Akreditasi A" },
  { icon: BookMarked, label: "Kurikulum", nilai: "Kurikulum Merdeka" },
  { icon: CalendarClock, label: "Jam Belajar", nilai: "Senin–Sabtu, 07.00–13.00 WITA" },
  { icon: MapPin, label: "Lokasi", nilai: "Balikpapan Utara, Kalimantan Timur" },
];

export default function Profil() {
  return (
    <div className="container-page py-14 md:py-20">
      <SectionHead
        eyebrow="Profil Sekolah"
        title="Mengenal SDN 027 Balikpapan Utara"
        sub="Lebih dari tiga dekade mendampingi anak-anak Balikpapan Utara tumbuh cerdas dan berkarakter."
      />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card p-8">
          <h2 className="font-display text-2xl font-extrabold text-primary-900">Sekilas Tentang Kami</h2>
          {/* Ganti paragraf ini dengan sejarah asli sekolah versi guru/kepsek */}
          <p className="mt-4 leading-relaxed text-ink/70">
            SDN 027 Balikpapan Utara berdiri pada awal 1990-an dan sejak itu menjadi rumah belajar bagi ratusan anak di sekitar kecamatan Balikpapan Utara. Dari ruang-ruang kelas yang sederhana, sekolah ini tumbuh menjadi sekolah dasar negeri berakreditasi A yang dikenal hangat dan ramah anak.
          </p>
          <p className="mt-3 leading-relaxed text-ink/70">
            Hari ini, dengan dukungan 25+ guru dan staf serta kepercayaan 450+ keluarga siswa, kami terus berbenah: memperkaya kegiatan belajar, memperkuat pendidikan karakter, dan membuka diri terhadap masyarakat melalui website ini.
          </p>
        </div>

        <div className="card relative overflow-hidden bg-primary-600 p-8 text-white">
          <Quote size={40} className="absolute -right-3 -top-3 text-white/10" />
          <h2 className="font-display text-xl font-extrabold">Sambutan Kepala Sekolah</h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-100">
            "Setiap anak yang masuk gerbang sekolah kami adalah amanah. Tugas kami bukan hanya mengajar, tetapi menemani mereka tumbuh menjadi pribadi yang baik."
          </p>
          {/* Ganti dengan nama kepala sekolah yang sebenarnya */}
          <p className="mt-6 font-display font-bold text-honey-300">— Kepala Sekolah SDN 027</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dataSekolah.map((d) => (
          <div key={d.label} className="card flex items-start gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
              <d.icon size={20} />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-ink/40">{d.label}</p>
              <p className="mt-1 text-sm font-bold text-primary-900">{d.nilai}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}