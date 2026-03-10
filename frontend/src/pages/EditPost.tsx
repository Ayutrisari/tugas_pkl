//@ts-nocheck
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Flower2, Upload, Send, ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<{ id: number; nama_kategori: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          axios.get("http://localhost:3000/api/categories"),
          axios.get(`http://localhost:3000/api/posts/${id}`)
        ]);

        // Sesuaikan dengan struktur response backend { status: "success", data: ... }
        const postData = postRes.data.data ? postRes.data.data : postRes.data;

        setCategories(catRes.data.data || catRes.data);
        setJudul(postData.judul);
        setIsi(postData.isi);
        setCategoryId(postData.category_id);
        setPreview(postData.url_gambar);
      } catch (err) {
        console.error("Gagal load data:", err);
        alert("Terjadi kesalahan saat mengambil data database.");
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi", isi);
    formData.append("category_id", categoryId);
    
    // Jika ada file baru, kirim filenya. Jika tidak, backend akan tetap pakai URL lama.
    if (file) {
      formData.append("url_gambar", file); 
    } else {
      formData.append("url_gambar", preview || ""); 
    }

    try {
      await axios.put(`http://localhost:3000/api/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Bunga Berhasil Diupdate! ✨");
      navigate("/admin"); // Balik ke halaman dashboard admin
    } catch (err) {
      console.error(err);
      alert("Gagal update!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center font-sans">
      
      {/* TOMBOL KEMBALI (DITAMBAHKAN AGAR TIDAK NYASAR) */}
      <button 
        onClick={() => navigate("/admin")} 
        className="fixed top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-amber-600 font-bold transition-all group z-20 bg-transparent border-none cursor-pointer"
      >
        <div className="bg-white p-2 rounded-full shadow-md group-hover:scale-110 transition-all text-amber-500">
          <ArrowLeft size={20} />
        </div>
        Batal & Kembali
      </button>

      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 animate-in fade-in zoom-in duration-500">
        
        {/* SISI KIRI: PREVIEW */}
        <div className="md:w-1/2 bg-slate-900 p-10 text-white flex flex-col items-center justify-center border-r border-slate-800 relative">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h2 className="text-2xl font-black mb-6 text-amber-500 italic z-10 uppercase tracking-widest">Preview</h2>
          <div className="w-full aspect-square rounded-3xl border-4 border-dashed border-slate-700 flex items-center justify-center overflow-hidden bg-slate-800 shadow-inner z-10">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover animate-in fade-in duration-300" />
            ) : (
              <ImageIcon size={64} className="opacity-20" />
            )}
          </div>
        </div>

        {/* SISI KANAN: FORM */}
        <div className="md:w-1/2 p-10 md:p-14">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">Edit Koleksi</h1>
            <div className="h-1.5 w-12 bg-amber-500 rounded-full mt-2"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Bunga</label>
              <input 
                type="text" 
                value={judul}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-slate-700"
                onChange={(e) => setJudul(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kategori</label>
              <select 
                value={categoryId}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-slate-700 appearance-none"
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deskripsi</label>
              <textarea 
                value={isi}
                rows={3}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium text-slate-600 resize-none"
                onChange={(e) => setIsi(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="pt-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ganti Foto (Opsional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                    <Upload size={24} className="mb-2" />
                    <p className="text-xs font-bold uppercase tracking-tight">Klik untuk upload foto baru</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => {
                      if(e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                        setPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black uppercase italic tracking-wider bg-amber-500 hover:bg-amber-600 text-white shadow-xl transition-all active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-2"
            >
              {loading ? "Menyimpan..." : <><Send size={18}/> Simpan Perubahan</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}