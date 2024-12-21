import {jwtDecode} from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Текущее время в секундах
    return decoded.exp > currentTime; // Проверяем срок действия токена
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

// Проверяем, является ли пользователь администратором
export const isAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.role === 'admin'; // Проверяем роль пользователя
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};
