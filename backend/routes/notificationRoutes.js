const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Получение уведомлений пользователя
router.get('/', authMiddleware, notificationController.getNotifications);

// Пометка уведомления как прочитанного
router.put('/:notificationId/read', authMiddleware, notificationController.markAsRead);

module.exports = router;
