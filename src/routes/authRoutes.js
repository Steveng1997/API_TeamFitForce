const express = require('express');
const AuthController = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);

module.exports = router;
