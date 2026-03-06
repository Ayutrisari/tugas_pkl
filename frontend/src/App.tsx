import { Routes, Route, Navigate } from 'react-router-dom';

// Pastikan path folder dan nama file sudah sesuai kimbek!
import UserHome from './pages/UserHome'; 
import Home from './pages/Home';         
import Admin from './pages/Admin';       
import Login from './pages/Login';       
import EditPost from './pages/EditPost'; 
import Category from './pages/Category'; 
// 1. Tambahkan import untuk halaman detail yang akan kita buat
import DetailPage from './pages/DetailPage'; 

export default function App() {
  return (
    <Routes>
      {/* HALAMAN USER (Katalog Bunga/Makanan) */}
      <Route path="/" element={<UserHome />} />
      
      {/* HALAMAN DETAIL (Baru: Menangkap ID dari gambar yang diklik) */}
      <Route path="/detail/:id" element={<DetailPage />} />
      
      {/* HALAMAN ADMIN */}
      <Route path="/admin" element={<Home />} />
      
      {/* RUTE LAINNYA */}
      <Route path="/login" element={<Login />} />
      <Route path="/tambah" element={<Admin />} />
      <Route path="/edit/:id" element={<EditPost />} />
      <Route path="/category" element={<Category />} />

      {/* Jika URL tidak dikenal, lempar ke User Home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}