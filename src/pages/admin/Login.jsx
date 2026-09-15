import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Lock } from "lucide-react";
import { initData } from "../../data/store";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    initData();
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (user === admin.username && pass === admin.password) {
      localStorage.setItem("isLoggedIn", "true");
      nav("/admin/dashboard");
    } else {
      setErr("Username atau password salah.");
    }
  };

  return (
    <div className="container-page flex min-h-[80vh] items-center py-14">
      <div className="card grid w-full max-w-4xl overflow-hidden md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-primary-600 p-10 text-white md:flex">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-honey-500 text-primary-900"><GraduationCap size={22} /></span>
            <span className="font-display text-lg font-extrabold">SDN 027</span>
          </div>
          <p className="font-display text-2xl font-bold leading-snug text-primary-50">
            "Mendidik dengan hati, membimbing dengan teladan."
          </p>
          <p className="text-sm text-primary-200">Panel pengelolaan konten website sekolah.</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 md:p-10">
          <h1 className="font-display text-2xl font-extrabold text-primary-900">Masuk Admin</h1>
          <p className="mt-1 text-sm text-ink/50">Kelola berita dan galeri sekolah dari sini.</p>

          {err && <p className="mt-4 rounded-xl bg-honey-100 px-4 py-2 text-sm font-bold text-honey-800">{err}</p>}

          <label className="mt-6 block text-sm font-bold text-ink/70">Username</label>
          <input
            className="mt-1 w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            placeholder="admin" value={user} onChange={(e) => setUser(e.target.value)}
          />
          <label className="mt-4 block text-sm font-bold text-ink/70">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            placeholder="••••••" value={pass} onChange={(e) => setPass(e.target.value)}
          />
          <button type="submit" className="btn btn-primary mt-6 w-full"><Lock size={16} /> Masuk</button>
          <p className="mt-4 rounded-xl bg-primary-50 px-4 py-2 text-center text-xs text-ink/50">
            Akun bawaan: <b>admin</b> / <b>sdn027</b>
          </p>
        </form>
      </div>
    </div>
  );
}