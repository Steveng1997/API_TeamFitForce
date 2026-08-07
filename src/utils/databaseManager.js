const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this._ensureFile();
  }

  _ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf8');
    }
  }

  _readData() {
    try {
      this._ensureFile();
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error(`Error al leer la colección ${this.name}:`, error);
      return [];
    }
  }

  _writeData(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error(`Error al escribir en la colección ${this.name}:`, error);
    }
  }

  async find(query = {}) {
    const items = this._readData();
    return items.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const items = await this.find(query);
    return items[0] || null;
  }

  async findById(id) {
    const items = this._readData();
    return items.find((item) => item.id === id || item._id === id) || null;
  }

  async insert(doc) {
    const items = this._readData();
    const newDoc = {
      id: doc.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc,
    };
    items.push(newDoc);
    this._writeData(items);
    return newDoc;
  }

  async insertMany(docs) {
    const results = [];
    for (const doc of docs) {
      const inserted = await this.insert(doc);
      results.push(inserted);
    }
    return results;
  }

  async update(query, updateData) {
    const items = this._readData();
    let updatedCount = 0;

    const updatedItems = items.map((item) => {
      let matches = true;
      for (const key in query) {
        if (item[key] !== query[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        updatedCount++;
        return {
          ...item,
          ...updateData,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    this._writeData(updatedItems);
    return updatedCount;
  }

  async updateById(id, updateData) {
    const items = this._readData();
    let updatedDoc = null;

    const updatedItems = items.map((item) => {
      if (item.id === id || item._id === id) {
        updatedDoc = {
          ...item,
          ...updateData,
          updatedAt: new Date().toISOString(),
        };
        return updatedDoc;
      }
      return item;
    });

    this._writeData(updatedItems);
    return updatedDoc;
  }

  async delete(query) {
    const items = this._readData();
    const initialLength = items.length;
    const filteredItems = items.filter((item) => {
      for (const key in query) {
        if (item[key] === query[key]) return false;
      }
      return true;
    });

    this._writeData(filteredItems);
    return initialLength - filteredItems.length;
  }

  async clear() {
    this._writeData([]);
  }
}

const collections = {};

function getCollection(name) {
  if (!collections[name]) {
    collections[name] = new Collection(name);
  }
  return collections[name];
}

module.exports = {
  getCollection,
};
