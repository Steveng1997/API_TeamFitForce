const seedUsers = [
  {
    id: 'usr_default_123',
    name: 'Carlos',
    username: 'carlos123',
    email: 'carlos@teamfit.com',
    password: 'password123',
    age: '32',
    weight: '82',
    size: 'M',
    height: '178',
    goal: 'Tonificar y ganar masa muscular',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const seedBiometrics = [
  {
    id: 'bio_today',
    userId: 'usr_default_123',
    date: new Date().toISOString().split('T')[0],
    steps: 7420,
    stepsGoal: 10000,
    stepsPercentage: 74,
    activeCalories: 485,
    caloriesGoal: 700,
    streakDays: 14,
    restingHeartRate: 62,
    biochemScore: 88,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const seedNutrition = [
  {
    id: 'nutr_today',
    userId: 'usr_default_123',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const seedRecipes = [
  {
    id: 'rec1',
    title: 'Bowl Proteico de Salmón & Quinoa',
    prepTime: '20 min',
    calories: 580,
    protein: 42,
    carbs: 48,
    fats: 18,
    ragBadge: 'Sugerido RAG Bóveda Médica',
    category: 'almuerzo',
    ingredients: [
      '150g Salmón fresco',
      '100g Quinoa cocida',
      '1/2 Aguacate en rebanadas',
      'Espinaca baby fresca',
      'Aceite de oliva virgen extra',
    ],
  },
  {
    id: 'rec2',
    title: 'Omelette de Claras con Vegetales',
    prepTime: '12 min',
    calories: 320,
    protein: 34,
    carbs: 12,
    fats: 8,
    ragBadge: 'Sugerido RAG Metabólico',
    category: 'desayuno',
    ingredients: [
      '4 Claras de huevo',
      '50g Champiñones fileteados',
      'Pimiento verde y rojo picado',
      'Queso cottage descremado',
    ],
  },
];

const seedSmoothies = [
  {
    id: 'sm1',
    title: 'Verde Metabólico & Depurativo',
    type: 'verde',
    phase: 'FASE ACTIVA: OPTIMIZACIÓN DEL PROGRESO',
    consumptionTiming: 'Toma matutina en ayunas',
    ingredients: [
      'Espinaca fresca, manzana verde, pepino, jengibre orgánico, espirulina en polvo y jugo de limón recién exprimido.',
    ],
    benefits: [
      'Altas concentraciones de glucosinolatos e isotiocianatos que estimulan las enzimas de desintoxicación de Fase II en el hígado.',
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
      'Cúrcuma en raíz, piña natural, semillas de chía activadas, leche de almendras sin azúcar y una pizca de pimienta negra.',
    ],
    benefits: [
      'La curcumina potenciada por piperina reduce los marcadores inflamatorios IL-6 y TNF-alfa post-ejercicio acelerando la reparación miocelular.',
    ],
    isConsumed: true,
  },
];

const seedRoutines = [
  {
    id: 'rout1',
    title: 'Rutina Full Body',
    phase: 'DÍA 14 / 360 | Fase 1: Condicionamiento Metabólico',
    day: 14,
    durationSeconds: 900,
    durationFormatted: '15:00',
    progressSeconds: 315,
    progressFormatted: '05:15',
    heartRateBpm: 128,
    targetZone: 'Zona 2 Cardio (Optimizada Bóveda Médica)',
    burnedCalories: 185,
    videoUrl: 'https://storage.googleapis.com/teamfit-media/routine-fullbody-demo.mp4',
    exercises: [
      { id: 'ex1', name: 'Sentadilla Goblet con Mancuerna', sets: 3, reps: '12', restSeconds: 60 },
      { id: 'ex2', name: 'Flexiones de Pecho Estrictas', sets: 4, reps: '10', restSeconds: 60 },
      { id: 'ex3', name: 'Remo con Mancuerna Unilateral', sets: 3, reps: '12 por lado', restSeconds: 45 },
    ],
  },
];

const seedBiomarkers = [
  {
    id: 'bm_glucose',
    userId: 'usr_default_123',
    name: 'Glucosa en Ayunas',
    value: '108',
    unit: 'mg/dL',
    referenceRange: '70 - 99 mg/dL',
    status: 'high',
    statusLabel: 'Ligeramente Elevado',
    category: 'Metabólico / Pancreático',
  },
  {
    id: 'bm_cortisol',
    userId: 'usr_default_123',
    name: 'Cortisol Sérico Matutino',
    value: '21.4',
    unit: 'µg/dL',
    referenceRange: '5.0 - 18.0 µg/dL',
    status: 'high',
    statusLabel: 'Estrés Bioquímico Alto',
    category: 'Hormonal / Adrenal',
  },
  {
    id: 'bm_vit_d',
    userId: 'usr_default_123',
    name: 'Vitamina D (25-OH)',
    value: '22',
    unit: 'ng/mL',
    referenceRange: '30 - 100 ng/mL',
    status: 'low',
    statusLabel: 'Insuficiencia Moderada',
    category: 'Endocrino / Óseo',
  },
  {
    id: 'bm_cholesterol',
    userId: 'usr_default_123',
    name: 'Colesterol Total',
    value: '192',
    unit: 'mg/dL',
    referenceRange: '< 200 mg/dL',
    status: 'optimal',
    statusLabel: 'En Rango Óptimo',
    category: 'Perfil Lipídico',
  },
  {
    id: 'bm_triglycerides',
    userId: 'usr_default_123',
    name: 'Triglicéridos en Ayunas',
    value: '145',
    unit: 'mg/dL',
    referenceRange: '< 150 mg/dL',
    status: 'stable',
    statusLabel: 'Normal Aceptable',
    category: 'Perfil Lipídico',
  },
  {
    id: 'bm_hba1c',
    userId: 'usr_default_123',
    name: 'Hemoglobina Glicosilada (HbA1c)',
    value: '5.6',
    unit: '%',
    referenceRange: '< 5.7 %',
    status: 'stable',
    statusLabel: 'Rango Saludable',
    category: 'Metabólico',
  },
];

const seedCoachMessages = [
  {
    id: 'msg1',
    userId: 'usr_default_123',
    sender: 'coach',
    content: '¡Vamos Carlos! Veo que tu ritmo bajó. Aprieta el paso, faltan solo 3 minutos.',
    timestamp: new Date().toISOString(),
  },
];

module.exports = {
  seedUsers,
  seedBiometrics,
  seedNutrition,
  seedRecipes,
  seedSmoothies,
  seedRoutines,
  seedBiomarkers,
  seedCoachMessages,
};
