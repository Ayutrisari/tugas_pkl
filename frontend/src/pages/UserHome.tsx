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
    /* BACKGROUND: Pakai Pink yang lebih tegas (pink-100 ke pink-200) */
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-rose-200 font-sans relative overflow-hidden">
      
      {/* MOTIF BUNGA DI BACKGROUND: Opacity dinaikkan sedikit biar kelihatan pola bunganya */}
      <div 
        className="fixed inset-0 opacity-[0.12] pointer-events-none -z-10"
        style={{ 
          backgroundImage: `url('https://www.transparenttextures.com/patterns/pollen.png'), url('https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=2080&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* BULATAN CAHAYA PINK TERANG */}
      <div className="fixed -top-24 -left-24 w-[500px] h-[500px] bg-pink-400/40 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="fixed -bottom-24 -right-24 w-[500px] h-[500px] bg-rose-400/30 rounded-full blur-[120px] -z-10"></div>

      {/* NAV: Pink Border lebih kelihatan */}
      <nav className="bg-white/60 backdrop-blur-xl sticky top-0 z-50 border-b-2 border-pink-300 px-10 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 text-3xl font-black italic text-pink-700 tracking-tighter">
          <Flower2 size={36} /> FLOWER APP
        </div>
        <button onClick={() => navigate("/Login")} className="flex items-center gap-2 px-8 py-2.5 bg-pink-600 text-white rounded-full font-black hover:bg-pink-700 transition-all shadow-lg hover:shadow-pink-300 uppercase text-xs tracking-widest">
          <LogIn size={18} /> Login 
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-10 relative z-10">
        <header className="mb-14 text-center">
          <marquee scrollamount="15" className="mb-6">
            <h1 className="text-7xl font-black italic uppercase text-pink-900 drop-shadow-md">🌷Koleksi Bunga Kiting🌷 </h1>
          </marquee>
          
          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute inset-y-0 left-6 my-auto text-pink-400 group-focus-within:text-pink-600 transition-colors" size={24} />
            <input 
              type="text"
              placeholder="Cari nama bunga atau kategori..."
              className="w-full pl-16 pr-8 py-6 bg-white/90 border-4 border-pink-200 rounded-[2rem] shadow-2xl outline-none focus:border-pink-500 font-bold text-slate-700 transition-all text-lg"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-pink-600 mb-4" size={64} />
            <p className="font-black text-pink-700 uppercase italic tracking-widest">Sabar kimbek, lagi bongkar bunga... 🌸</p>
          </div>
        ) : (
          /* GRID: Kartu bunga dengan border pink dan shadow pink kuat */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <div 
                  key={post.id} 
                  onClick={() => navigate(`/detail/${post.id}`)}
                  className="group bg-white/90 backdrop-blur-md rounded-[4rem] shadow-2xl shadow-pink-300/50 overflow-hidden border-2 border-pink-100 hover:border-pink-400 hover:-translate-y-4 transition-all duration-500 cursor-pointer flex flex-col h-[600px]"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img src={post.url_gambar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={post.judul} />
                    <div className="absolute top-8 right-8 text-[11px] font-black bg-pink-600 text-white px-6 py-2.5 rounded-full uppercase tracking-widest shadow-xl border border-white/30">
                      {post.nama_kategori}
                    </div>
                  </div>
                  
                  <div className="p-12 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-4xl font-black uppercase italic text-pink-900 mb-4 group-hover:text-pink-600 transition-colors leading-none tracking-tighter">
                        {post.judul}
                      </h3>
                      <p className="text-pink-800/70 font-bold italic leading-relaxed line-clamp-3 text-sm">
                        {post.isi}
                      </p>
                    </div>
                    
                    <div className="mt-8 flex justify-between items-center border-t-2 border-pink-50 pt-8">
                      <span className="text-[10px] font-black text-pink-300 uppercase tracking-widest">Kiting Collection</span>
                      <span className="text-sm font-black text-pink-600 uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                        DETAIL <ChevronRight size={18} />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-white/40 backdrop-blur-md rounded-[5rem] border-4 border-dashed border-pink-400">
                 <p className="text-4xl font-black text-pink-600 uppercase italic tracking-tighter">Bunganya abis kimbek! 🔍</p>
              </div>
            )}
          </div>
        )}

        {/* PAGINATION: Tombol Pink Cetar */}
        {totalPages > 1 && (
          <div className="mt-24 flex justify-center items-center gap-6">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-5 bg-pink-600 rounded-2xl shadow-xl text-white hover:bg-pink-700 transition-all disabled:opacity-20"
            >
              <ChevronLeft size={32} />
            </button>
            <div className="flex gap-4">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-14 h-14 rounded-2xl font-black text-lg transition-all shadow-xl ${
                    page === i + 1 
                    ? 'bg-pink-700 text-white scale-125 rotate-3' 
                    : 'bg-white text-pink-600 hover:bg-pink-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-5 bg-pink-600 rounded-2xl shadow-xl text-white hover:bg-pink-700 transition-all disabled:opacity-20"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}