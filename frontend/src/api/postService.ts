import axiosInstance from "./axiosInstance";

/* ================= CREATE ================= */
export const createPost = async (data: any) => {
  const formData = new FormData();

  formData.append("judul", data.judul);
  formData.append("isi", data.isi);
  formData.append("category_id", data.category_id);

  if (data.gambar) {
    formData.append("gambar", data.gambar);
  }

  const response = await axiosInstance.post("/posts", formData);

  return response.data;
};

/* ================= UPDATE ================= */
export const updatePost = async (id: number, data: any) => {
  const formData = new FormData();

  formData.append("judul", data.judul);
  formData.append("isi", data.isi);
  formData.append("category_id", data.category_id);

  if (data.gambar) {
    formData.append("gambar", data.gambar);
  }

  const response = await axiosInstance.put(`/posts/${id}`, formData);

  return response.data;
};

/* ================= GET ================= */
export const getPosts = async () => {
  const response = await axiosInstance.get("/posts");
  return response.data;
};

/* ================= DELETE ================= */
export const deletePost = async (id: number) => {
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data;
};