const NutritionModel = require('../models/Nutrition');
const NutritionService = require('../services/nutritionService');
const UserModel = require('../models/User');
const BiometricModel = require('../models/Biometric');
const MedicalVaultModel = require('../models/MedicalVault');

class NutritionController {
  static async getSummary(req, res, next) {
    try {
      const userId = req.user.id;
      const user = (await UserModel.findById(userId)) || {};
      const biometrics = (await BiometricModel.findLatestByUserId(userId)) || {};
      const latestExam = await MedicalVaultModel.getLatestExam(userId);
      const medAnalysis = latestExam?.analysisResult;

      const weight = parseFloat(user.weight || user.peso || '70') || 70;
      const height = parseFloat(user.height || user.talla || user.estatura || '170') || 170;
      const age = parseFloat(user.age || user.edad || '28') || 28;
      const goal = (user.goal || user.objetivo || '').toLowerCase();

      // Cálculo de TDEE y Calórica Meta 100% Dinámica (Ecuación Harris-Benedict / Mifflin-St Jeor)
      const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      let targetCalories = Math.round(bmr * 1.4);

      if (goal.includes('perder') || goal.includes('bajar') || goal.includes('deficit')) {
        targetCalories = Math.round(bmr * 1.3 - 350);
      } else if (goal.includes('ganar') || goal.includes('musculo') || goal.includes('volumen')) {
        targetCalories = Math.round(bmr * 1.5 + 300);
      }

      // Ajuste por Score Bioquímico de Bóveda Médica
      if (medAnalysis && medAnalysis.biochemScore && medAnalysis.biochemScore < 75) {
        targetCalories = Math.round(targetCalories * 0.95);
      }

      const steps = biometrics.steps || 0;
      const caloriesBurned = biometrics.activeCalories || Math.round(steps * 0.04);

      // Metas de Macronutrientes Dinámicas
      const proteinTarget = Math.round(weight * 2.0); // 2.0g de proteína por kg
      const fatsTarget = Math.round((targetCalories * 0.28) / 9); // 28% grasas saludables
      const carbsTarget = Math.round((targetCalories - (proteinTarget * 4 + fatsTarget * 9)) / 4);

      let summary = await NutritionModel.getSummaryByUserId(userId);
      const consumed = summary?.caloriesConsumed || 0;
      const remaining = Math.max(0, targetCalories - consumed + caloriesBurned);

      const currentProtein = summary?.macros?.protein?.current || 0;
      const currentCarbs = summary?.macros?.carbs?.current || 0;
      const currentFats = summary?.macros?.fats?.current || 0;

      const dynamicSummary = {
        userId,
        date: new Date().toISOString().split('T')[0],
        caloriesConsumed: consumed,
        caloriesTarget: targetCalories,
        caloriesRemaining: remaining,
        caloriesBurned: caloriesBurned,
        macros: {
          protein: { current: currentProtein, target: proteinTarget, unit: 'g' },
          carbs: { current: currentCarbs, target: carbsTarget, unit: 'g' },
          fats: { current: currentFats, target: fatsTarget, unit: 'g' },
        },
      };

      res.json({
        success: true,
        data: dynamicSummary,
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
