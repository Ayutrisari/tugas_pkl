import { useEffect, useState } from "react";
import axios from "axios";
import { LayoutDashboard, Flower2, User, Layers } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/posts");
      // Mengambil data array langsung dari backend
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* --- SIDEBAR NAVIGASI --- */}
      <div className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2 text-pink-500">
            <Flower2 /> FLOWER APP
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Pindah Halaman</p>
          
          <a href="/" className="flex items-center gap-3 p-3 bg-pink-600 rounded-xl font-bold transition-all shadow-lg shadow-pink-900/20">
            <User size={20} /> Tampilan User
          </a>

          <a href="/admin" className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-bold">
            <LayoutDashboard size={20} /> Mode Admin
          </a>
        </nav>

        <div className="p-6 border-t border-slate-800 text-[10px] text-slate-500 font-medium italic">
          &copy; 2026 Flower App Collection
        </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="flex-1 ml-64 p-10 bg-pink-200">
        <header className="mb-12 bg-pink-100">
          <marquee scrollamount="20"><h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800">
            Daftar Bunga 🌸                                KITING
          </h1></marquee>
          <div className="h-1.5 w-20 bg-pink-500 rounded-full mt-2"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length === 0 ? (
            <div className="text-center col-span-full py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 italic font-medium">Belum ada postingan bunga</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 transition-all hover:scale-[1.02] group">
                <div className="relative h-64 bg-slate-200 overflow-hidden">
                  <img 
                    src={post.url_gambar} 
                    alt={post.judul} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image' }} 
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-pink-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                      {post.nama_kategori || "BUNGA"}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-800 mb-1 group-hover:text-pink-600">
                    {post.judul}
                  </h3>
                  <div className="h-1 w-10 bg-yellow-400 rounded-full mb-4"></div>
                  <p className="text-slate-500 text-sm font-medium italic">
                    {post.isi}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}