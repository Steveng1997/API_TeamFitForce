const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Para simplificar pruebas sin token obligatorio en dev, pasamos usuario por defecto
    req.user = { id: 'usr_default_123', name: 'Carlos', email: 'carlos@teamfit.com' };
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticación inválido o expirado.',
    });
  }
};

module.exports = authMiddleware;
