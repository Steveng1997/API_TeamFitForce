const jwt = require('jsonwebtoken');
const env = require('../config/env');
const UserModel = require('../models/User');

const authMiddleware = async (req, res, next) => {
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

    // Verificar si el usuario aún existe en la base de datos (y no fue eliminado)
    const existingUser = await UserModel.findById(decoded.id);
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        error: 'El usuario ya no existe en la base de datos o su cuenta fue eliminada. Por favor inicie sesión de nuevo.',
      });
    }

    req.user = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticación expirado o inválido. Por favor inicia sesión de nuevo.',
    });
  }
};

module.exports = authMiddleware;
