const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Acceso denegado. Se requiere un token de autorización válido.',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token === 'undefined' || token === 'null') {
    return res.status(401).json({
      success: false,
      error: 'Token de autorización ausente o inválido.',
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        error: 'Token alterado o sin información de identidad.',
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticación expirado o inválido. Por favor inicia sesión de nuevo.',
    });
  }
};

module.exports = authMiddleware;
