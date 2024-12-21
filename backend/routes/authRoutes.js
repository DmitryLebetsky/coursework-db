const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const router = express.Router();

// Создание пользователя администратором
router.post('/create', authMiddleware, roleMiddleware(['admin']), authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Получение списка рекрутеров
router.get('/recruiters', authMiddleware, roleMiddleware(['admin']), authController.getRecruiters);

// Удаление пользователя
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), authController.deleteUser);

module.exports = router;