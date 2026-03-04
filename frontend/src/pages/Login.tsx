//@ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Logika dummy login (nanti bisa lo sambungin ke database)
    if (email === 'admin@gmail.com' && password === 'admin123') {
      navigate('/admin');
    } else {
      alert('Email atau Password salah! Coba admin@gmail.com / admin123');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-pink-50">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[400px] border-t-8 border-pink-500">
        <h2 className="text-3xl font-black mb-2 text-gray-800 uppercase italic">Admin Login 🌸</h2>
        <p className="text-gray-400 text-sm mb-8 font-medium italic">Silakan masuk untuk kelola galeri bunga.</p>
        
        <form onSubmit={handleLogin}>
          {/* Input Email */}
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Admin</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-gray-100 rounded-2xl border-2 border-transparent focus:border-pink-300 focus:bg-white outline-none transition-all"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Input Password */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-gray-100 rounded-2xl border-2 border-transparent focus:border-pink-300 focus:bg-white outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-pink-500 text-white p-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 active:scale-95"
          >
            Masuk Sekarang 🚀
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">PKL Project - Security Access</p>
        </div>
      </div>
    </div>
  );
}