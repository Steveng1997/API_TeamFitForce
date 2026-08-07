const express = require('express');
const CoachController = require('../controllers/coachController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/history', authMiddleware, CoachController.getHistory);
router.post('/chat', authMiddleware, CoachController.chat);
router.post('/motivate', authMiddleware, CoachController.motivate);

module.exports = router;
