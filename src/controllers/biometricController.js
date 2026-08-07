const BiometricModel = require('../models/Biometric');

class BiometricController {
  static async getTodayBiometrics(req, res, next) {
    try {
      const userId = req.user?.id || 'usr_default_123';
      let biometrics = await BiometricModel.findLatestByUserId(userId);

      if (!biometrics) {
        biometrics = {
          userId,
          date: new Date().toISOString().split('T')[0],
          steps: 8450,
          stepsGoal: 10000,
          stepsPercentage: 84,
          activeCalories: 520,
          caloriesGoal: 700,
          streakDays: 12,
          restingHeartRate: 62,
          biochemScore: 92,
        };
      }

      res.json({
        success: true,
        data: biometrics,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logBiometrics(req, res, next) {
    try {
      const userId = req.user?.id || 'usr_default_123';
      const { steps, activeCalories, restingHeartRate } = req.body;

      const updated = await BiometricModel.updateLatest(userId, {
        steps,
        activeCalories,
        restingHeartRate,
      });

      res.json({
        success: true,
        message: 'Métricas de salud registradas con éxito',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BiometricController;
