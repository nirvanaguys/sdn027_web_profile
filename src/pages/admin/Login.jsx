import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, Lock } from "lucide-react";
import { login } from "../../data/api";
import { useAuth } from "../../data/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { loading: authLoading, isAdmin } = useAuth();

  useEffect(() => {
    if (!authLoading && isAdmin) nav('/admin/dashboard', { replace: true });
  }, [authLoading, isAdmin, nav]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, pass);
      nav("/admin/dashboard");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
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
          <button type="button" onClick={() => nav('/')} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:underline"><ArrowLeft size={16} /> Kembali ke halaman utama</button>
          <h1 className="font-display text-2xl font-extrabold text-primary-900">Masuk Admin</h1>
          <p className="mt-1 text-sm text-ink/50">Kelola seluruh konten website sekolah dari sini.</p>

          {err && <p className="mt-4 rounded-xl bg-honey-100 px-4 py-2 text-sm font-bold text-honey-800">{err}</p>}

          <label className="mt-6 block text-sm font-bold text-ink/70">Email admin</label>
          <input
            required type="email" autoComplete="email"
            className="mt-1 w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            placeholder="admin@sekolah.sch.id" value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <label className="mt-4 block text-sm font-bold text-ink/70">Password</label>
          <input
            required type="password" autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-primary-200 bg-white px-4 py-2.5 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            placeholder="••••••" value={pass} onChange={(e) => setPass(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn btn-primary mt-6 w-full disabled:cursor-wait disabled:opacity-70"><Lock size={16} /> {loading ? "Memproses…" : "Masuk"}</button>
          <p className="mt-4 text-center text-xs text-ink/50">Gunakan akun yang diberikan oleh pengelola website.</p>
        </form>
      </div>
    </div>
  );
}
