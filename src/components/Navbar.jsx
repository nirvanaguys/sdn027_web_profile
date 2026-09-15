import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, Lock } from "lucide-react";
import { logout } from "../data/api";
import { useAuth } from "../data/useAuth";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/profil", label: "Profil" },
  { to: "/akademik", label: "Akademik" },
  { to: "/berita", label: "Berita" },
  { to: "/galeri", label: "Galeri" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { isAdmin } = useAuth();
  const handleLogout = async () => { await logout(); setOpen(false); nav('/'); };
  return (
    <header className="sticky top-0 z-50 border-b border-primary-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-500 text-white">
            <GraduationCap size={22} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-extrabold text-primary-800">SDN 027</span>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-ink/50">Balikpapan Utara</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to} to={l.to} end={l.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive ? "bg-primary-50 text-primary-700" : "text-ink/60 hover:bg-primary-50/60 hover:text-primary-700"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin ? <Link to="/admin/dashboard" className="btn btn-honey ml-3 !px-4 !py-2 text-sm">Dashboard</Link> : <Link to="/admin" className="btn btn-honey ml-3 !px-4 !py-2 text-sm"><Lock size={15} /> Admin</Link>}
        </nav>

        <button className="rounded-xl border border-primary-100 bg-white p-2 text-primary-700 md:hidden" onClick={() => setOpen(!open)} aria-label="Buka menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="space-y-1 border-t border-primary-100 bg-white px-4 pb-4 pt-2 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-2.5 font-bold ${isActive ? "bg-primary-50 text-primary-700" : "text-ink/60"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin ? <><Link to="/admin/dashboard" onClick={() => setOpen(false)} className="block rounded-xl bg-honey-500 px-4 py-2.5 font-bold text-primary-900">Dashboard</Link><button onClick={handleLogout} className="block w-full rounded-xl px-4 py-2.5 text-left font-bold text-primary-700">Keluar</button></> : <Link to="/admin" onClick={() => setOpen(false)} className="block rounded-xl bg-honey-500 px-4 py-2.5 font-bold text-primary-900">Admin</Link>}
        </nav>
      )}
    </header>
  );
}
