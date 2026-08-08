const RoutineModel = require('../models/Routine');

class RoutineController {
  static async getRoutines(req, res, next) {
    try {
      const routines = await RoutineModel.getAll();
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

  static async updateProgress(req, res, next) {
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
}

module.exports = RoutineController;
