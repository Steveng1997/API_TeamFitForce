/**
 * Motor de IA para el Coach Virtual de TeamFit Force
 */

class CoachService {
  /**
   * Genera respuestas habladas del Coach IA basadas en el historial médico de la Bóveda Médica y el perfil
   */
  static async generateResponse(userMessage, userProfile = {}, biometrics = {}, medicalAnalysis = null) {
    const name = userProfile.name || 'Atleta';
    const age = userProfile.age || '29';
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey.trim() !== '') {
      try {
        const systemPrompt = `Eres el Coach Virtual de Voz de TeamFit Force. Hablas directamente con el usuario ${name} (Edad: ${age}).
Tu objetivo es dar consejos motivacionales y fisiológicos HABLADOS en español directo, profesional y energizante.
Instrucciones estrictas:
- Mantén tus respuestas CONCISAS (máximo 2 a 3 frases, ideales para ser leídas por la voz en voz alta).
- Basa SIEMPRE tus respuestas en la información médica real obtenida de la Bóveda Médica del usuario (biomarcadores, alertas, alimentos recomendados y restringidos, y rutina prescrita).
- Cita los biomarcadores reales del usuario si la pregunta o contexto se relaciona con salud, fatiga, rutina o alimentación.

Información Médica del Usuario en Bóveda Médica:
- Score Bioquímico: ${medicalAnalysis?.biochemScore || 'Sin examen subido aún'}
- Nivel de Alerta: ${medicalAnalysis?.alertLevel || 'bajo'}
- Resumen Médico: ${medicalAnalysis?.summary || 'No hay exámenes clínicos registrados'}
- Biomarcadores extraídos: ${JSON.stringify(medicalAnalysis?.biomarkers || [])}
- Alimentos Recomendados: ${JSON.stringify(medicalAnalysis?.recommendedFoods || [])}
- Alimentos Restringidos: ${JSON.stringify(medicalAnalysis?.restrictedFoods || [])}
- Ajustes de Ejercicio: ${JSON.stringify(medicalAnalysis?.exerciseAdjustments || [])}
- Pasos de Hoy: ${biometrics.steps || 0}
- Calorías Quemadas: ${biometrics.activeCalories || 0}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 250,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data.choices?.[0]?.message?.content?.trim();
          if (replyText) {
            return {
              message: replyText,
              audioSynthesizedUrl: null,
              voiceTone: 'Motivational Active',
              timestamp: new Date().toISOString(),
            };
          }
        }
      } catch (err) {
        console.warn('[Coach Service AI Error]:', err.message);
      }
    }

    // Fallback dinámico usando los biomarcadores reales si la API no está disponible
    let text = `¡Vamos ${name}! Mantén el enfoque. Cada repetición y cada alimento cuenta.`;

    if (medicalAnalysis && medicalAnalysis.biomarkers && medicalAnalysis.biomarkers.length > 0) {
      const highBm = medicalAnalysis.biomarkers.find((b) => b.status === 'high');
      const lowBm = medicalAnalysis.biomarkers.find((b) => b.status === 'low');

      if (highBm) {
        text = `Hola ${name}, en tu Bóveda Médica registramos ${highBm.name} en ${highBm.value} ${highBm.unit}. Mantén la hidratación y reduce el estrés hoy.`;
      } else if (lowBm) {
        text = `Hola ${name}, detectamos un déficit en ${lowBm.name} (${lowBm.value} ${lowBm.unit}). Sigue los alimentos prescritos por la IA para nivelar tus métricas.`;
      } else {
        text = `¡Excelente trabajo ${name}! Tus biomarcadores en Bóveda Médica están en rango óptimo. Mantén la intensidad Zona 2 hoy.`;
      }
    }

    return {
      message: text,
      audioSynthesizedUrl: null,
      voiceTone: 'Motivational Active',
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = CoachService;
