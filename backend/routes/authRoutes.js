const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
// Создание пользователя администратором
router.post('/create', authMiddleware, roleMiddleware(['admin']), authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
