import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNews, saveNews, getGallery, saveGallery } from '../../data/store';

export default function Dashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState('news');
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [newNews, setNewNews] = useState({ judul: '', isi: '', kategori: '', tanggal: '' });

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) nav('/admin');
    setNews(getNews());
    setGallery(getGallery());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    nav('/admin');
  };

  const addNews = () => {
    if(!newNews.judul || !newNews.isi) return alert('Judul dan Isi harus diisi!');
    const updated = [...news, { ...newNews, id: Date.now() }];
    saveNews(updated);
    setNews(updated);
    setNewNews({ judul: '', isi: '', kategori: '', tanggal: '' });
    alert('Berita berhasil ditambahkan!');
  };

  const deleteNews = (id) => {
    if(confirm('Hapus berita ini?')) {
      const updated = news.filter(n => n.id !== id);
      saveNews(updated);
      setNews(updated);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-primary">Dashboard Admin</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Logout</button>
      </div>

      <div className="flex space-x-4 mb-6 border-b">
        <button onClick={() => setTab('news')} className={`px-4 py-2 font-bold ${tab === 'news' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>Kelola Berita</button>
        <button onClick={() => setTab('gallery')} className={`px-4 py-2 font-bold ${tab === 'gallery' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>Lihat Galeri</button>
      </div>

      {tab === 'news' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="font-bold mb-3 text-lg">Tambah Berita Baru</h3>
            <input className="border p-2 w-full mb-3 rounded" placeholder="Judul Berita" value={newNews.judul} onChange={e => setNewNews({...newNews, judul: e.target.value})} />
            <textarea className="border p-2 w-full mb-3 rounded h-24" placeholder="Isi Berita" value={newNews.isi} onChange={e => setNewNews({...newNews, isi: e.target.value})}></textarea>
            <div className="flex space-x-2 mb-4">
              <input className="border p-2 w-1/2 rounded" placeholder="Kategori (Prestasi/Kegiatan)" value={newNews.kategori} onChange={e => setNewNews({...newNews, kategori: e.target.value})} />
              <input className="border p-2 w-1/2 rounded" placeholder="Tanggal (cth: 12 Apr 2026)" value={newNews.tanggal} onChange={e => setNewNews({...newNews, tanggal: e.target.value})} />
            </div>
            <button onClick={addNews} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">Simpan Berita</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="font-bold mb-3 text-lg">Daftar Berita Saat Ini</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {news.map(n => (
                <div key={n.id} className="flex justify-between border-b pb-2 items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{n.judul}</p>
                    <p className="text-xs text-gray-500">{n.tanggal} - {n.kategori}</p>
                  </div>
                  <button onClick={() => deleteNews(n.id)} className="text-red-500 text-sm hover:underline">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {tab === 'gallery' && (
         <div className="bg-white p-6 rounded-lg shadow border">
            <p className="text-gray-600 mb-4">Preview Galeri Sekolah. (Upload gambar dapat ditambahkan menggunakan Firebase Storage pada tahap selanjutnya).</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map(g => <img key={g.id} src={g.url} className="h-40 w-full object-cover rounded shadow" alt={g.judul} />)}
            </div>
         </div>
      )}
    </div>
  );
}