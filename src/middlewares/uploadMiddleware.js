const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

const uploadDir = env.UPLOAD_PATH;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre aleatorio criptográfico para evitar sobreescrituras o exploits de ruta
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const cleanExt = path.extname(file.originalname).toLowerCase();
    cb(null, 'exam-' + uniqueSuffix + cleanExt);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
  
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Seguridad: Tipo de archivo no permitido. Solo se aceptan documentos PDF o imágenes PNG/JPG.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // Máximo 25 MB
  fileFilter: fileFilter,
});

module.exports = upload;
