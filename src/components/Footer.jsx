import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Mail, Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer id="kontak" className="mt-20 bg-primary-900 text-primary-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-honey-500 text-primary-900">
              <GraduationCap size={22} />
            </span>
            <span className="font-display text-xl font-extrabold text-white">SDN 027 Balikpapan Utara</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-200">
            Website resmi SDN 027 Balikpapan Utara — media informasi sekolah bagi siswa, orang tua, guru, dan masyarakat sekitar.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-white">Navigasi</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[["/", "Beranda"], ["/profil", "Profil Sekolah"], ["/akademik", "Akademik"], ["/berita", "Berita & Pengumuman"], ["/galeri", "Galeri"]].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-honey-300">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-white">Kontak Sekolah</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {/* Ganti dengan data kontak asli sekolah sebelum demo */}
            <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-honey-400" /> Jl. ................, Balikpapan Utara, Kalimantan Timur</li>
            <li className="flex gap-3"><Mail size={18} className="mt-0.5 shrink-0 text-honey-400" /> sdn027balikpapanutra@sch.id</li>
            <li className="flex gap-3"><Phone size={18} className="mt-0.5 shrink-0 text-honey-400" /> (0542) .......</li>
            <li className="flex gap-3"><Clock size={18} className="mt-0.5 shrink-0 text-honey-400" /> Senin–Sabtu: 07.00–13.00 WITA</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-primary-300">
        © 2026 SDN 027 Balikpapan Utara · Proyek Inovasi Sosial
      </div>
    </footer>
  );
}