const MedicalVaultModel = require('../models/MedicalVault');
const MedicalService = require('../services/medicalService');
const UserModel = require('../models/User');

class MedicalVaultController {
  /**
   * Al subir un examen de laboratorio (PDF/Imagen), la IA analiza el archivo,
   * extrae los biomarcadores clave y REGISTRA EN LA BASE DE DATOS el objeto de análisis
   * completo con recommendedFoods, restrictedFoods, exerciseAdjustments y biochemScore.
   */
  static async uploadExam(req, res, next) {
    try {
      const userId = req.user.id;
      const files = req.files && req.files.length > 0 ? req.files : (req.file ? [req.file] : []);

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No se subió ningún archivo. Selecciona uno o más archivos PDF, PNG, JPG o JPEG válidos.',
        });
      }

      const userProfile = (await UserModel.findById(userId)) || { name: req.user.name };
      const savedExams = [];
      let latestAnalysisResult = null;

      // Analizar cada archivo uno por uno e insertarlo INDEPENDIENTEMENTE en la Base de Datos
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const fileMeta = {
          fileName: file.filename,
          originalName: file.originalname,
          fileSize: file.size,
          fileType: file.mimetype,
          fileUrl: `/uploads/${file.filename}`,
          documentIndex: i + 1,
          totalDocuments: files.length,
        };

        const aiResponseId = `ai_resp_${Date.now()}_${i}_${Math.round(Math.random() * 10000)}`;

        // Análisis IA independiente por cada documento/imagen
        const analysisResult = await MedicalService.processExamFile(file, userProfile);
        latestAnalysisResult = analysisResult;

        // INSERCIÓN INDEPENDIENTE EN BASE DE DATOS PARA ESTE EXAMEN
        const savedExam = await MedicalVaultModel.saveExam(userId, fileMeta, analysisResult, aiResponseId);

        // INSERCIÓN INDEPENDIENTE DE BIOMARCADORES DE ESTE EXAMEN EN LA BASE DE DATOS
        if (analysisResult.biomarkers && analysisResult.biomarkers.length > 0) {
          await MedicalVaultModel.saveBiomarkers(userId, analysisResult.biomarkers);
        }

        savedExams.push(savedExam);
      }

      const primaryExam = savedExams[savedExams.length - 1];

      res.status(201).json({
        success: true,
        message: `${savedExams.length} examen(es) médico(s) analizado(s) por la IA e insertado(s) independientemente en la base de datos.`,
        data: {
          examId: primaryExam.id,
          userId: primaryExam.userId,
          fileUrl: primaryExam.fileUrl,
          aiResponseId: primaryExam.aiResponseId,
          totalExamsSaved: savedExams.length,
          exams: savedExams,
          analysis: latestAnalysisResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene los resultados de la IA guardados en la BD para el usuario actual.
   * Trae directamente recommendedFoods, restrictedFoods y prescripción guardada en la BD.
   */
  static async getAnalysisResults(req, res, next) {
    try {
      const userId = req.user.id;
      const latestExam = await MedicalVaultModel.getLatestExam(userId);

      // Si no existe ningún examen registrado en la base de datos para este usuario
      if (!latestExam || !latestExam.analysisResult) {
        return res.json({
          success: true,
          data: null, // Sin datos inventados ni quemados
        });
      }

      // Retornar 100% de la BD los alimentos recomendados, restringidos y análisis registrado
      res.json({
        success: true,
        data: latestExam.analysisResult,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene los biomarcadores registrados en la BD para el usuario actual.
   */
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

      // Guardar actualización de análisis en el examen médico de la BD
      await MedicalVaultModel.saveExam(userId, { fileUrl: '/manual_update', fileName: 'Actualización Manual' }, analysis, `ai_resp_${Date.now()}`);

      res.json({
        success: true,
        message: 'Biomarcadores y prescripción en BD reevaluados por la IA',
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
