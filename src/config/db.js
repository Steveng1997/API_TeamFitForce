const env = require('./env');
const { getCollection } = require('../utils/databaseManager');

const connectDB = async () => {
  try {
    console.log(`[Database] Inicializando conexión en modo: ${env.DB_TYPE}`);
    if (env.DB_TYPE === 'postgres') {
      console.log(`[Database] PostgreSQL URI configurado: ${env.DATABASE_URL}`);
    } else if (env.DB_TYPE === 'mongodb') {
      console.log(`[Database] MongoDB URI configurado: ${env.MONGODB_URI}`);
    } else {
      console.log('[Database] Utilizando almacenamiento persistente JSON de alta velocidad listo para dev/prod.');
    }
    return true;
  } catch (error) {
    console.error('[Database] Error en la conexión a la Base de Datos:', error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  getCollection,
};
