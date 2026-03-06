import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgAdmin from '../assets/bg.jpg'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const isAdminEmail = email.toLowerCase().includes('admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", { 
        email, 
        password 
      });

      const { accessToken, role } = res.data; 

      if (accessToken) {
        localStorage.setItem("token", accessToken); 
        localStorage.setItem("role", role); 

        alert(`Login Berhasil sebagai ${role}! 🌸`);

        // Sesuaikan dengan rute di App.tsx kimbek!
        if (role === 'admin') {
          navigate('/admin'); 
        } else {
          navigate('/'); // Balik ke UserHome (path "/")
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal Login!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen relative" style={{ backgroundImage: `url(${bgAdmin})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
      
      <div className={`bg-white/90 p-10 rounded-[2.5rem] shadow-2xl w-[400px] relative z-10 border-4 transition-all ${isAdminEmail ? 'border-blue-500' : 'border-white'}`}>
        
        <h2 className={`text-3xl font-black mb-8 text-center uppercase italic ${isAdminEmail ? 'text-blue-600' : 'text-slate-800'}`}>
          {isAdminEmail ? 'Admin Login' : 'Flower Login'}
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            name="email"
            type="email" 
            autoComplete="email"
            placeholder="Email" 
            className="w-full p-4 rounded-2xl border bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-pink-400"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <input 
            name="password"
            type="password" 
            autoComplete="current-password"
            placeholder="Password" 
            className="w-full p-4 rounded-2xl border bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-pink-400"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          
          <button type="submit" className={`w-full py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95 text-white ${isAdminEmail ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-500 hover:bg-pink-600'}`}>
            {isAdminEmail ? 'MASUK DASHBOARD 🛠️' : 'MASUK SEKARANG 🚀'}
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