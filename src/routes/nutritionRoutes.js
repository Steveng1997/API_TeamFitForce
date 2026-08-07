const express = require('express');
const NutritionController = require('../controllers/nutritionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/summary', authMiddleware, NutritionController.getSummary);
router.post('/log-meal', authMiddleware, NutritionController.logMeal);
router.get('/recipes', authMiddleware, NutritionController.getRecipes);
router.get('/recipes/:id', authMiddleware, NutritionController.getRecipeById);

module.exports = router;
