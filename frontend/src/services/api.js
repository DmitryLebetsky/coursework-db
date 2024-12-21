import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Базовый URL (учитывая proxy)
});

// Перехватчик ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Если сервер возвращает 401 (Unauthorized)
      localStorage.removeItem('token'); // Удаляем токен
      window.location.href = '/login'; // Перенаправляем на страницу логина
    }
    return Promise.reject(error);
  }
);

export default api;
