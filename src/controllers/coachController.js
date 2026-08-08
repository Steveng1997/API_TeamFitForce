const CoachModel = require('../models/Coach');
const CoachService = require('../services/coachService');
const UserModel = require('../models/User');
const BiometricModel = require('../models/Biometric');
const MedicalVaultModel = require('../models/MedicalVault');

class CoachController {
  static async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      let history = await CoachModel.getHistory(userId);

      if (!history || history.length === 0) {
        const latestExam = await MedicalVaultModel.getLatestExam(userId);
        const medAnalysis = latestExam?.analysisResult;
        const initialText = medAnalysis?.summary
          ? `¡Hola ${req.user.name || 'Atleta'}! He revisado tu Bóveda Médica. ${medAnalysis.summary} Estoy listo para guiar tu entrenamiento y nutrición.`
          : `¡Hola ${req.user.name || 'Atleta'}! Estoy listo para guiar tu entrenamiento y nutrición adaptativa de hoy.`;

        history = [
          {
            sender: 'coach',
            content: initialText,
            timestamp: new Date().toISOString(),
          },
        ];
      }

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }

  static async chat(req, res, next) {
    try {
      const userId = req.user.id;
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, error: 'El mensaje enviado es inválido.' });
      }

      await CoachModel.addMessage(userId, 'user', message.trim());

      const userProfile = (await UserModel.findById(userId)) || { name: req.user.name };
      const biometrics = (await BiometricModel.findLatestByUserId(userId)) || {};
      const latestExam = await MedicalVaultModel.getLatestExam(userId);
      const medicalAnalysis = latestExam?.analysisResult || null;

      const response = await CoachService.generateResponse(message, userProfile, biometrics, medicalAnalysis);
      await CoachModel.addMessage(userId, 'coach', response.message);

      res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async motivate(req, res, next) {
    try {
      const userId = req.user.id;
      const userProfile = (await UserModel.findById(userId)) || { name: req.user.name };
      const biometrics = (await BiometricModel.findLatestByUserId(userId)) || {};
      const latestExam = await MedicalVaultModel.getLatestExam(userId);
      const medicalAnalysis = latestExam?.analysisResult || null;

      const response = await CoachService.generateResponse('Dame un consejo y motivación de voz hoy basado en mis exámenes médicos', userProfile, biometrics, medicalAnalysis);

      res.json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CoachController;
