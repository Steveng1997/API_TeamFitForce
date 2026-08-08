const SmoothieModel = require('../models/Smoothie');
const MedicalVaultModel = require('../models/MedicalVault');

class SmoothieController {
  static async getSmoothies(req, res, next) {
    try {
      const userId = req.user?.id;
      let list = await SmoothieModel.findAll();
      const latestExam = userId ? await MedicalVaultModel.getLatestExam(userId) : null;
      const medAnalysis = latestExam?.analysisResult;

      // Si el usuario tiene exámenes médicos registrados en la Bóveda Médica, generar batidos funcionales 100% adaptados por IA
      if (medAnalysis) {
        const recFoods = medAnalysis.recommendedFoods || [];
        const topBiomarker = medAnalysis.biomarkers?.[0] || { name: 'Metabolismo', value: 'Óptimo' };

        const aiSmoothie1 = {
          id: 'ai_smoothie_1',
          title: `Batido Depurativo Prescrito: Modulador de ${topBiomarker.name}`,
          type: 'verde',
          phase: `PRESCRIPCIÓN IA - SCORE BIOQUÍMICO: ${medAnalysis.biochemScore || 85}/100`,
          consumptionTiming: 'Toma matutina en ayunas',
          ingredients: [
            recFoods[0] ? `1 porción de ${recFoods[0]}` : '1 taza de espinacas frescas',
            recFoods[1] ? `1 porción de ${recFoods[1]}` : '1/2 manzana verde',
            recFoods[2] ? `1 porción de ${recFoods[2]}` : '1 trozo de jengibre fresco (1cm)',
            '1/2 pepino con piel',
            '250ml de agua de coco o agua purificada',
            'Jugo de 1/2 limón',
          ],
          benefits: [
            `Modulación directa de ${topBiomarker.name} (Registrado en ${topBiomarker.value} ${topBiomarker.unit || ''})`,
            `Basado en prescripción clínica: ${medAnalysis.summary || 'Optimización nutricional personalizada'}`,
            'Aporte biodisponible de antioxidantes y micronutrientes depurativos',
          ],
          isConsumed: false,
        };

        const aiSmoothie2 = {
          id: 'ai_smoothie_2',
          title: 'Batido Proteico Antiinflamatorio & Recuperación Celular',
          type: 'antiinflamatorio',
          phase: 'PRESCRIPCIÓN IA - RECUPERACIÓN POS-ESFUERZO',
          consumptionTiming: 'Post-entrenamiento (primeros 30 min)',
          ingredients: [
            '1 scoop de proteína aislada biodisponible',
            recFoods[3] ? `1 porción de ${recFoods[3]}` : '1/2 taza de frutos rojos congelados',
            '1/2 cucharadita de cúrcuma pura con pizca de pimienta negra',
            '1 cucharada de semillas de chía o linaza',
            '300ml de leche de almendras sin azúcar',
          ],
          benefits: [
            'Modulación inmunológica y reducción de inflamación tisular',
            'Síntesis proteica muscular alineada a la Bóveda Médica',
            'Recuperación glucémica balanceada pos-entrenamiento',
          ],
          isConsumed: false,
        };

        list = [aiSmoothie1, aiSmoothie2, ...(list || [])];
      } else if (!list || list.length === 0) {
        list = [
          {
            id: 'sm1',
            title: 'Verde Metabólico & Depurativo Base',
            type: 'verde',
            phase: 'FASE INICIAL - ADJUNTAR EXAMEN EN BÓVEDA MÉDICA',
            consumptionTiming: 'Toma matutina en ayunas',
            ingredients: [
              '1 taza de espinacas frescas',
              '1/2 manzana verde',
              '1 trozo de jengibre fresco',
              '250ml agua purificada',
            ],
            benefits: [
              'Vincula tu examen en Bóveda Médica para adaptar tus batidos funcionales 100% por IA',
            ],
            isConsumed: false,
          },
        ];
      }

      res.json({
        success: true,
        phase: medAnalysis ? `PRESCRIPCIÓN IA (SCORE ${medAnalysis.biochemScore}/100)` : 'FASE INICIAL',
        count: list.length,
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleConsume(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await SmoothieModel.toggleConsume(id);

      res.json({
        success: true,
        message: 'Estado de consumo del batido actualizado',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createSmoothie(req, res, next) {
    try {
      const newSmoothie = await SmoothieModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Batido funcional creado correctamente',
        data: newSmoothie,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SmoothieController;
