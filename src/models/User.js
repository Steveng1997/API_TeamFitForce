const { getDB, TABLES } = require('../utils/databaseManager');

class UserModel {
  static async create(userData) {
    const db = getDB();
    const newUser = {
      id: `usr_${Date.now()}_${Math.round(Math.random() * 1000)}`,
      name: userData.name,
      username: userData.username || (userData.email ? userData.email.split('@')[0] : 'usuario'),
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      age: userData.age || '32',
      weight: userData.weight || '82',
      size: userData.size || 'M',
      height: userData.height || '178',
      goal: userData.goal || 'Tonificar y ganar masa muscular',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (db.isDynamoDB) {
      await db.put(TABLES.USERS, newUser);
    } else {
      const users = db.readLocal(TABLES.USERS);
      users.push(newUser);
      db.writeLocal(TABLES.USERS, users);
    }

    return newUser;
  }

  static async findById(id) {
    const db = getDB();
    if (db.isDynamoDB) {
      return await db.get(TABLES.USERS, { id });
    } else {
      const users = db.readLocal(TABLES.USERS);
      return users.find((u) => u.id === id);
    }
  }

  static async findByEmail(email) {
    const db = getDB();
    const cleanEmail = (email || '').toLowerCase().trim();
    if (db.isDynamoDB) {
      return await db.queryOne(TABLES.USERS, 'email', cleanEmail);
    } else {
      const users = db.readLocal(TABLES.USERS);
      return users.find((u) => (u.email || '').toLowerCase() === cleanEmail);
    }
  }

  static async findByUsername(username) {
    const db = getDB();
    const cleanUsername = (username || '').toLowerCase().trim();
    if (db.isDynamoDB) {
      return await db.queryOne(TABLES.USERS, 'username', cleanUsername);
    } else {
      const users = db.readLocal(TABLES.USERS);
      return users.find((u) => (u.username || '').toLowerCase() === cleanUsername);
    }
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
    const db = getDB();
    if (db.isDynamoDB) {
      return await db.scan(TABLES.USERS);
    } else {
      return db.readLocal(TABLES.USERS);
    }
  }

  static async update(id, updateData) {
    const db = getDB();
    if (db.isDynamoDB) {
      const existing = await this.findById(id);
      if (!existing) return null;
      const updated = { ...existing, ...updateData, updatedAt: new Date().toISOString() };
      await db.put(TABLES.USERS, updated);
      return updated;
    } else {
      const users = db.readLocal(TABLES.USERS);
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) return null;
      users[index] = { ...users[index], ...updateData, updatedAt: new Date().toISOString() };
      db.writeLocal(TABLES.USERS, users);
      return users[index];
    }
  }
}

module.exports = UserModel;
