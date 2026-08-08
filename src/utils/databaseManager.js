const fs = require('fs');
const path = require('path');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} = require('@aws-sdk/lib-dynamodb');
const env = require('../config/env');

const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Configuración de cliente DynamoDB
let docClient = null;
if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
  try {
    const client = new DynamoDBClient({
      region: env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
    console.log('[DynamoDB] Cliente de AWS DynamoDB inicializado correctamente.');
  } catch (err) {
    console.warn('[DynamoDB] No se pudo inicializar el cliente de DynamoDB. Usando respaldo JSON.', err.message);
  }
}

const warnedTables = new Set();

const TABLE_MAPPING = {
  users: env.DYNAMODB_TABLE_USERS || 'TeamFit_Users',
  biometrics: env.DYNAMODB_TABLE_BIOMETRICS || 'TeamFit_Biometrics',
  nutrition: env.DYNAMODB_TABLE_NUTRITION || 'TeamFit_Nutrition',
  recipes: env.DYNAMODB_TABLE_RECIPES || 'TeamFit_Recipes',
  smoothies: env.DYNAMODB_TABLE_SMOOTHIES || 'TeamFit_Smoothies',
  routines: env.DYNAMODB_TABLE_ROUTINES || 'TeamFit_Routines',
  biomarkers: env.DYNAMODB_TABLE_BIOMARKERS || 'TeamFit_Biomarkers',
  coach_messages: env.DYNAMODB_TABLE_COACH || 'TeamFit_CoachMessages',
  medical_exams: 'TeamFit_MedicalExams',
};

class Collection {
  constructor(name) {
    this.name = name;
    this.tableName = TABLE_MAPPING[name] || `TeamFit_${name}`;
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
    if (docClient && env.DB_TYPE === 'dynamodb') {
      try {
        const command = new ScanCommand({
          TableName: this.tableName,
        });
        const response = await docClient.send(command);
        let items = response.Items || [];

        // Filtrar localmente por propiedades del query
        if (Object.keys(query).length > 0) {
          items = items.filter((item) => {
            for (const key in query) {
              if (item[key] !== query[key]) return false;
            }
            return true;
          });
        }
        return items;
      } catch (err) {
        if (!warnedTables.has(this.tableName)) {
          warnedTables.add(this.tableName);
          console.log(`[Database Info - ${this.tableName}]: Usando almacenamiento persistente JSON.`);
        }
      }
    }

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
    if (docClient && env.DB_TYPE === 'dynamodb') {
      try {
        const command = new GetCommand({
          TableName: this.tableName,
          Key: { id },
        });
        const response = await docClient.send(command);
        if (response.Item) return response.Item;
      } catch (err) {
        // Continuar con fallback
      }
    }
    const items = this._readData();
    return items.find((item) => item.id === id || item._id === id) || null;
  }

  async insert(doc) {
    const newDoc = {
      id: doc.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc,
    };

    if (docClient && env.DB_TYPE === 'dynamodb') {
      try {
        const command = new PutCommand({
          TableName: this.tableName,
          Item: newDoc,
        });
        await docClient.send(command);
      } catch (err) {
        console.warn(`[DynamoDB Put Warn - ${this.tableName}]: ${err.message}`);
      }
    }

    const items = this._readData();
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

    if (docClient && env.DB_TYPE === 'dynamodb' && updatedDoc) {
      try {
        const command = new PutCommand({
          TableName: this.tableName,
          Item: updatedDoc,
        });
        await docClient.send(command);
      } catch (err) {
        console.warn(`[DynamoDB Update Warn - ${this.tableName}]: ${err.message}`);
      }
    }

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
