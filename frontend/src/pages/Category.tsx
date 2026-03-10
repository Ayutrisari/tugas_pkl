//@ts-nocheck
import { useState, useEffect } from "react";
import axios from "axios";
import { Flower2, Trash2, PlusCircle, LayoutDashboard, Edit3, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const navigate = useNavigate();

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/categories", getAuthHeader());
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal ambil kategori!", err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory) return;
    try {
      await axios.post(
        "http://localhost:3000/api/categories", 
        { nama_kategori: newCategory }, 
        getAuthHeader()
      );
      setNewCategory("");
      fetchCategories();
      alert("Kategori ditambahkan! 🌿");
    } catch (err) {
      alert("Gagal tambah!");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/categories/${id}`, 
        { nama_kategori: editValue }, 
        getAuthHeader()
      );
      setEditingId(null);
      fetchCategories();
      alert("Berhasil diubah! ✨");
    } catch (err) {
      alert("Gagal update!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus kategori ini, kimbek?")) {
      try {
        await axios.delete(`http://localhost:3000/api/categories/${id}`, getAuthHeader());
        fetchCategories();
        alert("Terhapus! 🗑️");
      } catch (err) {
        // Ini adalah pesan error yang muncul karena relasi database
        alert("Gagal hapus! Mungkin masih digunakan oleh data produk.");
      }
    }
  };

  return (
    /* WARNA: Background utama diganti bg-pink-100 */
    <div className="flex min-h-screen bg-pink-100 font-sans">
      {/* Sidebar tetap Slate tapi aksen kita perkuat pink-nya */}
      <div className="w-64 bg-slate-900 text-white fixed h-full p-6 shadow-xl">
        <h2 className="text-2xl font-black text-pink-500 mb-10 italic flex items-center gap-2">
          <Flower2/> FLOWER APP
        </h2>
        <nav className="space-y-4 font-bold text-slate-400">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 hover:text-pink-400 transition-all w-full text-left">
            <LayoutDashboard size={20}/> Dashboard
          </button>
          <div className="flex items-center gap-3 text-white bg-pink-600 p-3 rounded-xl shadow-lg shadow-pink-900/20">
            <PlusCircle size={20}/> Kelola Kategori
          </div>
        </nav>
      </div>

      <div className="flex-1 ml-64 p-10">
        <h1 className="text-4xl font-black mb-10 uppercase italic text-pink-900 tracking-tighter">
          Kelola Kategori Bunga 🌿
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Tambah - Sekarang dengan nuansa pink */}
          <form onSubmit={handleAddCategory} className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-pink-200 h-fit">
            <h3 className="text-xl font-black mb-6 uppercase italic text-pink-800">Tambah Baru</h3>
            <input 
              type="text" 
              className="w-full p-4 bg-pink-50 rounded-2xl mb-4 font-bold outline-none focus:ring-4 focus:ring-pink-500/20 text-slate-700 border border-pink-100" 
              placeholder="Nama Kategori..." 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)} 
            />
            <button className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl font-black shadow-lg transition-all shadow-pink-200 uppercase italic">
              SIMPAN KATEGORI
            </button>
          </form>

          {/* Tabel Kategori */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl overflow-hidden border-2 border-pink-200">
            <table className="w-full text-left">
              <thead className="bg-pink-600 text-white">
                <tr>
                  <th className="p-6 font-black uppercase italic text-sm"># ID</th>
                  <th className="p-6 font-black uppercase italic text-sm">Nama Kategori</th>
                  <th className="p-6 font-black uppercase italic text-sm text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-pink-50 transition-colors">
                    <td className="p-6 font-bold text-pink-300"># {cat.id}</td>
                    <td className="p-6">
                      {editingId === cat.id ? (
                        <input 
                          className="w-full p-2 border-b-2 border-pink-500 outline-none font-bold bg-transparent text-pink-900"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span className="font-black text-slate-700 uppercase italic">{cat.nama_kategori}</span>
                      )}
                    </td>
                    <td className="p-6 flex justify-center gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button onClick={() => handleUpdate(cat.id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md"><Check size={20}/></button>
                          <button onClick={() => setEditingId(null)} className="p-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-all shadow-md"><X size={20}/></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(cat.id); setEditValue(cat.nama_kategori); }} className="p-3 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-600 hover:text-white transition-all shadow-sm border border-pink-200">
                            <Edit3 size={18}/>
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="p-3 bg-rose-100 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-200">
                            <Trash2 size={18}/>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}