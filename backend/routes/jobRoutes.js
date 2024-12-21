const express = require('express');
const jobController = require('../controllers/jobController');
const {authMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, jobController.create); // Создание вакансии
router.get('/', authMiddleware, jobController.getAll); // Получение всех вакансий
router.get('/:id', authMiddleware, jobController.getById); // Получение вакансии по ID
router.put('/:id', authMiddleware, jobController.update); // Обновление title, description вакансии
router.put('/:id/status', authMiddleware, jobController.updateStatus); // Обновление статуса вакансии
router.delete('/:id', authMiddleware, jobController.delete); // Удаление вакансии

module.exports = router;
