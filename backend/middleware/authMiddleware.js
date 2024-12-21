const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // сохраняем данные пользователя в запросе
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role; // Получаем роль пользователя из JWT

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
}

module.exports = {
  authMiddleware,
  roleMiddleware,
};
