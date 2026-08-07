const RoutineModel = require('../models/Routine');

const DEFAULT_MUSIC_PLAYLISTS = {
  Spotify: [
    { id: 'sp1', title: 'Stronger', artist: 'Kanye West', duration: '05:12', durationSec: 312 },
    { id: 'sp2', title: "Can't Hold Us", artist: 'Macklemore & Ryan Lewis', duration: '04:18', durationSec: 258 },
    { id: 'sp3', title: "'Till I Collapse", artist: 'Eminem', duration: '04:57', durationSec: 297 },
  ],
  'YouTube Music': [
    { id: 'yt1', title: 'Levitating', artist: 'Dua Lipa ft. DaBaby', duration: '03:23', durationSec: 203 },
    { id: 'yt2', title: 'Eye of the Tiger', artist: 'Survivor', duration: '04:05', durationSec: 245 },
    { id: 'yt3', title: 'Believer', artist: 'Imagine Dragons', duration: '03:24', durationSec: 204 },
  ],
  'Apple Music': [
    { id: 'am1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '03:20', durationSec: 200 },
    { id: 'am2', title: 'POWER', artist: 'Kanye West', duration: '04:52', durationSec: 292 },
    { id: 'am3', title: 'Remember the Name', artist: 'Fort Minor', duration: '03:50', durationSec: 230 },
  ],
};

class RoutineController {
  static async getRoutines(req, res, next) {
    try {
      let routines = await RoutineModel.findAll();
      if (!routines || routines.length === 0) {
        routines = [
          {
            id: 'rout1',
            title: 'Rutina Full Body',
            phase: 'DÍA 14 / 360 | Fase 1: Condicionamiento Metabólico',
            day: 14,
            durationSeconds: 900,
            durationFormatted: '15:00',
            progressSeconds: 315,
            progressFormatted: '05:15',
            heartRateBpm: 128,
            targetZone: 'Zona 2 Cardio (Optimizada Bóveda Médica)',
            burnedCalories: 185,
            videoUrl: 'https://storage.googleapis.com/teamfit-media/routine-fullbody-demo.mp4',
            exercises: [
              { id: 'ex1', name: 'Sentadilla Goblet', sets: 4, reps: '12 - 15', restSeconds: 60 },
              { id: 'ex2', name: 'Flexiones de Pecho Estrictas', sets: 4, reps: '10 - 12', restSeconds: 60 },
              { id: 'ex3', name: 'Remo con Mancuerna Unilateral', sets: 3, reps: '12 por lado', restSeconds: 45 },
              { id: 'ex4', name: 'Plancha Abdominal Dinámica', sets: 3, reps: '45 segundos', restSeconds: 30 },
            ],
          },
        ];
      }

      res.json({
        success: true,
        data: routines,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRoutineById(req, res, next) {
    try {
      const { id } = req.params;
      let routine = await RoutineModel.findById(id);
      if (!routine) {
        const all = await RoutineModel.findAll();
        routine = all[0] || null;
      }

      if (!routine) {
        return res.status(404).json({ success: false, error: 'Rutina no encontrada.' });
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

      const updated = await RoutineModel.updateProgress(id, Number(progressSeconds || 0));

      res.json({
        success: true,
        message: 'Progreso de rutina guardado correctamente',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPlaylists(req, res, next) {
    try {
      const { platform } = req.query;
      let result = DEFAULT_MUSIC_PLAYLISTS;
      if (platform && DEFAULT_MUSIC_PLAYLISTS[platform]) {
        result = { [platform]: DEFAULT_MUSIC_PLAYLISTS[platform] };
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoutineController;
