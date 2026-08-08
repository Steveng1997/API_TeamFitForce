const { getCollection } = require('../config/db');

const routineCollection = getCollection('routines');

class RoutineModel {
  static async findAll() {
    return await routineCollection.find();
  }

  static async getAll() {
    return await this.findAll();
  }

  static async findById(id) {
    return await routineCollection.findById(id);
  }

  static async create(data) {
    return await routineCollection.insert(data);
  }

  static async updateProgress(id, progressSeconds) {
    return await routineCollection.updateById(id, {
      progressSeconds,
      lastPlayedAt: new Date().toISOString(),
    });
  }
}

module.exports = RoutineModel;
