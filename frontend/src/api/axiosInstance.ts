import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Sesuaikan dengan port backend kamu
});

export default axiosInstance;