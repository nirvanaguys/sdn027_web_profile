import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GalleryPhotoField from './GalleryPhotoField';
import { friendlyAdminError } from '../../data/adminError';
import { saveGalleryPhoto, saveHomePhoto } from '../../data/galleryUpload';
import { uploadGalleryPhoto, removeGalleryUpload } from '../../data/galleryStorage';
import { createGallery, createNews, deleteGallery, deleteNews, getContent, getGallery, getNews, getSession, logout, saveContent, updateGallery, updateNews } from '../../data/api';
import { defaultAcademic, defaultHome, defaultProfile, mergeContent, normalizeAcademic, normalizeHome, normalizeProfile } from '../../data/content';

const blankNews = { judul: '', isi: '', kategori: '', tanggal: '' }, blankGallery = { judul: '', url: '' };
const parseLines = (v) => v.split('\n').map((x) => x.trim()).filter(Boolean);
const pairs = (v) => parseLines(v).map((x) => x.split('|').map((y) => y.trim())).filter((x) => x.length > 1 && x[0] && x[1]).map((x) => [x[0], x.slice(1).join(' | ')]);
const serial = (x) => x.join('\n'), serialPairs = (x) => x.map((v) => v.join(' | ')).join('\n');
const homeForm = (x) => ({ ...x, stats: serialPairs(x.stats), mission: serial(x.mission) });
const profileForm = (x) => ({ ...x, details: serialPairs(x.details) });
const academicForm = (x) => ({ ...x, approaches: serial(x.approaches), schedule: serialPairs(x.schedule), extracurriculars: serialPairs(x.extracurriculars) });

function Field({ label, value, set, area, hint, type = 'text' }) { const Tag = area ? 'textarea' : 'input'; return <label className="mt-4 block text-sm font-bold text-ink/70">{label}<Tag required type={area ? undefined : type} value={value || ''} onChange={(e) => set(e.target.value)} className={`mt-1 w-full rounded-xl border border-primary-200 px-4 py-2.5 font-normal ${area ? 'h-28' : ''}`} />{hint && <small className="mt-1 block font-normal text-ink/45">{hint}</small>}</label>; }

