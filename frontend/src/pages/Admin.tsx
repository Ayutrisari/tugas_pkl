import { useState } from "react";
import { createPost } from "../api/postService";

const Admin = () => {
  const [form, setForm] = useState({
    judul: "",
    isi: "",
    category_id: "",
    gambar: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((prev) => ({
        ...prev,
        gambar: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await createPost(form);
      console.log("SUCCESS:", res);
      alert("🌸 Berhasil tambah bunga");

      // Reset form
      setForm({
        judul: "",
        isi: "",
        category_id: "",
        gambar: null,
      });
    } catch (error: any) {
      console.log("ERROR FULL:", error);
      console.log("ERROR RESPONSE:", error?.response);
      console.log("ERROR DATA:", error?.response?.data);

      alert(error?.response?.data?.message || "Gagal upload bunga ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌷 Tambah Produk Flower App</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="judul"
          placeholder="Nama Bunga"
          value={form.judul}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <textarea
          name="isi"
          placeholder="Deskripsi"
          value={form.isi}
          onChange={handleChange}
          style={styles.textarea}
          required
        />

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Pilih Category</option>
          <option value="1">🌸 Tanaman Hias</option>
          <option value="2">🌿 Tumbuhan Hijau</option>
          <option value="3">🍔 Makanan</option>
          <option value="4">🥤 Minuman</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={styles.file}
          required
        />

        <button type="submit" style={styles.button}>
          Simpan 🌼
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "90px",
  },
  file: {
    padding: "5px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#ff69b4",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Admin;