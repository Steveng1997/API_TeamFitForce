const SmoothieModel = require('../models/Smoothie');

class SmoothieController {
  static async getSmoothies(req, res, next) {
    try {
      let list = await SmoothieModel.findAll();
      if (!list || list.length === 0) {
        list = [
          {
            id: 'sm1',
            title: 'Verde Metabólico & Depurativo',
            type: 'verde',
            phase: 'FASE ACTIVA: OPTIMIZACIÓN DEL PROGRESO',
            consumptionTiming: 'Toma matutina en ayunas',
            ingredients: [
              '1 taza de espinacas frescas',
              '1/2 manzana verde',
              '1 trozo de jengibre fresco (1cm)',
              '1/2 pepino con piel',
              '1 vaso de agua de coco (250ml)',
              'Jugo de 1/2 limón',
            ],
            benefits: [
              'Depuración hepática matutina',
              'Modulación de glucosa en sangre',
              'Aporte biodisponible de clorofila y magnesio',
            ],
            isConsumed: true,
          },
          {
            id: 'sm2',
            title: 'Batido Funcional Antiinflamatorio Post-Entreno',
            type: 'antiinflamatorio',
            phase: 'FASE ACTIVA: RECUPERACIÓN BIOQUÍMICA',
            consumptionTiming: 'Post-entrenamiento (primeros 30 min)',
            ingredients: [
              '1 scoop de proteína aislada de suero',
              '1/2 cucharadita de cúrcuma pura',
              '1/4 cucharadita de pimienta negra',
              '1/2 taza de frutos rojos congelados',
              '1 cucharada de semillas de chía',
              '300ml de leche de almendras sin azúcar',
            ],
            benefits: [
              'Descenso acelerado de la PCR Ultrasensible',
              'Síntesis proteica muscular avanzada',
              'Control de inflamación articular pos-esfuerzo',
            ],
            isConsumed: true,
          },
        ];
      }

      res.json({
        success: true,
        phase: 'FASE ACTIVA: OPTIMIZACIÓN DEL PROGRESO',
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
