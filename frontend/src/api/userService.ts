// src/api/userService.ts
import axiosInstance from './axiosInstance';

// Kamu HARUS pakai kata 'type' karena ini interface, bukan class/function
import type { Category, ApiResponse, Post } from '../types/index.ts'; 

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

export const getPosts = async (): Promise<ApiResponse<Post[]>> => {
  const response = await axiosInstance.get('/posts');
  return response.data;
};