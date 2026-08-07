const { getCollection } = require('../config/db');

const examCollection = getCollection('medical_exams');
const biomarkerCollection = getCollection('biomarkers');

class MedicalVaultModel {
  static async getExams(userId) {
    return await examCollection.find({ userId });
  }

  static async saveExam(userId, fileMeta) {
    return await examCollection.insert({
      userId,
      fileName: fileMeta.fileName,
      originalName: fileMeta.originalName,
      fileSize: fileMeta.fileSize,
      fileType: fileMeta.fileType,
      fileUrl: fileMeta.fileUrl,
      uploadDate: new Date().toISOString(),
      status: 'analyzed',
    });
  }

  static async getBiomarkers(userId) {
    const list = await biomarkerCollection.find({ userId });
    if (list.length > 0) return list;
    return [];
  }

  static async saveBiomarkers(userId, biomarkers) {
    await biomarkerCollection.delete({ userId });
    const docs = biomarkers.map((bm) => ({ userId, ...bm }));
    return await biomarkerCollection.insertMany(docs);
  }
}

module.exports = MedicalVaultModel;
