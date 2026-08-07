const { getCollection } = require('../config/db');
const seedData = require('./seedData');

const runSeed = async () => {
  try {
    console.log('[Seed] Iniciando el populado inicial de la Base de Datos...');

    for (const key in seedData) {
      const collection = getCollection(key);
      await collection.clear();
      await collection.insertMany(seedData[key]);
      console.log(`[Seed] Colección '${key}' poblada con ${seedData[key].length} registros.`);
    }

    console.log('[Seed] ¡Proceso de Seeding completado exitosamente!');
  } catch (error) {
    console.error('[Seed] Error durante la ejecución del seeding:', error);
  }
};

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
