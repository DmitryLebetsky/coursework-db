import axios from 'axios';
import { isAuthenticated } from './auth';

const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use(
  (config) => {
    if (!isAuthenticated()) {
      window.location.href = '/login'; // Перенаправляем, если токен истек
      return Promise.reject(new Error('Token has expired'));
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('token'); // Удаляем токен на случай некорректной работы
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;