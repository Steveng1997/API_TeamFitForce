const NutritionModel = require('../models/Nutrition');
const NutritionService = require('../services/nutritionService');

class NutritionController {
  static async getSummary(req, res, next) {
    try {
      const userId = req.user.id;
      let summary = await NutritionModel.getSummaryByUserId(userId);

      if (!summary) {
        summary = {
          userId,
          date: new Date().toISOString().split('T')[0],
          caloriesConsumed: 0,
          caloriesTarget: 2400,
          caloriesRemaining: 2400,
          caloriesBurned: 0,
          macros: {
            protein: { current: 0, target: 160, unit: 'g' },
            carbs: { current: 0, target: 220, unit: 'g' },
            fats: { current: 0, target: 65, unit: 'g' },
          },
        };
      }

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logMeal(req, res, next) {
    try {
      const userId = req.user.id;
      const { mealName, calories, protein, carbs, fat } = req.body;

      let currentSummary = await NutritionModel.getSummaryByUserId(userId);
      if (!currentSummary) {
        currentSummary = {
          userId,
          caloriesConsumed: 0,
          caloriesTarget: 2400,
          caloriesRemaining: 2400,
          caloriesBurned: 0,
          macros: {
            protein: { current: 0, target: 160, unit: 'g' },
            carbs: { current: 0, target: 220, unit: 'g' },
            fats: { current: 0, target: 65, unit: 'g' },
          },
        };
      }

      const newConsumed = (currentSummary.caloriesConsumed || 0) + Number(calories || 0);
      const newRemaining = Math.max(0, currentSummary.caloriesTarget - newConsumed);

      const updatedMacros = NutritionService.calculateMacros(currentSummary.macros, {
        protein: Number(protein || 0),
        carbs: Number(carbs || 0),
        fat: Number(fat || 0),
      });

      const updated = await NutritionModel.updateSummary(userId, {
        caloriesConsumed: newConsumed,
        caloriesRemaining: newRemaining,
        macros: updatedMacros,
      });

      res.json({
        success: true,
        message: `Comida '${mealName || 'Alimento'}' registrada exitosamente`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRecipes(req, res, next) {
    try {
      const { category } = req.query;
      let recipes = await NutritionModel.getAllRecipes();
      if (!recipes || recipes.length === 0) {
        recipes = [];
      }
      res.json({
        success: true,
        count: recipes.length,
        data: recipes,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRecipeById(req, res, next) {
    try {
      const { id } = req.params;
      let recipe = await NutritionModel.getRecipeById(id);
      if (!recipe) {
        recipe = NutritionService.getRecipeById(id);
      }

      if (!recipe) {
        return res.status(404).json({ success: false, error: 'Receta no encontrada.' });
      }

      res.json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NutritionController;
