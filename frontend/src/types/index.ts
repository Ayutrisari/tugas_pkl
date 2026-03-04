// src/types/index.ts

export interface Category {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category_id?: number;
  user_id?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}