export default function Dashboard() {
  const nav = useNavigate(); const [tab, setTab] = useState('news'); const [loading, setLoading] = useState(true), [saving, setSaving] = useState(false);
  const [news, setNews] = useState([]), [gallery, setGallery] = useState([]), [nform, setNform] = useState(blankNews), [gform, setGform] = useState(blankGallery), [editN, setEditN] = useState(null), [editG, setEditG] = useState(null);
  const [home, setHome] = useState(homeForm(defaultHome)), [homeFile, setHomeFile] = useState(null), [profile, setProfile] = useState(profileForm(defaultProfile)), [academic, setAcademic] = useState(academicForm(defaultAcademic));
  const fail = (e) => {
    window.alert(friendlyAdminError(e));
    if (e.status === 401) { logout(); nav('/admin', { replace: true }); }
  };
  useEffect(() => { Promise.all([getSession(), getNews(), getGallery(), getContent('home'), getContent('profile'), getContent('academic')]).then(([, n, g, h, p, a]) => { setNews(n); setGallery(g); if (h) setHome(homeForm(mergeContent(defaultHome, normalizeHome(h)))); if (p) setProfile(profileForm(mergeContent(defaultProfile, normalizeProfile(p)))); if (a) setAcademic(academicForm(mergeContent(defaultAcademic, normalizeAcademic(a)))); }).catch(fail).finally(() => setLoading(false)); }, [nav]);
  const change = (set, obj, key) => (v) => set({ ...obj, [key]: v });
  const submitNews = async (e) => { e.preventDefault(); setSaving(true); try { if (editN) { await updateNews(editN, nform); setNews(news.map((x) => x.id === editN ? { ...x, ...nform } : x)); } else setNews([await createNews(nform), ...news]); setNform(blankNews); setEditN(null); } catch (x) { fail(x); } finally { setSaving(false); } };
  const [galleryFile, setGalleryFile] = useState(null), [galleryInputKey, setGalleryInputKey] = useState(0);
  const resetGalleryFile = () => { setGalleryFile(null); setGalleryInputKey((key) => key + 1); };
  const submitGallery = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const item = await saveGalleryPhoto({ ...gform, file: galleryFile }, {
        upload: uploadGalleryPhoto,
        remove: removeGalleryUpload,
        save: async (data) => {
          if (editG) { await updateGallery(editG, data); return { id: editG, ...data }; }
          return createGallery(data);
        },
      });
      setGallery((items) => editG ? items.map((x) => x.id === editG ? { ...x, ...item } : x) : [item, ...items]);
      setGform(blankGallery); setEditG(null); resetGalleryFile();
    } catch (x) { fail(x); } finally { setSaving(false); }
  };
  const save = async (name, data) => { setSaving(true); try { await saveContent(name, data); } catch (e) { fail(e); } finally { setSaving(false); } };
  const submitContent = (name, obj, parse) => (e) => { e.preventDefault(); save(name, parse(obj)); };
  const submitHome = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const data = { ...home, stats: pairs(home.stats).map(([value, label]) => ({ value, label })), mission: parseLines(home.mission) };
      const result = await saveHomePhoto(data, homeFile, { upload: uploadGalleryPhoto, save: async (item) => { await saveContent('home', item); return item; } });
      setHome(homeForm(mergeContent(defaultHome, result))); setHomeFile(null);
    } catch (x) { fail(x); } finally { setSaving(false); }
  };
  const submitButton = (text) => <button disabled={saving} className="btn btn-primary mt-6 w-full disabled:opacity-70">{saving ? 'Menyimpan…' : text}</button>;
  const tabs = [['news', 'Berita'], ['gallery', 'Galeri'], ['home', 'Beranda'], ['profile', 'Profil'], ['academic', 'Akademik']];
  return <div className="container-page max-w-6xl py-8 md:py-12"><div className="mb-8 flex items-center justify-between border-b border-primary-100 pb-4"><div><p className="eyebrow">Area terbatas</p><h1 className="mt-3 font-display text-3xl font-extrabold text-primary-900">Dashboard Admin</h1></div><button onClick={() => { logout(); nav('/admin'); }} className="btn btn-ghost !px-4 !py-2 text-sm">Keluar</button></div><div className="mb-6 flex flex-wrap gap-2 border-b border-primary-100">{tabs.map(([id, label]) => <button key={id} disabled={saving} onClick={() => setTab(id)} className={`px-4 py-3 font-bold ${tab === id ? 'border-b-2 border-primary-500 text-primary-700' : 'text-ink/50'}`}>{label}</button>)}</div>{loading ? <p>Memuat data…</p> : tab === 'news' ? <div className="grid gap-8 md:grid-cols-2"><form onSubmit={submitNews} className="card p-6"><h2 className="font-display text-xl font-bold">{editN ? 'Edit Berita' : 'Tambah Berita'}</h2><Field label="Judul" value={nform.judul} set={change(setNform, nform, 'judul')} /><Field label="Isi" area value={nform.isi} set={change(setNform, nform, 'isi')} /><Field label="Kategori" value={nform.kategori} set={change(setNform, nform, 'kategori')} /><Field label="Tanggal" type="date" value={nform.tanggal} set={change(setNform, nform, 'tanggal')} />{submitButton(editN ? 'Simpan Perubahan' : 'Simpan Berita')}{editN && <button type="button" onClick={() => { setEditN(null); setNform(blankNews); }} className="mt-3 w-full text-sm font-bold">Batal</button>}</form><List title="Daftar Berita" items={news} edit={(x) => { setEditN(x.id); setNform(x); }} remove={async (x) => { if (window.confirm('Hapus berita ini?')) { try { await deleteNews(x.id); setNews(news.filter((v) => v.id !== x.id)); } catch (e) { fail(e); } } }} /></div> : tab === 'gallery' ? <div className="grid gap-8 md:grid-cols-2"><form onSubmit={submitGallery} className="card p-6"><h2 className="font-display text-xl font-bold">{editG ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}</h2><Field label="Judul foto" value={gform.judul} set={change(setGform, gform, 'judul')} /><GalleryPhotoField key={galleryInputKey} file={galleryFile} url={gform.url} onChange={setGalleryFile} disabled={saving} />{submitButton(editG ? 'Simpan Perubahan' : 'Simpan Foto')}{editG && <button type="button" disabled={saving} onClick={() => { setEditG(null); setGform(blankGallery); resetGalleryFile(); }} className="mt-3 w-full text-sm font-bold">Batal</button>}</form><List title="Galeri Sekolah" items={gallery} edit={(x) => { if (saving) return; setEditG(x.id); setGform(x); resetGalleryFile(); }} remove={async (x) => { if (!saving && window.confirm('Hapus foto ini?')) { try { await deleteGallery(x.id); setGallery(gallery.filter((v) => v.id !== x.id)); } catch (e) { fail(e); } } }} /></div> : tab === 'home' ? <ContentForm title="Konten Beranda" submit={submitHome}>{[['Judul hero', 'heroTitle'], ['Deskripsi hero', 'heroText', true], ['Label akreditasi', 'accreditation'], ['Keterangan akreditasi', 'accreditationText'], ['Statistik', 'stats', true, 'Satu baris: angka | label'], ['Visi', 'vision', true], ['Misi', 'mission', true, 'Satu misi per baris']].map(([l, k, a, h]) => <Field key={k} label={l} area={a} hint={h} value={home[k]} set={change(setHome, home, k)} />)}<GalleryPhotoField file={homeFile} url={home.heroImage} onChange={setHomeFile} disabled={saving} />{submitButton('Simpan Konten Beranda')}</ContentForm> : tab === 'profile' ? <ContentForm title="Konten Profil Sekolah" submit={submitContent('profile', profile, (x) => ({ ...x, details: pairs(x.details).map(([label, value]) => ({ label, value })) }))}>{[['Judul', 'title'], ['Subjudul', 'sub'], ['Sejarah paragraf 1', 'history1', true], ['Sejarah paragraf 2', 'history2', true], ['Sambutan kepala sekolah', 'principalQuote', true], ['Nama/jabatan kepala sekolah', 'principalName'], ['Informasi sekolah', 'details', true, 'Satu baris: label | isi']].map(([l, k, a, h]) => <Field key={k} label={l} area={a} hint={h} value={profile[k]} set={change(setProfile, profile, k)} />)}{submitButton('Simpan Konten Profil')}</ContentForm> : <ContentForm title="Konten Akademik" submit={submitContent('academic', academic, (x) => ({ ...x, approaches: parseLines(x.approaches), schedule: pairs(x.schedule).map(([day, value]) => ({ day, value })), extracurriculars: pairs(x.extracurriculars).map(([title, description]) => ({ title, description })) }))}><Field label="Deskripsi kurikulum" area value={academic.description} set={change(setAcademic, academic, 'description')} /><Field label="Poin pendekatan belajar" area hint="Satu poin per baris" value={academic.approaches} set={change(setAcademic, academic, 'approaches')} /><Field label="Jadwal belajar" area hint="Satu baris: hari | jam/keterangan" value={academic.schedule} set={change(setAcademic, academic, 'schedule')} /><Field label="Ekstrakurikuler" area hint="Satu baris: nama | deskripsi" value={academic.extracurriculars} set={change(setAcademic, academic, 'extracurriculars')} />{submitButton('Simpan Konten Akademik')}</ContentForm>}</div>;
}
function ContentForm({ title, submit, children }) { return <form onSubmit={submit} className="card mx-auto max-w-3xl p-6 md:p-8"><h2 className="font-display text-xl font-bold text-primary-900">{title}</h2>{children}</form>; }
function List({ title, items, edit, remove }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > Math.max(1, totalPages)) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  return (
    <section className="card p-6">
      <h2 className="font-display text-xl font-bold text-primary-900">
        {title}
      </h2>

      <div className="mt-4 space-y-3">
        {currentItems.length > 0 ? (
          currentItems.map((x) => (
            <div
              key={x.id}
              className="flex items-center justify-between gap-3 border-b border-primary-100 pb-3"
            >
              <div className="min-w-0">
                <p className="break-words font-bold text-primary-900">
                  {x.judul}
                </p>

                {x.tanggal && (
                  <p className="text-xs text-ink/50">
                    {x.tanggal} · {x.kategori}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-3 text-sm font-bold">
                <button
                  type="button"
                  onClick={() => edit(x)}
                  className="text-primary-600"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => remove(x)}
                  className="text-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-ink/50">
            Belum ada data.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label={`Navigasi halaman ${title}`}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
            disabled={currentPage === 1}
            className="rounded-full border border-primary-100 px-3 py-2 text-sm font-bold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sebelumnya
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                aria-label={`Halaman ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                className={`h-9 min-w-9 rounded-full px-3 text-sm font-bold transition ${
                  currentPage === page
                    ? "bg-primary-600 text-white"
                    : "border border-primary-100 text-primary-700 hover:bg-primary-50"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              )
            }
            disabled={currentPage === totalPages}
            className="rounded-full border border-primary-100 px-3 py-2 text-sm font-bold text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Berikutnya
          </button>
        </nav>
      )}

      {items.length > 0 && (
        <p className="mt-3 text-center text-xs text-ink/50">
          Menampilkan {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, items.length)} dari {items.length} item
        </p>
      )}
    </section>
  );
}