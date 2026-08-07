const express = require('express');
const RoutineController = require('../controllers/routineController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, RoutineController.getRoutines);
router.get('/playlists', authMiddleware, RoutineController.getPlaylists);
router.get('/:id', authMiddleware, RoutineController.getRoutineById);
router.post('/:id/progress', authMiddleware, RoutineController.saveProgress);

module.exports = router;
