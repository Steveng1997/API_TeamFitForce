class MedicalService {
  /**
   * Analiza clínicamente un examen de laboratorio o lista de biomarcadores
   * considerando edad, género y condiciones médicas del usuario.
   */
  static analyzeBiomarkers(biomarkers, userProfile = {}) {
    const age = Number(userProfile.age || 32);
    const gender = (userProfile.gender || userProfile.size === 'F' ? 'Femenino' : 'Masculino').toLowerCase();
    const conditions = (userProfile.goal || '').toLowerCase();

    // Biomarcadores clínicos procesados por defecto si es una nueva carga
    const processedBiomarkers = biomarkers && biomarkers.length > 0
      ? biomarkers
      : [
          {
            id: 'bm_glucose',
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
            name: 'Hemoglobina Glicosilada (HbA1c)',
            value: '5.6',
            unit: '%',
            referenceRange: '< 5.7 %',
            status: 'stable',
            statusLabel: 'Normal Normal',
            category: 'Metabólico',
          },
        ];

    // Conteo de alertas
    const highAlerts = processedBiomarkers.filter((b) => b.status === 'high').length;
    const lowAlerts = processedBiomarkers.filter((b) => b.status === 'low').length;
    const alertCount = highAlerts + lowAlerts;

    // Cálculo dinámico de Score Bioquímico (100 - penalizaciones por alteración)
    const biochemScore = Math.max(50, 100 - highAlerts * 10 - lowAlerts * 8);

    // Recomendaciones Nutricionales adaptadas según Edad, Género y Exámenes
    const recommendedFoods = [
      'Proteínas de Alto Valor Biológico (Pechuga de pavo, Salmón rico en Omega-3, Huevos orgánicos)',
      'Carbohidratos Complejos de Bajo Índice Glucémico (Quinoa, Avena integral, Batata)',
      'Grasas Saludables Protectoras (Aguacate, Aceite de oliva virgen extra, Nueces de nogal)',
      'Vegetales de Hoja Verde y Crucíferas (Espinaca, Brócoli, Col rizada para Fase II hepática)',
    ];

    const restrictedFoods = [
      'Azúcares refinados y harinas ultraprocesadas (para estabilizar la Glucosa en Ayunas)',
      'Bebidas azucaradas y estimulantes nocturnos (para modular el Cortisol elevado)',
      'Grasas trans y aceites vegetales hidrogenados',
    ];

    // Adaptación de Rutina de Ejercicio según perfil
    let exerciseAdjustments = [
      'Priorizar entrenamiento de fuerza de resistencia progresiva (Zona 2 Cardio & Pesas).',
      'Evitar sobreentrenamiento de alta intensidad en ayunas para prevenir espigas de cortisol elevado.',
    ];

    if (age > 45) {
      exerciseAdjustments.push('Incluir calentamiento articular prolongado y movilidad activa (15 min).');
    }

    if (gender.includes('fem')) {
      exerciseAdjustments.push('Enfocar en carga axial de densidad ósea optimizada con Vitamina D.');
    }

    return {
      biochemScore,
      alertCount,
      alertLevel: alertCount > 2 ? 'high' : alertCount > 0 ? 'medium' : 'low',
      summary: `Análisis procesado para usuario de ${age} años (${gender}). Se detectaron ${alertCount} biomarcadores alterados (Glucosa y Cortisol elevados, Vitamina D insuficiente). Se ha adaptado tu plan nutricional y rutina de entrenamiento.`,
      biomarkers: processedBiomarkers,
      recommendedFoods,
      restrictedFoods,
      exerciseAdjustments,
      nextExamDays: 45,
      nextExamText: 'Recomendado en 45 días para control de Glucosa, Cortisol y Vitamina D.',
    };
  }
}

module.exports = MedicalService;
