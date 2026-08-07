/**
 * Motor de Nutrición Food Fit 360° y Recomendaciones RAG (Retrieval-Augmented Generation)
 */

const DEFAULT_RECIPES = [
  {
    id: 'rec1',
    title: 'Bowl Proteico de Salmón & Quinoa',
    category: 'Almuerzo / Cena',
    prepTime: '20 min',
    calories: 580,
    protein: 42,
    carbs: 45,
    fat: 18,
    ragBadge: 'Sugerido RAG Bóveda Médica',
    ragReason: 'Optimizado para reducir la PCR Ultrasensible por alto contenido en Omega-3.',
    ingredients: [
      '180g de filete de salmón fresco',
      '1/2 taza de quinoa cocida',
      '1/2 aguacate en rodajas',
      '1 taza de espinacas baby',
      '1 cucharada de semillas de sésamo',
      'Aderezo de aceite de oliva extra virgen y limón',
    ],
    preparationSteps: [
      'Sazonar el salmón con sal marina, pimienta y limón.',
      'Sellar en la sartén a fuego medio durante 4 minutos por lado.',
      'Colocar las espinacas y quinoa en la base del bowl.',
      'Añadir el salmón, el aguacate y espolvorear las semillas de sésamo.',
      'Rociar con aceite de oliva extra virgen.',
    ],
  },
  {
    id: 'rec2',
    title: 'Omelette Antiinflamatorio de Claras y Cúrcuma',
    category: 'Desayuno',
    prepTime: '12 min',
    calories: 340,
    protein: 35,
    carbs: 12,
    fat: 14,
    ragBadge: 'Sugerido RAG Nutricional',
    ragReason: 'La cúrcuma y la espinaca modulan la respuesta del Cortisol matutino.',
    ingredients: [
      '4 claras de huevo + 1 huevo entero',
      '1/2 taza de champiñones laminados',
      '1/2 cucharadita de cúrcuma en polvo',
      'Pizca de pimienta negra (activa la curcumina)',
      '1/4 de taza de queso feta bajo en grasa',
    ],
    preparationSteps: [
      'Batir los huevos con la cúrcuma y pimienta negra.',
      'Saltear los champiñones en una sartén antiadherente.',
      'Verter la mezcla de huevo y cocinar a fuego bajo.',
      'Agregar el queso feta y doblar a la mitad.',
    ],
  },
];

class NutritionService {
  static getRecipes(filterCategory = null) {
    if (!filterCategory) return DEFAULT_RECIPES;
    return DEFAULT_RECIPES.filter(
      (r) => r.category.toLowerCase() === filterCategory.toLowerCase()
    );
  }

  static getRecipeById(id) {
    return DEFAULT_RECIPES.find((r) => r.id === id) || null;
  }

  static calculateMacros(currentMacros, addedMeal) {
    return {
      protein: {
        current: currentMacros.protein.current + (addedMeal.protein || 0),
        target: currentMacros.protein.target,
        unit: 'g',
      },
      carbs: {
        current: currentMacros.carbs.current + (addedMeal.carbs || 0),
        target: currentMacros.carbs.target,
        unit: 'g',
      },
      fats: {
        current: currentMacros.fats.current + (addedMeal.fat || 0),
        target: currentMacros.fats.target,
        unit: 'g',
      },
    };
  }
}

module.exports = NutritionService;
