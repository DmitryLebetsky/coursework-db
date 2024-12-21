const express = require('express');
const router = express.Router();
const candidateCommentController = require('../controllers/candidateCommentController');
const authMiddleware = require('../middleware/authMiddleware');

// Добавление комментария
router.post('/', authMiddleware, candidateCommentController.create);

// Получение комментариев по кандидату
router.get('/:candidateId', authMiddleware, candidateCommentController.getAllByCandidate);

module.exports = router;
