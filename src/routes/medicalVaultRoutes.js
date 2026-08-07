const express = require('express');
const MedicalVaultController = require('../controllers/medicalVaultController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('examFile'), MedicalVaultController.uploadExam);
router.get('/results', authMiddleware, MedicalVaultController.getAnalysisResults);
router.get('/biomarkers', authMiddleware, MedicalVaultController.getBiomarkers);
router.post('/biomarkers', authMiddleware, MedicalVaultController.updateBiomarkers);

module.exports = router;
