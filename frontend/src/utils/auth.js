import {jwtDecode} from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Текущее время в секундах
    if (decoded.exp <= currentTime) {
      localStorage.removeItem('token'); // Удаляем токен, если истек срок
      return false;
    }
    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('token'); // Удаляем некорректный токен
    return false;
  }
};

export const isAdmin = () => {
  if (!isAuthenticated()) return false;

  const token = localStorage.getItem('token');
  try {
    const decoded = jwtDecode(token);
    return decoded.role === 'admin'; // Проверяем роль пользователя
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};
