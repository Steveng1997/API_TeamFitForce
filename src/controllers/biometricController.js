const BiometricModel = require('../models/Biometric');

class BiometricController {
  static async getTodayBiometrics(req, res, next) {
    try {
      const userId = req.user.id;
      let biometrics = await BiometricModel.findLatestByUserId(userId);

      if (!biometrics) {
        biometrics = {
          userId,
          date: new Date().toISOString().split('T')[0],
          steps: 0,
          stepsGoal: 10000,
          stepsPercentage: 0,
          activeCalories: 0,
          caloriesGoal: 700,
          streakDays: 1,
          restingHeartRate: 65,
          biochemScore: 85,
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
      const userId = req.user.id;
      const { steps, activeCalories, restingHeartRate } = req.body;

      const updated = await BiometricModel.updateLatest(userId, {
        steps: Number(steps || 0),
        activeCalories: Number(activeCalories || 0),
        restingHeartRate: Number(restingHeartRate || 65),
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
