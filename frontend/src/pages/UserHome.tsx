//@ts-nocheck
import { useEffect, useState } from "react";
import axios from "axios";
import { Flower2, ChevronLeft, ChevronRight, Search, LogIn, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const limit = 6;

  useEffect(() => { 
    const delayDebounceFn = setTimeout(() => {
      fetchPosts(); 
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/posts", { 
        params: { page, limit, search: searchTerm } 
      });
      setPosts(res.data.data);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) { 
      setPosts([]); 
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100 via-white to-amber-50 font-sans">
      <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-pink-100 px-10 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-2xl font-black italic text-pink-600">
          <Flower2 size={32} /> FLOWER APP
        </div>
        <button onClick={() => navigate("/Login")} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full font-bold hover:bg-pink-600 transition-all shadow-lg uppercase text-xs">
          <LogIn size={16} /> Admin Login
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-10">
        <header className="mb-10 text-center">
          <marquee scrollamount="15"><h1 className="text-6xl font-black italic uppercase text-slate-800 mb-4">Koleksi Bunga Kiting 😉</h1></marquee>
          <div className="relative max-w-xl mx-auto group">
            <Search className="absolute inset-y-0 left-6 my-auto text-slate-400 group-focus-within:text-pink-500" size={20} />
            <input 
              type="text"
              placeholder="Cari nama bunga atau kategori..."
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-full shadow-2xl outline-none focus:border-pink-500 font-bold text-slate-700 transition-all"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
            <p className="font-black text-slate-400 uppercase italic">Sabar kimbek, lagi nyari bunga... 🌸</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                /* TAMBAHAN: onClick untuk navigasi ke halaman detail */
                <div 
                  key={post.id} 
                  onClick={() => navigate(`/detail/${post.id}`)}
                  className="group bg-white rounded-[3rem] shadow-xl overflow-hidden border border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img src={post.url_gambar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.judul} />
                    
                    <div className="absolute top-6 right-6 text-[10px] font-black bg-pink-500/90 backdrop-blur-md text-white px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">
                      {post.nama_kategori}
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-3xl font-black uppercase italic text-slate-800 mb-3">{post.judul}</h3>
                    <p className="text-slate-500 font-medium italic leading-relaxed line-clamp-3">{post.isi}</p>
                    
                    {/* TAMBAHAN VISUAL: Tombol kecil penanda detail */}
                    <div className="mt-6 flex justify-end">
                      <span className="text-xs font-black text-pink-500 uppercase tracking-tighter group-hover:tracking-widest transition-all">Lihat Detail →</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-pink-200">
                 <p className="text-2xl font-black text-slate-400 uppercase italic">Aduh kimbek, bunga "{searchTerm}" gak ketemu! 🔍</p>
              </div>
            )}
          </div>
        )}

        {/* PAGINATION TETAP SAMA */}
      </div>
    </div>
  );
}