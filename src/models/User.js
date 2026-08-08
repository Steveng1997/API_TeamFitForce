const { getCollection } = require('../utils/databaseManager');

const collection = getCollection('users');

class UserModel {
  static async create(userData) {
    const newUser = {
      name: userData.name,
      username: userData.username || (userData.email ? userData.email.split('@')[0] : 'usuario'),
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      age: userData.age || '32',
      weight: userData.weight || '82',
      size: userData.size || 'M',
      height: userData.height || '178',
      goal: userData.goal || 'Tonificar y ganar masa muscular',
    };

    return await collection.insert(newUser);
  }

  static async findById(id) {
    return await collection.findById(id);
  }

  static async findByEmail(email) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const items = await collection.find({ email: cleanEmail });
    if (items && items.length > 0) return items[0];
    const all = await collection.find({});
    return all.find((u) => (u.email || '').toLowerCase() === cleanEmail) || null;
  }

  static async findByUsername(username) {
    const cleanUsername = (username || '').toLowerCase().trim();
    const items = await collection.find({ username: cleanUsername });
    if (items && items.length > 0) return items[0];
    const all = await collection.find({});
    return all.find((u) => (u.username || '').toLowerCase() === cleanUsername) || null;
  }

  static async findByEmailOrUsername(identifier) {
    const cleanId = (identifier || '').toLowerCase().trim();
    let user = await this.findByEmail(cleanId);
    if (!user) {
      user = await this.findByUsername(cleanId);
    }
    return user;
  }

  static async findAll() {
    return await collection.find({});
  }

  static async update(id, updateData) {
    return await collection.updateById(id, updateData);
  }
}

module.exports = UserModel;
