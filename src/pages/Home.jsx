import { Link } from "react-router-dom";
import { BookOpen, HeartHandshake, Trophy, Users, Target, CheckCircle2, ArrowRight, Star } from "lucide-react";
import SectionHead from "../components/SectionHead";
import NewsCard from "../components/NewsCard";
import { getNews } from "../data/store";

const unggulan = [
  { icon: BookOpen, warna: "bg-primary-50 text-primary-600", judul: "Pendidikan Berkualitas", isi: "Kurikulum nasional dengan pendekatan pembelajaran yang menyenangkan dan bermakna." },
  { icon: HeartHandshake, warna: "bg-honey-50 text-honey-600", judul: "Karakter Mulia", isi: "Membentuk siswa yang beriman, jujur, disiplin, dan peduli sesama." },
  { icon: Trophy, warna: "bg-leaf-50 text-leaf-600", judul: "Berprestasi", isi: "Mendorong potensi siswa di bidang akademik, seni, dan olahraga." },
  { icon: Users, warna: "bg-primary-50 text-primary-600", judul: "Guru Profesional", isi: "Dibimbing oleh tenaga pendidik yang berkompeten dan penuh dedikasi." },
];

const misi = [
  "Menyelenggarakan pembelajaran aktif dan menyenangkan.",
  "Membentuk karakter siswa yang berakhlak mulia.",
  "Mengembangkan potensi akademik dan non-akademik.",
  "Menciptakan lingkungan sekolah yang ramah dan inklusif.",
];

export default function Home() {
  const berita = getNews().slice(0, 3);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-honey-100" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary-100" aria-hidden="true" />

        <div className="container-page relative grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="eyebrow"><Star size={14} className="text-honey-500" /> Website Resmi Sekolah</span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-primary-900 md:text-5xl">
              SD Negeri 027 <span className="highlight">Balikpapan Utara</span>
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-ink/70">
              Mendidik generasi cerdas, berkarakter, dan berakhlak mulia melalui pembelajaran yang menyenangkan, bermakna, dan menginspirasi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/profil" className="btn btn-primary">Profil Sekolah</Link>
              <a href="#kontak" className="btn btn-ghost">Hubungi Kami</a>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80"
              alt="Suasana belajar di kelas"
              className="h-72 w-full rounded-4xl border-4 border-white object-cover shadow-xl md:h-96"
            />
            <div className="card absolute -bottom-5 -left-4 -rotate-3 px-5 py-3">
              <p className="font-display text-xl font-extrabold text-honey-600">Akreditasi A</p>
              <p className="text-xs font-bold text-ink/50">Sekolah Unggulan</p>
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="container-page relative mt-14">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-primary-100 shadow-sm md:grid-cols-4">
            {[["30+", "Tahun Berdiri"], ["450+", "Siswa Aktif"], ["25+", "Guru & Staf"], ["A", "Akreditasi"]].map(([angka, label]) => (
              <div key={label} className="bg-white p-6 text-center">
                <p className="font-display text-3xl font-extrabold text-primary-600">{angka}</p>
                <p className="mt-1 text-sm font-semibold text-ink/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MENGAPA KAMI ===== */}
      <section className="bg-white py-20">
        <div className="container-page">
          <SectionHead
            eyebrow="Mengapa Memilih Kami"
            title="Pendidikan dasar yang utuh untuk masa depan cemerlang"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {unggulan.map((u) => (
              <div key={u.judul} className="card p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${u.warna}`}>
                  <u.icon size={24} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-primary-900">{u.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{u.isi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISI & MISI ===== */}
      <section className="py-20">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <div className="card p-8">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-50 text-primary-600"><Target size={24} /></span>
            <h3 className="mt-4 font-display text-2xl font-extrabold text-primary-900">Visi Kami</h3>
            <p className="mt-3 leading-relaxed text-ink/70">
              Terwujudnya peserta didik yang beriman, bertakwa, cerdas, terampil, berbudi pekerti luhur, dan peduli terhadap lingkungan.
            </p>
          </div>
          <div className="card p-8">
            <h3 className="font-display text-2xl font-extrabold text-primary-900">Misi Kami</h3>
            <ul className="mt-4 space-y-3">
              {misi.map((m) => (
                <li key={m} className="flex gap-3 text-ink/70">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-leaf-500" /> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== BERITA PREVIEW ===== */}
      <section className="bg-white py-20">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Kabar Terbaru</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-primary-900 md:text-4xl">Berita & Pengumuman</h2>
            </div>
            <Link to="/berita" className="inline-flex items-center gap-1 font-bold text-primary-600 hover:text-primary-700 hover:underline">
              Lihat semua <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {berita.map((n) => <NewsCard key={n.id} item={n} />)}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-20 pt-4">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-4xl bg-primary-600 px-8 py-12 text-white md:p-14">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" aria-hidden="true" />
            <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-honey-500/20" aria-hidden="true" />
            <div className="relative flex flex-wrap items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="font-display text-3xl font-extrabold md:text-4xl">Bergabunglah Bersama Kami</h2>
                <p className="mt-3 leading-relaxed text-primary-100">
                  Bagi orang tua yang ingin memberikan pendidikan terbaik untuk putra-putrinya, hubungi kami untuk informasi pendaftaran.
                </p>
              </div>
              <a href="#kontak" className="btn btn-honey">Hubungi Sekolah</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}