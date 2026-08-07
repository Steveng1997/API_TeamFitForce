const MedicalVaultModel = require('../models/MedicalVault');
const MedicalService = require('../services/medicalService');

class MedicalVaultController {
  static async uploadExam(req, res, next) {
    try {
      const userId = req.user?.id || 'usr_default_123';
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No se subió ningún archivo. Selecciona un archivo PDF, PNG o JPG.',
        });
      }

      const fileMeta = {
        fileName: file.filename,
        originalName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        fileUrl: `/uploads/${file.filename}`,
      };

      const savedExam = await MedicalVaultModel.saveExam(userId, fileMeta);

      // Ejecutar motor de análisis de biomarcadores con IA
      const analysisResult = MedicalService.analyzeBiomarkers();

      res.status(201).json({
        success: true,
        message: 'Examen de laboratorio subido y analizado con éxito por la IA Bóveda Médica',
        data: {
          exam: savedExam,
          analysis: analysisResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAnalysisResults(req, res, next) {
    try {
      const userId = req.user?.id || 'usr_default_123';
      let userBiomarkers = await MedicalVaultModel.getBiomarkers(userId);

      if (!userBiomarkers || userBiomarkers.length === 0) {
        userBiomarkers = undefined; // Usará los predeterminados en el servicio
      }

      const analysis = MedicalService.analyzeBiomarkers(userBiomarkers);

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBiomarkers(req, res, next) {
    try {
      const userId = req.user?.id || 'usr_default_123';
      let biomarkers = await MedicalVaultModel.getBiomarkers(userId);

      if (!biomarkers || biomarkers.length === 0) {
        const analysis = MedicalService.analyzeBiomarkers();
        biomarkers = analysis.biomarkers;
      }

      res.json({
        success: true,
        count: biomarkers.length,
        data: biomarkers,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBiomarkers(req, res, next) {
    try {
      const userId = req.user?.id || 'usr_default_123';
      const { biomarkers } = req.body;

      if (!Array.isArray(biomarkers)) {
        return res.status(400).json({ success: false, error: 'Biomarcadores deben enviarse en formato arreglo.' });
      }

      const saved = await MedicalVaultModel.saveBiomarkers(userId, biomarkers);
      const analysis = MedicalService.analyzeBiomarkers(biomarkers);

      res.json({
        success: true,
        message: 'Biomarcadores actualizados y reevaluados por la IA',
        data: {
          savedBiomarkers: saved,
          analysis,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MedicalVaultController;
