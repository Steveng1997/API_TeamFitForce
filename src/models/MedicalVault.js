const { getDB, TABLES } = require('../utils/databaseManager');

class MedicalVaultModel {
  static async saveExam(userId, fileMeta, analysisResult, aiResponseId) {
    const db = getDB();
    const examRecord = {
      id: `exam_${Date.now()}_${Math.round(Math.random() * 1000)}`,
      userId,
      fileUrl: fileMeta.fileUrl,
      fileName: fileMeta.fileName,
      originalName: fileMeta.originalName,
      fileType: fileMeta.fileType,
      fileSize: fileMeta.fileSize,
      aiResponseId: aiResponseId || `ai_resp_${Date.now()}`,
      biochemScore: analysisResult?.biochemScore || 85,
      analysisResult: analysisResult || {},
      createdAt: new Date().toISOString(),
    };

    if (db.isDynamoDB) {
      await db.put(TABLES.MEDICAL_EXAMS || 'TeamFit_MedicalExams', examRecord);
    } else {
      const exams = db.readLocal(TABLES.MEDICAL_EXAMS || 'medical_exams');
      exams.push(examRecord);
      db.writeLocal(TABLES.MEDICAL_EXAMS || 'medical_exams', exams);
    }

    return examRecord;
  }

  static async getExamsByUserId(userId) {
    const db = getDB();
    if (db.isDynamoDB) {
      return await db.query(TABLES.MEDICAL_EXAMS || 'TeamFit_MedicalExams', 'userId', userId);
    } else {
      const exams = db.readLocal(TABLES.MEDICAL_EXAMS || 'medical_exams');
      return exams.filter((e) => e.userId === userId);
    }
  }

  static async getLatestExam(userId) {
    const exams = await this.getExamsByUserId(userId);
    if (!exams || exams.length === 0) return null;
    return exams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  static async saveBiomarkers(userId, biomarkersArray) {
    const db = getDB();
    const records = biomarkersArray.map((bm, index) => ({
      id: bm.id || `bm_${Date.now()}_${index}`,
      userId,
      name: bm.name,
      value: String(bm.value),
      unit: bm.unit,
      referenceRange: bm.referenceRange,
      status: bm.status,
      statusLabel: bm.statusLabel,
      category: bm.category || 'Clínico',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    if (db.isDynamoDB) {
      for (const record of records) {
        await db.put(TABLES.BIOMARKERS, record);
      }
    } else {
      const current = db.readLocal(TABLES.BIOMARKERS);
      const filtered = current.filter((b) => b.userId !== userId);
      const updated = [...filtered, ...records];
      db.writeLocal(TABLES.BIOMARKERS, updated);
    }

    return records;
  }

  static async getBiomarkers(userId) {
    const db = getDB();
    if (db.isDynamoDB) {
      return await db.query(TABLES.BIOMARKERS, 'userId', userId);
    } else {
      const biomarkers = db.readLocal(TABLES.BIOMARKERS);
      return biomarkers.filter((b) => b.userId === userId);
    }
  }
}

module.exports = MedicalVaultModel;
