const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'teamfit_force_super_secret_jwt_key_2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  DB_TYPE: process.env.DB_TYPE || 'json_storage',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/teamfit_db',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/teamfit_db',
  UPLOAD_PATH: process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads'),
};
