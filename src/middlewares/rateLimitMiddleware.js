const rateLimit = require('express-rate-limit');

// Límite estricto para autenticación (Prevención de ataques de Fuerza Bruta)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Demasiados intentos fallidos desde esta IP. Por seguridad, la cuenta ha sido bloqueada temporalmente por 15 minutos.',
  },
});

// Límite general para la API REST (Prevención de DDoS / Spam)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Máximo 100 peticiones por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Has excedido el límite de peticiones por minuto. Por favor intenta más tarde.',
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};
