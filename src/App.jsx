import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profil from './pages/Profil';
import Akademik from './pages/Akademik';
import Berita from './pages/Berita';
import Galeri from './pages/Galeri';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import { AuthProvider } from './data/AuthContext';
import { useAuth } from './data/useAuth';

function ProtectedRoute({ children }) {
  const { loading, isAdmin } = useAuth();
  if (loading) return <p className="container-page py-16 text-center text-ink/60">Memeriksa sesi admin…</p>;
  return isAdmin ? children : <Navigate to="/admin" replace />;
}

function AppContent() {
  const { pathname } = useLocation();
  const isAdminArea = pathname.startsWith('/admin');
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        {!isAdminArea && <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/akademik" element={<Akademik />} />
            <Route path="/berita" element={<Berita />} />
            <Route path="/galeri" element={<Galeri />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {!isAdminArea && <Footer />}
    </div>
  );
}

function App() {
  return <AuthProvider><BrowserRouter><AppContent /></BrowserRouter></AuthProvider>;
}

export default App;
