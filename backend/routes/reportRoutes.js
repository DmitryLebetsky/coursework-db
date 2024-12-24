const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const {authMiddleware, roleMiddleware} = require('../middleware/authMiddleware');

// Создание отчёта
router.post('/', authMiddleware, reportController.create);

// Получение всех отчётов
router.get(
    '/',
    authMiddleware,
    roleMiddleware(['admin', 'recruiter']),
    reportController.getAll
  );

module.exports = router;
