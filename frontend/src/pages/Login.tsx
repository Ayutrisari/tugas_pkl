import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgAdmin from '../assets/bg.jpg'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Efek visual: berubah jadi biru kalau ada kata 'admin' di email
  const isAdminEmail = email.toLowerCase().includes('admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Kirim request ke Backend
      const res = await axios.post("http://localhost:3000/api/auth/login", { 
        email: email.trim(), 
        password: password 
      });

      /** * PERHATIKAN DI SINI:
       * Backend kamu mengirimkan { token, user: { role, ... } }
       * Jadi kita ambil 'token' dan 'user' dari res.data
       */
      const { token, user } = res.data; 

      if (token) {
        // 2. Simpan data ke LocalStorage
        localStorage.setItem("token", token); 
        localStorage.setItem("role", user?.role || 'user'); 

        alert(`Login Berhasil! Selamat datang, ${user?.username || 'User'} 🌸`);

        // 3. Navigasi berdasarkan Role
        if (user?.role === 'admin') {
          navigate('/admin'); 
        } else {
          navigate('/'); // Balik ke halaman User
        }
      } else {
        alert("Gagal: Token tidak diterima dari server.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      // Menampilkan pesan error dari backend jika ada (misal: "Password salah!")
      const errorMsg = err.response?.data?.message || "Gagal Login! Periksa koneksi atau data anda.";
      alert(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen relative" style={{ backgroundImage: `url(${bgAdmin})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Overlay transparan */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
      
      <div className={`bg-white/90 p-10 rounded-[2.5rem] shadow-2xl w-[400px] relative z-10 border-4 transition-all duration-500 ${isAdminEmail ? 'border-blue-500' : 'border-pink-300'}`}>
        
        <h2 className={`text-3xl font-black mb-8 text-center uppercase italic ${isAdminEmail ? 'text-blue-600' : 'text-pink-600'}`}>
          {isAdminEmail ? 'Admin Login 🛠️' : 'Flower Login 🌸'}
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 ml-2 uppercase">Email Address</label>
            <input 
              name="email"
              type="email" 
              autoComplete="email"
              placeholder="contoh@gmail.com" 
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-pink-400 transition-all"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 ml-2 uppercase">Password</label>
            <input 
              name="password"
              type="password" 
              autoComplete="current-password"
              placeholder="••••••" 
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-pink-400 transition-all"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={`w-full py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95 text-white mt-4 ${
              isAdminEmail 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                : 'bg-pink-500 hover:bg-pink-600 shadow-pink-200'
            }`}
          >
            {isAdminEmail ? 'MASUK DASHBOARD' : 'MASUK SEKARANG'}
          </button>
        </form>
        
        {!isAdminEmail && (
          <p className="mt-6 text-center font-bold text-slate-500 text-sm italic">
            Belum punya akun? <span className="text-pink-500 cursor-pointer hover:underline" onClick={() => navigate('/register')}>Daftar di sini</span>
          </p>
        )}
      </div>
    </div>
  );
}