const { getCollection } = require('../config/db');

const collection = getCollection('users');

class UserModel {
  static async findAll() {
    return await collection.find();
  }

  static async findById(id) {
    return await collection.findById(id);
  }

  static async findByEmail(email) {
    return await collection.findOne({ email });
  }

  static async create(userData) {
    return await collection.insert({
      name: userData.name || 'Carlos',
      email: userData.email || 'carlos@teamfit.com',
      password: userData.password || '$2a$10$e8w8q...',
      age: userData.age || '32',
      weight: userData.weight || '82',
      size: userData.size || 'M',
      height: userData.height || '178',
      goal: userData.goal || 'Tonificar y ganar masa muscular',
      themePreference: userData.themePreference || 'dark',
      avatarUrl: userData.avatarUrl || null,
    });
  }

  static async update(id, updateData) {
    return await collection.updateById(id, updateData);
  }

  static async delete(id) {
    return await collection.delete({ id });
  }
}

module.exports = UserModel;
