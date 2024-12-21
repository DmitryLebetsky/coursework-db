const express = require('express');
const router = express.Router();
const jobTypeController = require('../controllers/jobTypeController');
const {authMiddleware} = require('../middleware/authMiddleware');

router.post('/', authMiddleware, jobTypeController.create); // Создание типа вакансии
router.get('/', authMiddleware, jobTypeController.getAll); // Получение всех типов вакансий
router.delete('/:id', authMiddleware, jobTypeController.delete); // Удаление типа вакансии

module.exports = router;
