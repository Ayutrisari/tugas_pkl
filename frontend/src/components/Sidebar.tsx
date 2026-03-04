import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Sidebar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Ambil data dari port 3000
    axios.get('http://localhost:3000/api/categories')
      .then(res => {
        if(res.data.status) setCategories(res.data.data);
      })
      .catch(err => console.error("Gagal muat kategori:", err));
  }, []);

  return (
    <aside className="w-64 bg-[#0f172a] h-screen sticky top-0 p-6 border-r border-gray-800 text-white shadow-xl">
      <div className="mb-10 flex items-center gap-2">
        <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center font-bold italic">F</div>
        <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">Flower.co</h1>
      </div>

      <nav className="space-y-8">
        <div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Utama</p>
          <ul className="space-y-2">
            <li><a href="/" className="block py-2 text-sm text-gray-300 hover:text-pink-500 transition">Dashboard</a></li>
            <li><a href="/admin" className="block py-2 text-sm text-gray-300 hover:text-pink-500 transition">Admin Panel</a></li>
          </ul>
        </div>

        <div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Categories</p>
          <div className="flex flex-col gap-3">
            {categories.length > 0 ? categories.map((cat: any) => (
              <button key={cat.id} className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all text-left">
                <span className="h-1 w-1 rounded-full bg-pink-600 group-hover:w-3 transition-all"></span>
                <span className="text-xs font-semibold uppercase">{cat.nama_kategori}</span>
              </button>
            )) : (
              <p className="text-gray-600 text-[10px] italic">Memuat...</p>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}