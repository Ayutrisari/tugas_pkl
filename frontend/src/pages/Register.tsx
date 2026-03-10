import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgAdmin from '../assets/bg.jpg'; 

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Role langsung dikirim sebagai 'user' tanpa pilihan di form
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        username,
        email: email.trim().toLowerCase(),
        password,
        role: 'user' 
      });

      if (response.data.status === "success" || response.status === 201) {
        alert("Berhasil Daftar! Akun kamu sudah aktif sebagai User 🌸");
        navigate("/login");
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Gagal Register kimbek!";
      alert(msg);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen relative" style={{ backgroundImage: `url(${bgAdmin})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
      
      <div className="bg-white/90 p-10 rounded-[2.5rem] shadow-2xl w-[400px] relative z-10 border-4 border-pink-300">
        <h2 className="text-3xl font-black mb-8 text-center uppercase italic text-pink-600">
          Buat Akun 🌸
        </h2>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 rounded-2xl border bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-pink-400"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 rounded-2xl border bg-slate-50 font-bold outline-none focus:ring-2 focus:ring-pink-400"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />

          <button type="submit" className="w-full py-4 rounded-2xl font-black shadow-lg bg-pink-500 hover:bg-pink-600 text-white mt-2 active:scale-95 transition-all">
            DAFTAR SEKARANG 🚀
          </button>
        </form>
        
        <p className="mt-6 text-center font-bold text-slate-500 text-sm italic">
          Sudah punya akun? <span className="text-pink-500 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login di sini</span>
        </p>
      </div>
    </div>
  );
}