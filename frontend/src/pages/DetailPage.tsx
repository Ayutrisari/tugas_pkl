//@ts-nocheck
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Flower2 } from 'lucide-react';

export default function DetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/posts/${id}`);
        setItem(res.data.data || res.data);
      } catch (err) {
        console.error("Gagal ambil detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse text-pink-500 font-black italic">MEMUAT DETAIL... 🌸</div>
    </div>
  );

  if (!item) return <div className="text-center mt-20 font-black text-slate-400">Bunganya gak ada kimbek! 🔍</div>;

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      {/* Tombol Kembali */}
      <button 
        onClick={() => navigate(-1)} 
        className="group mb-12 flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-md border border-slate-100 text-slate-800 font-black hover:bg-pink-500 hover:text-white transition-all uppercase text-xs"
      >
        <ChevronLeft size={16} /> Kembali
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-50">
        {/* Gambar */}
        <div className="md:w-1/2 relative h-[400px] md:h-[500px]">
          <img 
            src={item.url_gambar} 
            alt={item.judul} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6 bg-pink-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            {item.nama_kategori || 'PROJEK'}
          </div>
        </div>

        {/* Info Tanpa Tombol Pesan */}
        <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-pink-500 font-black italic uppercase text-[10px] mb-4 tracking-widest">
            <Flower2 size={14} /> Flower App Detail
          </div>
          
          <h1 className="text-5xl font-black text-slate-800 uppercase italic leading-tight mb-4">
            {item.judul}
          </h1>
          
          <div className="w-12 h-1.5 bg-pink-500 rounded-full mb-8"></div>
          
          <p className="text-slate-500 text-lg leading-relaxed italic font-medium">
            {item.isi}
          </p>
        </div>
      </div>
    </div>
  );
}