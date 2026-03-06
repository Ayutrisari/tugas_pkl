import { useEffect, useState } from "react";
import axios from "axios";
import { LayoutDashboard, Flower2, User, ChevronLeft, ChevronRight, Edit3, Trash2, List } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 4; 

  useEffect(() => { fetchPosts(); }, [page]);

  const fetchPosts = async () => {
    try {
      // Pastikan endpoint API kamu support query param 'page'
      const res = await axios.get("http://localhost:3000/api/posts", { params: { page, limit } });
      setPosts(res.data.data);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) { setPosts([]); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Hapus bunga ini kimbek?")) {
      try {
        await axios.delete(`http://localhost:3000/api/posts/${id}`);
        fetchPosts();
      } catch (err) { alert("Gagal hapus!"); }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-10">
        <div className="p-6">
          <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2 text-pink-500"><Flower2 /> FLOWER APP</h2>
        </div>
        <nav className="flex-1 px-4 mt-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 p-3 bg-pink-600 rounded-xl font-bold shadow-lg shadow-pink-500/20"><User size={20} /> User Mode</Link>
          <Link to="/admin" className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl font-bold transition-all"><LayoutDashboard size={20} /> Admin Mode</Link>
          <Link to="/category" className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl font-bold transition-all"><List size={20} /> Kelola Kategori</Link>
        </nav>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 ml-64 p-10 bg-pink-100 min-h-screen">
        <header className="mb-10 text-center">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800">Daftar Bunga Koleksi</h1>
        </header>

        {/* GRID BUNGA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <div key={post.id} className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-white">
              <div className="relative h-56">
                <img src={post.url_gambar} className="w-full h-full object-cover" alt={post.judul} />
                <div className="absolute top-4 right-4 text-[10px] font-black bg-pink-600 text-white px-3 py-1 rounded-full uppercase">{post.nama_kategori}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black uppercase italic text-slate-800 line-clamp-1">{post.judul}</h3>
                <p className="text-slate-500 text-xs italic mt-1 line-clamp-2 mb-4">{post.isi}</p>
                <div className="flex gap-2 border-t pt-4">
                  <button onClick={() => navigate(`/edit/${post.id}`)} className="flex-1 flex items-center justify-center gap-2 bg-amber-400 text-slate-900 py-2 rounded-lg font-black text-[10px] uppercase hover:bg-amber-500 transition-all"><Edit3 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(post.id)} className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg font-black text-[10px] uppercase hover:bg-red-600 transition-all"><Trash2 size={14} /> Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- TOMBOL PAGINATION (YANG TADI ILANG) --- */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-3 bg-white rounded-full shadow-md text-pink-600 hover:bg-pink-600 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-pink-600"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-black transition-all shadow-sm ${page === i + 1 ? 'bg-pink-600 text-white' : 'bg-white text-slate-400 hover:bg-pink-100'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-3 bg-white rounded-full shadow-md text-pink-600 hover:bg-pink-600 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-pink-600"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}