import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Flower2, Upload, Send, ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function EditPost() {
  const { id } = useParams(); // Ambil ID bunga dari URL
  const navigate = useNavigate();
  
  // State untuk form
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Ambil data lama berdasarkan ID saat halaman dibuka
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/posts/${id}`);
        const data = res.data;
        setJudul(data.judul);
        setIsi(data.isi);
        setCategoryId(data.category_id);
        setPreview(data.url_gambar); // Munculkan gambar lama sebagai preview awal
      } catch (err) {
        console.error(err);
        alert("Bunga tidak ditemukan kimbek!");
      }
    };
    fetchDetail();
  }, [id]);

  // 2. Handle ganti gambar baru
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Ganti preview ke gambar baru
    }
  };

  // 3. Kirim update ke backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi", isi);
    formData.append("category_id", categoryId);
    
    // Kirim url_gambar hanya jika user pilih file baru
    if (file) {
      formData.append("url_gambar", file); 
    }

    try {
      // Endpoint PUT /api/posts/{id} sesuai Swagger kamu
      await axios.put(`http://localhost:3000/api/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Bunga Berhasil Diupdate! ✨");
      navigate("/"); // Balik ke Home
    } catch (err) {
      console.error(err);
      alert("Gagal update, cek backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-200 via-slate-100 to-amber-100 p-6 flex items-center justify-center font-sans">
      
      {/* Tombol Back */}
      <button onClick={() => navigate("/")} className="fixed top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-amber-600 font-bold transition-all group z-20">
        <div className="bg-white p-2 rounded-full shadow-md group-hover:scale-110 transition-all">
          <ArrowLeft size={20} />
        </div>
        Batal Edit
      </button>

      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">
        
        {/* SISI KIRI: Preview */}
        <div className="md:w-1/2 bg-slate-900 flex flex-col items-center justify-center p-10 text-white relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h2 className="text-3xl font-black italic mb-6 flex items-center gap-3 text-amber-500 z-10">
            <Flower2 size={40} /> EDIT PREVIEW
          </h2>
          <div className="w-full aspect-square rounded-[2rem] border-4 border-dashed border-slate-700 flex items-center justify-center overflow-hidden bg-slate-800 z-10 shadow-inner">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover transition-all" />
            ) : (
              <ImageIcon size={64} className="opacity-20" />
            )}
          </div>
        </div>

        {/* SISI KANAN: Form */}
        <div className="md:w-1/2 p-10 md:p-14">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic mb-8">Edit Koleksi</h1>
          
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nama Bunga</label>
              <input 
                type="text" 
                value={judul}
                className="w-full px-6 py-4 bg-white rounded-2xl shadow-sm outline-none font-bold text-slate-700 focus:ring-4 focus:ring-amber-400/20"
                onChange={(e) => setJudul(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Kategori</label>
              <select 
                value={categoryId}
                className="w-full px-6 py-4 bg-white rounded-2xl shadow-sm outline-none font-bold text-slate-700 appearance-none"
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="1">Indoor</option>
                <option value="2">Outdoor</option>
                <option value="3">Tanaman Hias</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Deskripsi</label>
              <textarea 
                value={isi}
                rows={3}
                className="w-full px-6 py-4 bg-white rounded-2xl shadow-sm outline-none font-medium text-slate-600 resize-none"
                onChange={(e) => setIsi(e.target.value)}
                required
              ></textarea>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Update Foto (Opsional)</label>
              <label className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-slate-800 text-white rounded-2xl cursor-pointer hover:bg-amber-600 transition-all font-bold">
                <Upload size={20} />
                <span className="truncate">{file ? file.name : "Ganti Gambar Baru"}</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 rounded-2xl font-black uppercase italic bg-amber-500 hover:bg-amber-600 text-white shadow-xl transition-all active:scale-95"
            >
              {loading ? "Menyimpan..." : <div className="flex items-center justify-center gap-2"><Send size={20} /> Simpan Perubahan</div>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}