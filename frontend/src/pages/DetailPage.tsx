//@ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, MessageCircle, Send, ArrowLeft, Loader2 } from "lucide-react";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ nama: "", komentar: "", rating: 5 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Ambil Detail Bunga
      const resPost = await axios.get(`http://localhost:3000/api/posts/${id}`);
      // res.data adalah objek response, res.data.data adalah isi bunganya
      setPost(resPost.data.data);

      // 2. Ambil Daftar Review
      const resReviews = await axios.get(`http://localhost:3000/api/reviews/${id}`);
      setReviews(resReviews.data.data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!newReview.nama || !newReview.komentar) return alert("Isi nama & komentar dulu ya!");

    setSubmitting(true);
    try {
      await axios.post(`http://localhost:3000/api/reviews`, {
        post_id: id,
        nama_user: newReview.nama,
        komentar: newReview.komentar,
        rating: newReview.rating
      });
      setNewReview({ nama: "", komentar: "", rating: 5 });
      fetchData(); // Refresh data biar komentar baru muncul
      alert("Review berhasil dikirim!");
    } catch (err) {
      alert("Gagal kirim review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
      <Loader2 className="animate-spin text-pink-500 mb-2" size={48} />
      <p className="font-black text-pink-500 italic uppercase">Memuat Detail Bunga...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-pink-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="mb-6 flex items-center gap-2 text-pink-600 font-black uppercase italic text-sm hover:translate-x-[-5px] transition-transform">
          <ArrowLeft size={18}/> Kembali ke Galeri
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white">
          <img src={post.url_gambar} className="w-full h-[400px] object-cover" alt={post.judul} />
          
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl md:text-5xl font-black text-pink-900 uppercase italic tracking-tighter">{post.judul}</h1>
              <span className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-xs font-black uppercase italic">
                {post.nama_kategori}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-10 italic text-lg">{post.isi}</p>

            <hr className="border-pink-100 mb-10" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* KOLOM KIRI: FORM REVIEW */}
              <div className="bg-pink-100 p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-black text-pink-900 uppercase italic mb-6 flex items-center gap-2">
                  <Star className="text-amber-500 fill-amber-500" /> Beri Rating
                </h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <input 
                    type="text" placeholder="Nama Anda..." 
                    className="w-full p-4 rounded-2xl border-none font-bold"
                    value={newReview.nama}
                    onChange={(e) => setNewReview({...newReview, nama: e.target.value})}
                  />
                  <select 
                    className="w-full p-4 rounded-2xl border-none font-bold text-amber-600"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (Sangat Bagus)</option>
                    <option value="4">⭐⭐⭐⭐ (Bagus)</option>
                    <option value="3">⭐⭐⭐ (Cukup)</option>
                    <option value="2">⭐⭐ (Kurang)</option>
                    <option value="1">⭐ (Buruk)</option>
                  </select>
                  <textarea 
                    placeholder="Tulis pendapatmu..." 
                    className="w-full p-4 rounded-2xl border-none font-bold h-32 resize-none"
                    value={newReview.komentar}
                    onChange={(e) => setNewReview({...newReview, komentar: e.target.value})}
                  ></textarea>
                  <button 
                    disabled={submitting}
                    className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:bg-pink-700 shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? "Mengirim..." : <><Send size={18}/> Kirim Komentar</>}
                  </button>
                </form>
              </div>

              {/* KOLOM KANAN: LIST REVIEW */}
              <div>
                <h3 className="text-xl font-black text-pink-900 uppercase italic mb-6 flex items-center gap-2">
                  <MessageCircle className="text-pink-600" /> Komentar User ({reviews.length})
                </h3>
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-black text-pink-900 uppercase text-xs italic">{rev.nama_user}</span>
                          <div className="flex text-amber-500">
                            {[...Array(rev.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor"/>)}
                          </div>
                        </div>
                        <p className="text-slate-500 text-sm italic">"{rev.komentar}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-center py-10 font-bold uppercase text-xs">Belum ada komentar...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}