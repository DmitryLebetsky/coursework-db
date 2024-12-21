const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stages/:jobId', authMiddleware, analyticsController.getStageCounts); // Количество кандидатов
router.get('/durations/:jobId', authMiddleware, analyticsController.getAverageDurations); // Средняя продолжительность
router.get('/conversions/:jobId', authMiddleware, analyticsController.getConversionRates); // Конверсии
router.get('/average-closing-time', authMiddleware, analyticsController.getAverageClosingTime); // Среднее время закрытия вакансии

module.exports = router;
