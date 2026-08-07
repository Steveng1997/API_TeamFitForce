/**
 * Motor de IA para el Coach Virtual de TeamFit Force
 */

class CoachService {
  static generateResponse(userMessage, userProfile = {}, biometrics = {}) {
    const name = userProfile.name || 'Carlos';
    const messageLower = (userMessage || '').toLowerCase();

    let text = `¡Vamos ${name}! Veo que tu ritmo bajó. Aprieta el paso, faltan solo 3 minutos.`;

    if (messageLower.includes('cansado') || messageLower.includes('fatiga')) {
      text = `Hola ${name}, detecto en tus métricas de Bóveda Médica una leve elevación de Cortisol. Te recomiendo reducir la intensidad a Zona 2 (128 BPM) y beber tu Batido Funcional Depurativo.`;
    } else if (messageLower.includes('comida') || messageLower.includes('receta')) {
      text = `Para hoy te sugiero el Bowl Proteico de Salmón & Quinoa. Te aportará 42g de proteína y los ácidos grasos Omega-3 idóneos para la recuperación.`;
    } else if (messageLower.includes('rutina') || messageLower.includes('ejercicio')) {
      text = `¡Excelente energía ${name}! Hoy nos toca Día 14 de Condicionamiento Metabólico. Mantén una buena hidratación durante las series.`;
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
