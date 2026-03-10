//@ts-nocheck
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2, Loader2, Flower2, LayoutDashboard, PlusCircle, User, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExportButtons from "../components/ExportButtons";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // STATE UNTUK PAGINATION (LIMIT DATA)
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4; // Limit 6 bunga per halaman

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/posts");
      setPosts(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (window.confirm("Yakin mau hapus bunga ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/posts/${id}`);
        fetchPosts();
      } catch (err) {
        console.log(err);
      }
    }
  };

  // LOGIKA PAGINATION
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen bg-pink-100 font-sans">
      {/* SIDEBAR - Tetap aman di kiri */}
      <aside className="w-64 bg-[#0f172a] text-white fixed h-full p-6 shadow-2xl z-50">
        <div className="flex items-center gap-2 mb-10">
          <div className="p-2 bg-pink-500 rounded-lg">
            <Flower2 size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-black text-pink-500 italic uppercase tracking-tighter">
            FLOWER APP
          </h2>
        </div>
        
        <nav className="flex flex-col gap-2 font-bold text-slate-400">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 hover:text-white hover:bg-slate-800 p-3 rounded-xl transition-all w-full text-left">
            <User size={20}/> <span className="text-sm">User Mode</span>
          </button>
          <div className="flex items-center gap-3 text-white bg-pink-600 p-3 rounded-xl shadow-lg shadow-pink-900/20">
            <LayoutDashboard size={20}/> <span className="text-sm">Admin Mode</span>
          </div>
          <button onClick={() => navigate("/tambah")} className="flex items-center gap-3 hover:text-white hover:bg-slate-800 p-3 rounded-xl transition-all w-full text-left border border-slate-700 border-dashed mt-2">
            <Plus size={20}/> <span className="text-sm">Tambah Bunga</span>
          </button>
          <button onClick={() => navigate("/category")} className="flex items-center gap-3 hover:text-white hover:bg-slate-800 p-3 rounded-xl transition-all w-full text-left">
            <PlusCircle size={20}/> <span className="text-sm">Kelola Kategori</span>
          </button>
        </nav>
      </aside>

      {/* ISI KONTEN UTAMA */}
      <main className="flex-1 ml-64 p-10 flex flex-col">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black italic text-pink-900 uppercase tracking-tighter">
              DAFTAR BUNGA KOLEKSI
            </h1>
            <p className="text-pink-600 font-bold italic text-xs uppercase tracking-widest">Management Data Admin</p>
          </div>
          <ExportButtons posts={posts} />
        </header>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 italic font-black text-pink-400 uppercase">
             <Loader2 className="animate-spin mb-2" size={40} /> Memuat...
          </div>
        ) : (
          <>
            {/* GRID BUNGA DENGAN DATA YANG SUDAH DI-LIMIT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 flex-1">
              {currentPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-pink-100 flex flex-col hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <img src={post.url_gambar} className="w-full h-full object-cover" alt={post.judul} />
                    <div className="absolute top-4 right-4 text-[10px] font-black bg-pink-600 text-white px-4 py-1.5 rounded-full uppercase shadow-md">
                      {post.nama_kategori}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black uppercase italic text-pink-900 mb-2 leading-tight">{post.judul}</h3>
                    <p className="text-slate-500 text-[11px] font-medium italic line-clamp-2 mb-6 border-b border-pink-50 pb-4">
                      {post.isi}
                    </p>
                    
                    {/* TOMBOL AKSI SEJAJAR */}
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => navigate(`/detail/${post.id}`)} className="flex-1 flex items-center justify-center gap-1 py-3 bg-pink-600 text-white rounded-2xl font-black uppercase text-[9px] shadow-md hover:bg-pink-700 transition-all">
                        <Eye size={12} /> DETAIL
                      </button>
                      <button onClick={() => navigate(`/edit/${post.id}`)} className="flex-1 flex items-center justify-center gap-1 py-3 bg-amber-400 text-slate-900 rounded-2xl font-black uppercase text-[9px] shadow-md hover:bg-amber-500 transition-all">
                        <Pencil size={12} /> EDIT
                      </button>
                      <button onClick={() => deletePost(post.id)} className="flex-1 flex items-center justify-center gap-1 py-3 bg-rose-500 text-white rounded-2xl font-black uppercase text-[9px] shadow-md hover:bg-rose-600 transition-all">
                        <Trash2 size={12} /> HAPUS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* KONTROL PAGINATION (PREVIOUS / NEXT) */}
            <div className="flex justify-center items-center gap-4 mt-12 mb-6">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-3 rounded-full shadow-md transition-all ${currentPage === 1 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white text-pink-600 hover:bg-pink-600 hover:text-white'}`}
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`w-10 h-10 rounded-xl font-black transition-all ${currentPage === index + 1 ? 'bg-pink-600 text-white' : 'bg-white text-pink-900 hover:bg-pink-50'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-3 rounded-full shadow-md transition-all ${currentPage === totalPages ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white text-pink-600 hover:bg-pink-600 hover:text-white'}`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}