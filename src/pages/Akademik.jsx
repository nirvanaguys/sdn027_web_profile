import { useEffect, useState } from "react";
import { Award, Camera, Clock, FlaskConical, Globe, Hand, Landmark, Music, ShieldCheck, Trophy, Volleyball, Whistle } from "lucide-react";
import SectionHead from "../components/SectionHead";
import { getContent } from "../data/api";
import { defaultAcademic, mergeContent, normalizeAcademic } from "../data/content";

export default function Akademik() {
  const [content, setContent] = useState(defaultAcademic);
  useEffect(() => { getContent('academic').then((data) => data && setContent(mergeContent(defaultAcademic, normalizeAcademic(data)))).catch(() => {}); }, []);
  const iconMap = {
    futsal: Whistle,
    voli: Volleyball,
    volleyball: Volleyball,
    handball: Hand,
    pramuka: Landmark,
    tari: Music,
    musik: Music,
    sains: FlaskConical,
    science: FlaskConical,
    olahraga: Trophy,
  };
  const fallbackIcons = [ShieldCheck, Award, Globe, Camera, Trophy, FlaskConical];
  const colors = ["bg-leaf-50 text-leaf-600", "bg-honey-50 text-honey-600", "bg-primary-50 text-primary-600", "bg-leaf-50 text-leaf-600", "bg-honey-50 text-honey-600", "bg-primary-50 text-primary-600"];
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
            {content.description}
          </p>
          <ul className="mt-5 space-y-2 text-ink/70">
            {content.approaches.map((p) => (
              <li key={p} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-honey-500" /> {p}</li>
            ))}
          </ul>
        </div>

        <div className="card p-8">
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-primary-900">
            <Clock size={20} className="text-honey-500" /> Jam Belajar
          </h2>
          <ul className="mt-5 divide-y divide-primary-100">
            {content.schedule.map(([hari, jam]) => (
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
        {content.extracurriculars.map(([judul, isi, image], index) => {
          const key = `${judul} ${isi}`.toLowerCase();
          const Icon = Object.entries(iconMap).find(([token]) => key.includes(token))?.[1] || fallbackIcons[index % fallbackIcons.length];
          return (
            <div key={`${judul}-${index}`} className="card p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md">
              {image ? (
                <img src={image} alt={judul} className="h-32 w-full rounded-2xl object-cover" />
              ) : (
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${colors[index % colors.length]}`}><Icon size={24} /></span>
              )}
              <h3 className="mt-4 font-display text-lg font-bold text-primary-900">{judul}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{isi}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
