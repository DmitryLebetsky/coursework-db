const express = require('express');
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, candidateController.create); // Добавление кандидата
router.get('/:vacancyId', authMiddleware, candidateController.getAllByVacancy); // Получение всех кандидатов по вакансии
router.delete('/:candidateId/stages', authMiddleware, candidateController.removeFromStage); // Удаление из этапов
router.delete('/:candidateId', authMiddleware, candidateController.delete); // Полное удаление


module.exports = router;
