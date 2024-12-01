const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Пример защищенного маршрута
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Profile data', user: req.user });
});

module.exports = router;
