const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'teamfit_force_super_secret_jwt_key_2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // AWS & DynamoDB Configuration
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  
  // DynamoDB Tables
  DYNAMODB_TABLE_USERS: process.env.DYNAMODB_TABLE_USERS || 'TeamFit_Users',
  DYNAMODB_TABLE_BIOMETRICS: process.env.DYNAMODB_TABLE_BIOMETRICS || 'TeamFit_Biometrics',
  DYNAMODB_TABLE_NUTRITION: process.env.DYNAMODB_TABLE_NUTRITION || 'TeamFit_Nutrition',
  DYNAMODB_TABLE_RECIPES: process.env.DYNAMODB_TABLE_RECIPES || 'TeamFit_Recipes',
  DYNAMODB_TABLE_SMOOTHIES: process.env.DYNAMODB_TABLE_SMOOTHIES || 'TeamFit_Smoothies',
  DYNAMODB_TABLE_ROUTINES: process.env.DYNAMODB_TABLE_ROUTINES || 'TeamFit_Routines',
  DYNAMODB_TABLE_BIOMARKERS: process.env.DYNAMODB_TABLE_BIOMARKERS || 'TeamFit_Biomarkers',
  DYNAMODB_TABLE_COACH: process.env.DYNAMODB_TABLE_COACH || 'TeamFit_CoachMessages',

  DB_TYPE: process.env.DB_TYPE || 'dynamodb',
  UPLOAD_PATH: process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads'),
};
