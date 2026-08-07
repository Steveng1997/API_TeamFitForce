const { getCollection } = require('../config/db');

const collection = getCollection('smoothies');

class SmoothieModel {
  static async findAll() {
    return await collection.find();
  }

  static async findById(id) {
    return await collection.findById(id);
  }

  static async create(data) {
    return await collection.insert({
      title: data.title,
      type: data.type || 'verde',
      phase: data.phase || 'FASE ACTIVA: OPTIMIZACIÓN DEL PROGRESO',
      consumptionTiming: data.consumptionTiming || 'Matutino en ayunas',
      ingredients: data.ingredients || [],
      benefits: data.benefits || [],
      isConsumed: data.isConsumed || false,
      consumedAt: data.isConsumed ? new Date().toISOString() : null,
    });
  }

  static async toggleConsume(id) {
    const smoothie = await collection.findById(id);
    if (!smoothie) return null;

    const newStatus = !smoothie.isConsumed;
    return await collection.updateById(id, {
      isConsumed: newStatus,
      consumedAt: newStatus ? new Date().toISOString() : null,
    });
  }
}

module.exports = SmoothieModel;
