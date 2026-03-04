import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // Pastikan path-nya benar
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
    const [judul, setJudul] = useState('');
    const [isi, setIsi] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [gambar, setGambar] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // 1. Ambil daftar kategori untuk dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories');
                setCategories(response.data.data); // Sesuai struktur data: { data: [...] }
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
            }
        };
        fetchCategories();
    }, []);

    // 2. Fungsi Kirim Data (Multipart Form Data)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Gunakan FormData karena ada file gambar
        const formData = new FormData();
        formData.append('judul', judul);
        formData.append('isi', isi);
        formData.append('category_id', categoryId);
        if (gambar) {
            formData.append('gambar', gambar); // Nama field 'gambar' harus sama dengan di Backend/Multer
        }

        try {
            const response = await axiosInstance.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Wajib untuk upload file
                },
            });

            if (response.data.status === "success") {
                alert("Postingan berhasil dibuat! 🚀");
                navigate('/posts'); // Kembali ke halaman daftar post
            }
        } catch (error) {
            alert(error.response?.data?.message || "Terjadi kesalahan");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px' }}>
            <h2>Tambah Postingan Baru</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Judul:</label><br />
                    <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required style={{ width: '100%' }} />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Kategori:</label><br />
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required style={{ width: '100%' }}>
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Isi Postingan:</label><br />
                    <textarea value={isi} onChange={(e) => setIsi(e.target.value)} required style={{ width: '100%', height: '100px' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>Upload Gambar:</label><br />
                    <input type="file" accept="image/*" onChange={(e) => setGambar(e.target.files[0])} style={{ width: '100%' }} />
                </div>

                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Simpan Postingan
                </button>
            </form>
        </div>
    );
};

export default AddPost;