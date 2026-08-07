const { getCollection } = require('../config/db');

const nutritionCollection = getCollection('nutrition');
const recipeCollection = getCollection('recipes');

class NutritionModel {
  static async getSummaryByUserId(userId) {
    const summary = await nutritionCollection.findOne({ userId });
    if (summary) return summary;

    // Default summary matching Food Fit 360° screen
    return {
      userId,
      date: new Date().toISOString().split('T')[0],
      caloriesConsumed: 1650,
      caloriesTarget: 2400,
      caloriesRemaining: 750,
      caloriesBurned: 520,
      macros: {
        protein: { current: 145, target: 180, unit: 'g' },
        carbs: { current: 185, target: 220, unit: 'g' },
        fats: { current: 48, target: 65, unit: 'g' },
      },
    };
  }

  static async updateSummary(userId, updateData) {
    const existing = await nutritionCollection.findOne({ userId });
    if (existing) {
      return await nutritionCollection.updateById(existing.id, updateData);
    }
    return await nutritionCollection.insert({ userId, ...updateData });
  }

  static async getAllRecipes() {
    return await recipeCollection.find();
  }

  static async getRecipeById(id) {
    return await recipeCollection.findById(id);
  }

  static async createRecipe(recipeData) {
    return await recipeCollection.insert(recipeData);
  }
}

module.exports = NutritionModel;
