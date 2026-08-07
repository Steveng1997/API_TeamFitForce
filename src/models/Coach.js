const { getCollection } = require('../config/db');

const collection = getCollection('coach_messages');

class CoachModel {
  static async getHistory(userId) {
    return await collection.find({ userId });
  }

  static async addMessage(userId, sender, content) {
    return await collection.insert({
      userId,
      sender, // 'user' | 'coach'
      content,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = CoachModel;
