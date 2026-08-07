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
    return await collection.insert({
      userId: data.userId,
      date: data.date || new Date().toISOString().split('T')[0],
      steps: data.steps || 8450,
      stepsGoal: data.stepsGoal || 10000,
      stepsPercentage: data.stepsPercentage || 84,
      activeCalories: data.activeCalories || 520,
      caloriesGoal: data.caloriesGoal || 700,
      streakDays: data.streakDays || 12,
      restingHeartRate: data.restingHeartRate || 62,
      biochemScore: data.biochemScore || 92,
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
