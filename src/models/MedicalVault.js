const { getCollection } = require('../utils/databaseManager');

const examsCollection = getCollection('medical_exams');
const biomarkersCollection = getCollection('biomarkers');

class MedicalVaultModel {
  static async saveExam(userId, fileMeta, analysisResult, aiResponseId) {
    const examRecord = {
      userId,
      fileUrl: fileMeta.fileUrl,
      fileName: fileMeta.fileName,
      originalName: fileMeta.originalName,
      fileType: fileMeta.fileType,
      fileSize: fileMeta.fileSize,
      aiResponseId: aiResponseId || `ai_resp_${Date.now()}`,
      biochemScore: analysisResult?.biochemScore || 85,
      analysisResult: analysisResult || {},
    };

    return await examsCollection.insert(examRecord);
  }

  static async getExamsByUserId(userId) {
    return await examsCollection.find({ userId });
  }

  static async getLatestExam(userId) {
    const exams = await this.getExamsByUserId(userId);
    if (!exams || exams.length === 0) return null;
    return exams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  static async saveBiomarkers(userId, biomarkersArray) {
    const records = [];
    for (const bm of biomarkersArray) {
      const saved = await biomarkersCollection.insert({
        userId,
        name: bm.name,
        value: String(bm.value),
        unit: bm.unit,
        referenceRange: bm.referenceRange,
        status: bm.status,
        statusLabel: bm.statusLabel,
        category: bm.category || 'Clínico',
      });
      records.push(saved);
    }
    return records;
  }

  static async getBiomarkers(userId) {
    return await biomarkersCollection.find({ userId });
  }
}

module.exports = MedicalVaultModel;
