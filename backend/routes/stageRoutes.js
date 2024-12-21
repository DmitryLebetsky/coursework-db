const express = require('express');
const router = express.Router();
const stageController = require('../controllers/stageController');
const {authMiddleware} = require('../middleware/authMiddleware');

router.post('/', authMiddleware, stageController.create);
router.put('/:id', authMiddleware, stageController.update);
router.delete('/:id', authMiddleware, stageController.delete);

module.exports = router;
