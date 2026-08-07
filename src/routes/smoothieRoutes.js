const express = require('express');
const SmoothieController = require('../controllers/smoothieController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, SmoothieController.getSmoothies);
router.post('/', authMiddleware, SmoothieController.createSmoothie);
router.patch('/:id/toggle-consume', authMiddleware, SmoothieController.toggleConsume);

module.exports = router;
