import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { adminEmail, getFirebaseServices, isAdmin } from './firebase';

const mapDocuments = (snapshot) => snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
const readCollection = async (name, compare) => {
  const { db } = getFirebaseServices();
  const data = mapDocuments(await getDocs(collection(db, name)));
  return data.sort(compare);
};

export const login = async (email, password) => {
  const { auth } = getFirebaseServices();
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    if (!isAdmin(credential.user)) {
      await signOut(auth);
      throw new Error(`Akun ini bukan admin yang diizinkan (${adminEmail() || 'VITE_ADMIN_EMAIL'}).`);
    }
  } catch (error) {
    if (error.message.startsWith('Akun ini')) throw error;
    throw new Error('Email atau password salah, atau metode Email/Password belum diaktifkan di Firebase.');
  }
};

export const logout = async () => signOut(getFirebaseServices().auth);
export const getSession = () => {
  const { auth } = getFirebaseServices();
  if (!isAdmin(auth.currentUser)) {
    const error = new Error('Sesi admin tidak ditemukan.');
    error.status = 401;
    throw error;
  }
  return auth.currentUser;
};

export const getNews = () => readCollection('news', (a, b) => b.tanggal.localeCompare(a.tanggal));
export const createNews = async ({ judul, isi, kategori, tanggal }) => {
  const { db } = getFirebaseServices();
  const item = { judul: judul.trim(), isi: isi.trim(), kategori: kategori.trim(), tanggal, createdAt: serverTimestamp() };
  const reference = await addDoc(collection(db, 'news'), item);
  return { id: reference.id, ...item };
};
export const deleteNews = (id) => deleteDoc(doc(getFirebaseServices().db, 'news', id));
export const updateNews = (id, { judul, isi, kategori, tanggal }) => updateDoc(doc(getFirebaseServices().db, 'news', id), { judul: judul.trim(), isi: isi.trim(), kategori: kategori.trim(), tanggal });

export const getGallery = () => readCollection('gallery', (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
export const createGallery = async ({ judul, url }) => {
  const { db } = getFirebaseServices();
  const item = { judul: judul.trim(), url: url.trim(), createdAt: serverTimestamp() };
  const reference = await addDoc(collection(db, 'gallery'), item);
  return { id: reference.id, ...item };
};
export const deleteGallery = (id) => deleteDoc(doc(getFirebaseServices().db, 'gallery', id));
export const updateGallery = (id, { judul, url }) => updateDoc(doc(getFirebaseServices().db, 'gallery', id), { judul: judul.trim(), url: url.trim() });

export const getContent = async (name) => {
  const snapshot = await getDoc(doc(getFirebaseServices().db, 'content', name));
  return snapshot.exists() ? snapshot.data() : null;
};
export const saveContent = (name, data) => setDoc(doc(getFirebaseServices().db, 'content', name), data, { merge: true });
