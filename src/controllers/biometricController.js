const BiometricModel = require('../models/Biometric');

class BiometricController {
  static async getTodayBiometrics(req, res, next) {
    try {
      const userId = req.user.id;
      let biometrics = await BiometricModel.findLatestByUserId(userId);

      if (!biometrics) {
        biometrics = await BiometricModel.create({
          userId,
          date: new Date().toISOString().split('T')[0],
          steps: 0,
          stepsGoal: 10000,
          stepsPercentage: 0,
          activeCalories: 0,
          caloriesGoal: 700,
          streakDays: 0,
          restingHeartRate: 65,
          biochemScore: 0,
        });
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
      const { steps, activeCalories, restingHeartRate, streakDays } = req.body;

      const numSteps = Number(steps || 0);
      const stepsGoal = 10000;
      const stepsPercentage = Math.min(100, Math.round((numSteps / stepsGoal) * 100));
      const calcCalories = typeof activeCalories === 'number' ? activeCalories : Math.round(numSteps * 0.04);

      const updatePayload = {
        steps: numSteps,
        stepsPercentage,
        activeCalories: calcCalories,
        restingHeartRate: Number(restingHeartRate || 65),
      };

      if (typeof streakDays === 'number') {
        updatePayload.streakDays = streakDays;
      }

      const updated = await BiometricModel.updateLatest(userId, updatePayload);

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
