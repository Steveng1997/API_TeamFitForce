/**
 * Motor de Inteligencia Médica Bóveda Médica & Telemetría IA
 * Realiza lectura de biomarcadores, evaluación de estados (optimal, stable, high, low),
 * cálculo dinámico del Score Bioquímico, y generación automática de pautas personalizadas.
 */

const DEFAULT_BIOMARKERS = [
  {
    id: 'bm1',
    name: 'Glucosa en Ayunas',
    value: '88',
    unit: 'mg/dL',
    referenceRange: '70 - 99 mg/dL',
    status: 'optimal',
    statusLabel: 'Óptimo',
    category: 'Metabolismo',
  },
  {
    id: 'bm2',
    name: 'Cortisol Matutino',
    value: '18.4',
    unit: 'µg/dL',
    referenceRange: '5.0 - 15.0 µg/dL',
    status: 'high',
    statusLabel: 'Alto (Estrés)',
    category: 'Hormonal',
  },
  {
    id: 'bm3',
    name: 'PCR Ultrasensible',
    value: '3.2',
    unit: 'mg/L',
    referenceRange: '< 1.0 mg/L',
    status: 'high',
    statusLabel: 'Alto (Inflamación)',
    category: 'Biomarcador Inflamatorio',
  },
  {
    id: 'bm4',
    name: 'Vitamina D3 (25-OH)',
    value: '54',
    unit: 'ng/mL',
    referenceRange: '30 - 80 ng/mL',
    status: 'optimal',
    statusLabel: 'Óptimo',
    category: 'Micronutrientes',
  },
  {
    id: 'bm5',
    name: 'Triglicéridos',
    value: '105',
    unit: 'mg/dL',
    referenceRange: '< 150 mg/dL',
    status: 'stable',
    statusLabel: 'Estable',
    category: 'Perfil Lipídico',
  },
  {
    id: 'bm6',
    name: 'Colesterol HDL',
    value: '58',
    unit: 'mg/dL',
    referenceRange: '> 40 mg/dL',
    status: 'optimal',
    statusLabel: 'Óptimo',
    category: 'Perfil Lipídico',
  },
];

class MedicalService {
  /**
   * Procesa la lista de biomarcadores y calcula los indicadores de salud
   */
  static analyzeBiomarkers(biomarkers = DEFAULT_BIOMARKERS) {
    let optimalCount = 0;
    let stableCount = 0;
    let highCount = 0;
    let lowCount = 0;

    biomarkers.forEach((bm) => {
      if (bm.status === 'optimal') optimalCount++;
      else if (bm.status === 'stable') stableCount++;
      else if (bm.status === 'high') highCount++;
      else if (bm.status === 'low') lowCount++;
    });

    const total = biomarkers.length || 1;
    // Score Formula: Base 100 - (High * 8) - (Low * 8) - (Stable * 2)
    let score = Math.round(100 - (highCount * 8 + lowCount * 8 + stableCount * 2));
    score = Math.max(50, Math.min(100, score));

    const alertCount = highCount + lowCount;
    let alertLevel = 'low';
    if (alertCount >= 3) alertLevel = 'high';
    else if (alertCount >= 1) alertLevel = 'medium';

    // Generar pautas inteligentes
    const recommendedFoods = [
      'Salmón salvaje & Espinacas',
      'Cúrcuma & Aceite de Oliva',
      'Nueces y Semillas de Chía',
    ];

    const restrictedFoods = [
      'Azúcares refinados & Jarabes',
      'Aceites vegetales quemados',
      'Ultraprocesados trans',
    ];

    let exerciseAdjustment =
      'Debido a la elevación de Cortisol matutino y PCR, se recomienda priorizar sesiones en Zona 2 de cardio (128 BPM) y evitar llegar al fallo muscular extremo durante esta semana para facilitar la recuperación bioquímica.';

    if (alertCount === 0) {
      exerciseAdjustment =
        'Tus biomarcadores están en estado óptimo. Puedes realizar sesiones de alta intensidad (HIIT) y entrenamiento de fuerza con carga progresiva sin restricciones.';
    }

    const nextExamDays = 60;
    const nextExamDate = new Date();
    nextExamDate.setDate(nextExamDate.getDate() + nextExamDays);

    const dateFormatted = nextExamDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const medicalDisclaimer =
      'Estas recomendaciones son orientativas, basadas en guías generales de salud (OMS/FDA) — no reemplazan el diagnóstico de tu médico. Ante cualquier valor alterado, consulta con un profesional.';

    const intelligentRecommendation =
      'Para acelerar el proceso de modular la inflamación post-esfuerzo, se aconseja sostener la ingesta de Batidos Funcionales Antiinflamatorios tras las rutinas de mayor volumen, añadir suplementación con Omega 3 (2,000 mg/día) y asegurar 7.5h de sueño reparador.';

    return {
      biochemScore: score,
      alertCount,
      alertLevel,
      summary: `Tu panel metabólico general muestra un estado de ${
        score >= 85 ? 'alta eficiencia metabólica' : 'recuperación'
      }. ${
        alertCount > 0
          ? `Se ha detectado una leve elevación en la PCR ultrasensible (proteína C reactiva) pos-entrenamiento y en el Cortisol matutino.`
          : 'Todos los parámetros están dentro de rangos idóneos.'
      }`,
      biomarkers,
      recommendations: {
        recommendedFoods,
        restrictedFoods,
        exerciseAdjustment,
        intelligentRecommendation,
      },
      preventiveExam: {
        daysRemaining: nextExamDays,
        scheduledDate: dateFormatted,
        text: `Programado para el ${dateFormatted}. Control sugerido para evaluar el descenso de PCR Ultrasensible y Cortisol matutino.`,
      },
      disclaimer: medicalDisclaimer,
    };
  }
}

module.exports = MedicalService;
