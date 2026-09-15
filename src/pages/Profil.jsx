import { useEffect, useState } from "react";
import { Quote, BadgeCheck, BookMarked, CalendarClock, MapPin } from "lucide-react";
import SectionHead from "../components/SectionHead";
import { getContent } from "../data/api";
import { defaultProfile, mergeContent, normalizeProfile } from "../data/content";

const dataSekolah = [
  { icon: BadgeCheck, label: "Status", nilai: "Sekolah Negeri · Akreditasi A" },
  { icon: BookMarked, label: "Kurikulum", nilai: "Kurikulum Merdeka" },
  { icon: CalendarClock, label: "Jam Belajar", nilai: "Senin–Sabtu, 07.00–13.00 WITA" },
  { icon: MapPin, label: "Lokasi", nilai: "Balikpapan Utara, Kalimantan Timur" },
];

export default function Profil() {
  const [content, setContent] = useState(defaultProfile);
  useEffect(() => { getContent('profile').then((data) => data && setContent(mergeContent(defaultProfile, normalizeProfile(data)))).catch(() => {}); }, []);
  const dataSekolah = content.details.map(([label, nilai], index) => ({ icon: [BadgeCheck, BookMarked, CalendarClock, MapPin][index] || BadgeCheck, label, nilai }));
  return (
    <div className="container-page py-14 md:py-20">
      <SectionHead
        eyebrow="Profil Sekolah"
        title={content.title}
        sub={content.sub}
      />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card p-8">
          <h2 className="font-display text-2xl font-extrabold text-primary-900">Sekilas Tentang Kami</h2>
          <p className="mt-4 leading-relaxed text-ink/70">
            {content.history1}
          </p>
          <p className="mt-3 leading-relaxed text-ink/70">
            {content.history2}
          </p>
        </div>

        <div className="card relative overflow-hidden bg-primary-600 p-8 text-white">
          <Quote size={40} className="absolute -right-3 -top-3 text-white/10" />
          <h2 className="font-display text-xl font-extrabold">Sambutan Kepala Sekolah</h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-100">
            "{content.principalQuote}"
          </p>
          <p className="mt-6 font-display font-bold text-honey-300">— {content.principalName}</p>
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
