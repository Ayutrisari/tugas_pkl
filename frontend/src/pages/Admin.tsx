//@ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // IMPORT INI DITAMBAHKAN
import axios from "axios";
import { Flower2, Upload, Send, ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function AdminAddPost() {
  const navigate = useNavigate(); // INISIALISASI NAVIGATE

  // 1. State untuk Form Data
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  // 2. State untuk File & Preview
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 3. Fungsi Handle Gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 4. Fungsi Kirim Data ke Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih foto bunganya dulu kimbek!");

    setLoading(true);
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi", isi);
    formData.append("category_id", categoryId);
    formData.append("url_gambar", file); 

    try {
      const res = await axios.post("http://localhost:3000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log("Berhasil:", res.data);
      alert("Bunga berhasil disimpan!");
      
      // PERBAIKAN: Balik ke Dashboard Admin, bukan User Home
      navigate("/admin"); 
    } catch (err: any) {
      console.error("Gagal simpan:", err.response?.data || err.message);
      alert("Gagal simpan! Cek terminal backend kamu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-300 via-slate-100 to-pink-200 p-6 flex items-center justify-center font-sans">
      
      {/* PERBAIKAN: Tombol Back sekarang pakai navigate ke /admin */}
      <button 
        onClick={() => navigate("/admin")} 
        className="fixed top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-pink-600 font-bold transition-all group z-20 bg-transparent border-none cursor-pointer"
      >
        <div className="bg-white p-2 rounded-full shadow-md group-hover:scale-110 transition-all">
          <ArrowLeft size={20} />
        </div>
        Kembali ke Dashboard
      </button>

      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-10 duration-700">
        
        {/* SISI KIRI: Preview Gambar */}
        <div className="md:w-1/2 bg-slate-900 flex flex-col items-center justify-center p-10 text-white relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <h2 className="text-3xl font-black italic mb-6 flex items-center gap-3 text-pink-500 z-10">
            <Flower2 size={40} /> PREVIEW
          </h2>

          <div className="w-full aspect-square rounded-[2rem] border-4 border-dashed border-slate-700 flex items-center justify-center overflow-hidden bg-slate-800 z-10 shadow-inner relative">
            {preview ? (
              <img 
                src={preview} 
                alt="preview" 
                className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" 
              />
            ) : (
              <div className="text-center text-slate-500">
                <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium italic text-sm">Foto bunga akan muncul di sini</p>
              </div>
            )}
          </div>
          <p className="mt-6 text-slate-400 text-xs font-bold uppercase tracking-widest z-10">Koleksi Flower App</p>
        </div>

        {/* SISI KANAN: Form Input */}
        <div className="md:w-1/2 p-10 md:p-14">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Tambah Bunga</h1>
            <div className="h-1.5 w-12 bg-pink-500 rounded-full mt-2"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Bunga</label>
              <input 
                type="text" 
                placeholder="Contoh: Mawar Hitam"
                className="w-full px-6 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-4 focus:ring-pink-400/20 transition-all outline-none font-bold text-slate-700"
                onChange={(e) => setJudul(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori</label>
              <select 
                className="w-full px-6 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-4 focus:ring-pink-400/20 transition-all outline-none font-bold text-slate-700 appearance-none"
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="1">Indoor (Dalam Ruangan)</option>
                <option value="2">Outdoor (Luar Ruangan)</option>
                <option value="3">Tanaman Hias</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Deskripsi</label>
              <textarea 
                placeholder="Deskripsi singkat bunga..."
                rows={3}
                className="w-full px-6 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-4 focus:ring-pink-400/20 transition-all outline-none font-medium text-slate-600 resize-none"
                onChange={(e) => setIsi(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Upload Foto</label>
              <label className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-slate-800 text-white rounded-2xl cursor-pointer hover:bg-pink-600 transition-all font-bold shadow-lg active:scale-95 group">
                <Upload size={20} className="group-hover:animate-bounce" />
                <span className="truncate">{file ? file.name : "Pilih File Gambar"}</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-wider flex items-center justify-center gap-3 shadow-xl transition-all ${
                loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 text-white hover:-translate-y-1 active:scale-95'
              }`}
            >
              {loading ? "Sedang Mengirim..." : <><Send size={20} /> Simpan Produk</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}