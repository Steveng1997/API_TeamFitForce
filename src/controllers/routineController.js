const RoutineModel = require('../models/Routine');
const MedicalVaultModel = require('../models/MedicalVault');

class RoutineController {
  static async getRoutines(req, res, next) {
    try {
      const userId = req.user?.id;
      let routines = await RoutineModel.getAll();

      if (userId) {
        const latestExam = await MedicalVaultModel.getLatestExam(userId);
        if (latestExam && latestExam.analysisResult && latestExam.analysisResult.workoutRoutine) {
          const aiRoutine = latestExam.analysisResult.workoutRoutine;
          // Merge AI routine into head of routines
          const mergedRoutine = {
            id: 'ai_routine_latest',
            title: aiRoutine.title || 'Rutina Adaptativa IA',
            phase: aiRoutine.phase || 'Prescripción Fisiológica',
            targetZone: aiRoutine.targetZone || 'Zona Cardio Regulada',
            weeklyFrequency: aiRoutine.weeklyFrequency || '4 Días',
            safetyNotes: aiRoutine.safetyNotes || '',
            exercises: aiRoutine.exercises || [],
            progressSeconds: 0,
          };
          routines = [mergedRoutine, ...(routines || [])];
        }
      }

      res.json({
        success: true,
        count: (routines || []).length,
        data: routines || [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRoutineById(req, res, next) {
    try {
      const { id } = req.params;
      const routine = await RoutineModel.findById(id);

      if (!routine) {
        return res.status(404).json({
          success: false,
          error: 'Sin rutina prescrita para este identificador.',
        });
      }

      res.json({
        success: true,
        data: routine,
      });
    } catch (error) {
      next(error);
    }
  }

  static async saveProgress(req, res, next) {
    try {
      const { id } = req.params;
      const { progressSeconds } = req.body;

      const updated = await RoutineModel.updateProgress(id, progressSeconds);

      res.json({
        success: true,
        message: 'Progreso de rutina guardado con éxito',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProgress(req, res, next) {
    return RoutineController.saveProgress(req, res, next);
  }

  static async getPlaylists(req, res, next) {
    try {
      res.json({
        success: true,
        data: [
          { id: 'pl1', platform: 'Spotify', name: 'Workout Power Mix' },
          { id: 'pl2', platform: 'YouTube Music', name: 'Cardio Focus 128 BPM' },
          { id: 'pl3', platform: 'Apple Music', name: 'High Energy Fitness' },
        ],
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoutineController;
