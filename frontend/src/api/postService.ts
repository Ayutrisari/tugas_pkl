import axiosInstance from "./axiosInstance";

/* ================= CREATE ================= */
export const createPost = async (data: any) => {
  const formData = new FormData();

  formData.append("judul", data.judul);
  formData.append("isi", data.isi);
  formData.append("category_id", data.category_id);

  if (data.gambar) {
    // Gunakan 'url_gambar' agar sesuai dengan upload.single('url_gambar') di backend
    formData.append("url_gambar", data.gambar);
  }

  const response = await axiosInstance.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

/* ================= UPDATE ================= */
export const updatePost = async (id: number, data: any) => {
  const formData = new FormData();

  formData.append("judul", data.judul);
  formData.append("isi", data.isi);
  formData.append("category_id", data.category_id);

  if (data.gambar) {
    // DISESUAIKAN: Harus 'url_gambar' juga supaya konsisten dengan backend
    formData.append("url_gambar", data.gambar);
  }

  const response = await axiosInstance.put(`/posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

/* ================= GET POSTS ================= */
export const getPosts = async () => {
  const response = await axiosInstance.get("/posts");
  return response.data;
};

/* ================= GET CATEGORIES ================= */
// TAMBAHKAN INI: Supaya dropdown di Admin.tsx muncul datanya
export const getCategories = async () => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

/* ================= DELETE ================= */
export const deletePost = async (id: number) => {
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data;
};