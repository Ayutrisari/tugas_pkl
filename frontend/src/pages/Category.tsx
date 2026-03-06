//@ts-nocheck
import { useState, useEffect } from "react";
import axios from "axios";
// Pastikan IMPORT dari "lucide-react", bukan "lucide-center"
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
      // Mengirim field "nama_kategori" sesuai database
      await axios.post(
        "http://localhost:3000/api/categories", 
        { nama_kategori: newCategory }, 
        getAuthHeader()
      );
      setNewCategory("");
      fetchCategories();
      alert("Kategori ditambahkan! 🌿");
    } catch (err) {
      alert("Gagal tambah! Cek izin/middleware backend.");
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
    if (window.confirm("Hapus kategori ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/categories/${id}`, getAuthHeader());
        fetchCategories();
        alert("Terhapus! 🗑️");
      } catch (err) {
        alert("Gagal hapus! Mungkin masih digunakan oleh data produk.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-pink-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white fixed h-full p-6 shadow-xl">
        <h2 className="text-2xl font-black text-pink-500 mb-10 italic flex items-center gap-2"><Flower2/> FLOWER APP</h2>
        <nav className="space-y-4 font-bold text-slate-400">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3 hover:text-white transition-all w-full text-left">
            <LayoutDashboard size={20}/> Dashboard
          </button>
          <div className="flex items-center gap-3 text-white bg-pink-600 p-3 rounded-xl shadow-lg">
            <PlusCircle size={20}/> Kelola Kategori
          </div>
        </nav>
      </div>

      <div className="flex-1 ml-64 p-10">
        <h1 className="text-4xl font-black mb-10 uppercase italic text-slate-800">Kelola Kategori Bunga 🌿</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleAddCategory} className="bg-white p-8 rounded-[2rem] shadow-xl border border-white h-fit">
            <h3 className="text-xl font-black mb-6 uppercase italic">Tambah Baru</h3>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-100 rounded-2xl mb-4 font-bold outline-none focus:ring-4 focus:ring-pink-500/10 text-slate-700" 
              placeholder="Nama Kategori..." 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)} 
            />
            <button className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black shadow-lg transition-all shadow-pink-200">SIMPAN</button>
          </form>

          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl overflow-hidden border border-white">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-6 font-black uppercase italic text-sm">ID</th>
                  <th className="p-6 font-black uppercase italic text-sm">Nama Kategori</th>
                  <th className="p-6 font-black uppercase italic text-sm text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-pink-50/50 transition-colors">
                    <td className="p-6 font-bold text-slate-400"># {cat.id}</td>
                    <td className="p-6">
                      {editingId === cat.id ? (
                        <input 
                          className="w-full p-2 border-b-2 border-pink-500 outline-none font-bold bg-transparent text-slate-700"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span className="font-black text-slate-700 uppercase">{cat.nama_kategori}</span>
                      )}
                    </td>
                    <td className="p-6 flex justify-center gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button onClick={() => handleUpdate(cat.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"><Check size={20}/></button>
                          <button onClick={() => setEditingId(null)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-500 hover:text-white transition-all"><X size={20}/></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(cat.id); setEditValue(cat.nama_kategori); }} className="p-3 bg-blue-100 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                            <Edit3 size={18}/>
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="p-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
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