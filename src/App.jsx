import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profil from './pages/Profil';
import Akademik from './pages/Akademik';
import Berita from './pages/Berita';
import Galeri from './pages/Galeri';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import { initData } from './data/store';
import { useEffect } from 'react';

function App() {
  useEffect(() => { initData(); }, []);
  
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/akademik" element={<Akademik />} />
            <Route path="/berita" element={<Berita />} />
            <Route path="/galeri" element={<Galeri />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;