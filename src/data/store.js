export const initData = () => {
  if (!localStorage.getItem('news')) {
    localStorage.setItem('news', JSON.stringify([
      { id: 1, judul: 'Upacara Hardiknas 2026', isi: 'Seluruh siswa dan guru mengikuti upacara peringatan Hardiknas dengan khidmat.', tanggal: '12 Apr 2026', kategori: 'Kegiatan' },
      { id: 2, judul: 'Juara 1 Olimpiade Matematika', isi: 'Siswa kelas 6 berhasil meraih juara pertama dalam olimpiade tingkat Kota Balikpapan.', tanggal: '5 Apr 2026', kategori: 'Prestasi' }
    ]));
  }
  if (!localStorage.getItem('gallery')) {
    localStorage.setItem('gallery', JSON.stringify([
      { id: 1, url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', judul: 'Kegiatan Belajar Mengajar' },
      { id: 2, url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', judul: 'Fasilitas Sekolah' }
    ]));
  }
  if (!localStorage.getItem('admin')) {
    localStorage.setItem('admin', JSON.stringify({ username: 'admin', password: 'sdn027' }));
  }
};

export const getNews = () => JSON.parse(localStorage.getItem('news') || '[]');
export const saveNews = (news) => localStorage.setItem('news', JSON.stringify(news));
export const getGallery = () => JSON.parse(localStorage.getItem('gallery') || '[]');
export const saveGallery = (gallery) => localStorage.setItem('gallery', JSON.stringify(gallery));