const MedicalVaultModel = require('../models/MedicalVault');
const MedicalService = require('../services/medicalService');
const UserModel = require('../models/User');

class MedicalVaultController {
  static async uploadExam(req, res, next) {
    try {
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No se subió ningún archivo. Selecciona un archivo PDF, PNG, JPG o JPEG válido.',
        });
      }

      const userProfile = (await UserModel.findById(userId)) || { name: req.user.name };

      const fileMeta = {
        fileName: file.filename,
        originalName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        fileUrl: `/uploads/${file.filename}`,
      };

      const aiResponseId = `ai_resp_${Date.now()}_${Math.round(Math.random() * 10000)}`;
      const analysisResult = MedicalService.processExamFile(file, userProfile);

      const savedExam = await MedicalVaultModel.saveExam(userId, fileMeta, analysisResult, aiResponseId);

      if (analysisResult.biomarkers && analysisResult.biomarkers.length > 0) {
        await MedicalVaultModel.saveBiomarkers(userId, analysisResult.biomarkers);
      }

      res.status(201).json({
        success: true,
        message: 'Examen de laboratorio analizado y guardado con éxito en la base de datos.',
        data: {
          examId: savedExam.id,
          userId: savedExam.userId,
          fileUrl: savedExam.fileUrl,
          aiResponseId: savedExam.aiResponseId,
          formatDetected: analysisResult.formatDetected,
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
      const userId = req.user.id;
      const userProfile = (await UserModel.findById(userId)) || { name: req.user.name };
      const userBiomarkers = await MedicalVaultModel.getBiomarkers(userId);

      if (!userBiomarkers || userBiomarkers.length === 0) {
        return res.json({
          success: true,
          data: null,
        });
      }

      const analysis = MedicalService.analyzeBiomarkers(userBiomarkers, userProfile);

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
      const userId = req.user.id;
      const biomarkers = await MedicalVaultModel.getBiomarkers(userId);

      res.json({
        success: true,
        count: (biomarkers || []).length,
        data: biomarkers || [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBiomarkers(req, res, next) {
    try {
      const userId = req.user.id;
      const userProfile = (await UserModel.findById(userId)) || { name: req.user.name };
      const { biomarkers } = req.body;

      if (!Array.isArray(biomarkers)) {
        return res.status(400).json({ success: false, error: 'Biomarcadores deben enviarse en formato arreglo.' });
      }

      const saved = await MedicalVaultModel.saveBiomarkers(userId, biomarkers);
      const analysis = MedicalService.analyzeBiomarkers(biomarkers, userProfile);

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
