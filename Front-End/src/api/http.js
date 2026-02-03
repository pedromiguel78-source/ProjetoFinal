import axios from 'axios';

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api'
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default http;

