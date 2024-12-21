const express = require('express');
const router = express.Router();
const actionLogController = require('../controllers/actionLogController');
const authMiddleware = require('../middleware/authMiddleware');

// Получение лога действий
router.get('/', authMiddleware, actionLogController.getAll);

module.exports = router;
