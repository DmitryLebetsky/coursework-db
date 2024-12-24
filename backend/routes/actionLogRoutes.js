const express = require('express');
const router = express.Router();
const actionLogController = require('../controllers/actionLogController');
const {authMiddleware, roleMiddleware} = require('../middleware/authMiddleware');

// Получение лога действий
router.get('/', authMiddleware, roleMiddleware(['admin']), actionLogController.getAll);

module.exports = router;
