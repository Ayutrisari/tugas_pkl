import { Routes, Route, Navigate } from 'react-router-dom';

// Import halaman-halaman kamu
import UserHome from './pages/UserHome'; 
import Home from './pages/Home';         
import Admin from './pages/Admin';       
import Login from './pages/Login';       
import EditPost from './pages/EditPost'; 
import Category from './pages/Category'; 
import DetailPage from './pages/DetailPage'; 
// 1. PASTIKAN IMPORT REGISTER INI ADA!
import Register from './pages/Register'; 

export default function App() {
  return (
    <Routes>
      {/* RUTE PUBLIK */}
      <Route path="/login" element={<Login />} />
      {/* 2. DAFTARKAN RUTE REGISTER DI SINI AGAR BISA DI-NAVIGATE */}
      <Route path="/register" element={<Register />} />
      
      {/* HALAMAN USER */}
      <Route path="/" element={<UserHome />} />
      <Route path="/detail/:id" element={<DetailPage />} />
      
      {/* HALAMAN ADMIN */}
      <Route path="/admin" element={<Home />} />
      <Route path="/tambah" element={<Admin />} />
      <Route path="/edit/:id" element={<EditPost />} />
      <Route path="/category" element={<Category />} />

      {/* Jika URL tidak dikenal, lempar ke User Home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}