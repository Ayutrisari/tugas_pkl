// src/types/post.ts
export interface Post {
    id: number;
    judul: string;    // Wajib ada untuk App.tsx
    isi: string;      // Wajib ada untuk App.tsx
    gambar: string;   // Wajib ada untuk App.tsx
    category_id: number;
}

export interface PostResponse {
    status: string;
    data: Post[];
}