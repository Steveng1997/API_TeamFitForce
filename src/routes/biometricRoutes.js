const express = require('express');
const BiometricController = require('../controllers/biometricController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/today', authMiddleware, BiometricController.getTodayBiometrics);
router.post('/log', authMiddleware, BiometricController.logBiometrics);

module.exports = router;
