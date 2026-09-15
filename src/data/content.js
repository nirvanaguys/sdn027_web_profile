export const defaultHome = {
  heroTitle: 'SD Negeri 027 Balikpapan Utara',
  heroText: 'Mendidik generasi cerdas, berkarakter, dan berakhlak mulia melalui pembelajaran yang menyenangkan, bermakna, dan menginspirasi.',
  heroImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
  accreditation: 'Akreditasi A',
  accreditationText: 'Sekolah Unggulan',
  stats: [['30+', 'Tahun Berdiri'], ['450+', 'Siswa Aktif'], ['25+', 'Guru & Staf'], ['A', 'Akreditasi']],
  vision: 'Terwujudnya peserta didik yang beriman, bertakwa, cerdas, terampil, berbudi pekerti luhur, dan peduli terhadap lingkungan.',
  mission: ['Menyelenggarakan pembelajaran aktif dan menyenangkan.', 'Membentuk karakter siswa yang berakhlak mulia.', 'Mengembangkan potensi akademik dan non-akademik.', 'Menciptakan lingkungan sekolah yang ramah dan inklusif.'],
};

export const defaultProfile = {
  title: 'Mengenal SDN 027 Balikpapan Utara', sub: 'Lebih dari tiga dekade mendampingi anak-anak Balikpapan Utara tumbuh cerdas dan berkarakter.',
  history1: 'SDN 027 Balikpapan Utara berdiri pada awal 1990-an dan sejak itu menjadi rumah belajar bagi ratusan anak di sekitar kecamatan Balikpapan Utara. Dari ruang-ruang kelas yang sederhana, sekolah ini tumbuh menjadi sekolah dasar negeri berakreditasi A yang dikenal hangat dan ramah anak.',
  history2: 'Hari ini, dengan dukungan 25+ guru dan staf serta kepercayaan 450+ keluarga siswa, kami terus berbenah: memperkaya kegiatan belajar, memperkuat pendidikan karakter, dan membuka diri terhadap masyarakat melalui website ini.',
  principalQuote: 'Setiap anak yang masuk gerbang sekolah kami adalah amanah. Tugas kami bukan hanya mengajar, tetapi menemani mereka tumbuh menjadi pribadi yang baik.', principalName: 'Kepala Sekolah SDN 027',
  details: [['Status', 'Sekolah Negeri · Akreditasi A'], ['Kurikulum', 'Kurikulum Merdeka'], ['Jam Belajar', 'Senin–Sabtu, 07.00–13.00 WITA'], ['Lokasi', 'Balikpapan Utara, Kalimantan Timur']],
};

export const defaultAcademic = {
  description: 'SDN 027 Balikpapan Utara menerapkan kurikulum nasional yang disesuaikan dengan kebutuhan peserta didik. Pembelajaran dirancang aktif: anak diajak mengamati, mencoba, dan berdiskusi — bukan sekadar mencatat.',
  approaches: ['Pembelajaran berbasis kegiatan dan proyek sederhana', 'Penguatan literasi & numerasi setiap pagi', 'Penilaian yang memperhatikan proses, bukan hanya nilai akhir'],
  schedule: [['Senin – Kamis', '07.00 – 13.00 WITA'], ['Jumat', '07.00 – 11.30 WITA'], ['Sabtu', 'Kegiatan ekstrakurikuler']],
  extracurriculars: [['Pramuka', 'Membentuk karakter, kemandirian, dan jiwa kepemimpinan.'], ['Olahraga', 'Sepak bola, bulu tangkis, dan senam pagi setiap pekan.'], ['Seni & Tari', 'Tari tradisional, musik, dan prakarya untuk melatih kreativitas.'], ['Klub Sains', 'Persiapan olimpiade sains dan matematika tingkat kota.']],
};

export const mergeContent = (defaults, data) => ({ ...defaults, ...data });

const toPairs = (items, first, second) => (items || []).map((item) => Array.isArray(item) ? item : [item[first] || '', item[second] || '']);
export const normalizeHome = (data) => ({ ...data, stats: toPairs(data.stats, 'value', 'label') });
export const normalizeProfile = (data) => ({ ...data, details: toPairs(data.details, 'label', 'value') });
export const normalizeAcademic = (data) => ({ ...data, schedule: toPairs(data.schedule, 'day', 'value'), extracurriculars: toPairs(data.extracurriculars, 'title', 'description') });
