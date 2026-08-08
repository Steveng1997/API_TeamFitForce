const { getCollection } = require('../config/db');

const collection = getCollection('biometrics');

class BiometricModel {
  static async findByUserId(userId) {
    return await collection.find({ userId });
  }

  static async findLatestByUserId(userId) {
    const items = await collection.find({ userId });
    if (items.length === 0) return null;
    return items[items.length - 1];
  }

  static async create(data) {
    const steps = typeof data.steps === 'number' ? data.steps : 0;
    const stepsGoal = data.stepsGoal || 10000;
    const stepsPercentage = Math.min(100, Math.round((steps / stepsGoal) * 100));

    return await collection.insert({
      userId: data.userId,
      date: data.date || new Date().toISOString().split('T')[0],
      steps,
      stepsGoal,
      stepsPercentage,
      activeCalories: typeof data.activeCalories === 'number' ? data.activeCalories : Math.round(steps * 0.04),
      caloriesGoal: data.caloriesGoal || 700,
      streakDays: typeof data.streakDays === 'number' ? data.streakDays : 0,
      restingHeartRate: data.restingHeartRate || 65,
      biochemScore: data.biochemScore || 0,
    });
  }

  static async updateLatest(userId, updateData) {
    const latest = await this.findLatestByUserId(userId);
    if (!latest) {
      return await this.create({ userId, ...updateData });
    }
    return await collection.updateById(latest.id, updateData);
  }
}

module.exports = BiometricModel;
