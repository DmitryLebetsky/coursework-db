const express = require('express');
const candidateStageController = require('../controllers/candidateStageController');
const {authMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/update', authMiddleware, candidateStageController.update); // Перемещение кандидата по этапам
router.get('/:candidateId', authMiddleware, candidateStageController.getStatus); // Получение текущего этапа кандидата

module.exports = router;
