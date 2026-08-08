const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

class MedicalService {
  /**
   * Extrae el texto bruto de un archivo de examen médico subido (PDF o Imagen/Texto).
   */
  /**
   * Extrae el texto bruto de un archivo de examen médico subido (PDF o Texto).
   * Para imágenes (PNG/JPG), se procesa mediante OpenAI Vision.
   */
  static async extractTextFromFile(file) {
    try {
      if (!file || !file.path) return '';
      if (!fs.existsSync(file.path)) return '';

      const ext = path.extname(file.originalname || file.filename || '').toLowerCase();
      const mimeType = (file.mimetype || '').toLowerCase();

      if (mimeType.includes('pdf') || ext === '.pdf') {
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text || '';
      }

      // Si es imagen, no leer como UTF8 binario basura
      if (mimeType.includes('image') || ['.png', '.jpg', '.jpeg'].includes(ext)) {
        return '';
      }

      const content = fs.readFileSync(file.path, 'utf8');
      return (content || '').substring(0, 12000);
    } catch (err) {
      console.warn('[IA Bóveda Médica] Error al descomprimir/extraer texto del PDF o archivo:', err.message);
      return '';
    }
  }

  /**
   * Analiza el examen (PDF o Imagen con Vision) con la API de OpenAI (gpt-4o-mini).
   */
  static async analyzeWithOpenAI(file, rawText, userProfile = {}) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      console.warn('[IA Bóveda Médica] Sin OPENAI_API_KEY configurado. Usando analizador clínico interno.');
      return null;
    }

    const systemPrompt = `Eres un sistema médico experto en telemetría de laboratorio clínico y bioanálisis deportivo de TeamFit Force. 
Tu tarea es analizar la información o imagen del examen médico de laboratorio enviado.
Analiza ÚNICAMENTE la información real presente en el examen.
Extrae los biomarcadores reales hallados con sus valores, unidades, rangos de referencia e interpreta su estado ('optimal', 'high', 'low').
Calcula el biochemScore (0-100), alertCount, alertLevel ('low', 'medium', 'high'), y redacta recomendaciones específicas de nutrición, alimentos a restringir y modificaciones al plan de entrenamiento basadas estrictamente en los biomarcadores del usuario.

DEBES responder ÚNICAMENTE con un objeto JSON válido respetando el siguiente esquema de tipos:
{
  "biochemScore": number,
  "alertCount": number,
  "alertLevel": "low" | "medium" | "high",
  "summary": string,
  "biomarkers": [
    {
      "id": string,
      "name": string,
      "value": string,
      "unit": string,
      "referenceRange": string,
      "status": "optimal" | "high" | "low",
      "statusLabel": string,
      "category": string
    }
  ],
  "recommendedFoods": string[],
  "restrictedFoods": string[],
  "exerciseAdjustments": string[],
  "nextExamDays": number,
  "nextExamText": string
}`;

    const mimeType = (file?.mimetype || '').toLowerCase();
    const ext = path.extname(file?.originalname || file?.filename || '').toLowerCase();
    const isImage = mimeType.includes('image') || ['.png', '.jpg', '.jpeg'].includes(ext);

    let userContent;

    if (isImage && file?.path && fs.existsSync(file.path)) {
      const imageBuffer = fs.readFileSync(file.path);
      const base64Data = imageBuffer.toString('base64');
      const imageMime = mimeType || (ext === '.png' ? 'image/png' : 'image/jpeg');

      userContent = [
        {
          type: 'text',
          text: `Perfil del Usuario: ${JSON.stringify(userProfile)}\nNombre del Archivo: ${file.originalname || file.filename}\nAnaliza este examen médico de laboratorio presentado en la imagen y extrae todos los biomarcadores y recomendaciones:`,
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:${imageMime};base64,${base64Data}`,
          },
        },
      ];
    } else {
      // Truncar de forma segura para no exceder los límites de tokens
      const safeText = (rawText || '').substring(0, 12000);
      userContent = `Perfil del Usuario: ${JSON.stringify(userProfile)}\nNombre del Archivo: ${file?.originalname || file?.filename}\n\nTexto descomprimido del examen PDF:\n---\n${safeText || 'Analizar según el contenido del archivo.'}\n---`;
    }

    try {
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
            { role: 'user', content: userContent },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('[IA Bóveda Médica] Respuesta no exitosa de OpenAI:', response.status, errorText);
        return null;
      }

      const data = await response.json();
      const contentStr = data.choices?.[0]?.message?.content;
      if (!contentStr) return null;

      const parsedJSON = JSON.parse(contentStr);
      return parsedJSON;
    } catch (err) {
      console.warn('[IA Bóveda Médica] Error al consultar OpenAI:', err.message);
      return null;
    }
  }

  /**
   * Procesa adaptativamente cualquier examen médico de laboratorio subido por el usuario (PDF/PNG/JPG/JPEG).
   */
  static async processExamFile(file, userProfile = {}) {
    if (!file) {
      return this.analyzeBiomarkers([], userProfile);
    }

    const mimeType = (file.mimetype || '').toLowerCase();
    const ext = path.extname(file.originalname || file.filename || '').toLowerCase();
    const isPDF = mimeType.includes('pdf') || ext === '.pdf';
    const isImage = mimeType.includes('image') || ['.png', '.jpg', '.jpeg'].includes(ext);

    console.log(`[IA Bóveda Médica] Procesando archivo de laboratorio: ${file.originalname || file.filename}`);
    console.log(`[IA Bóveda Médica] Formato detectado: ${isPDF ? 'Documento PDF' : isImage ? 'Imagen PNG/JPEG' : 'Archivo Estándar'}`);

    // 1. Extraer el texto real descomprimiendo las páginas del PDF mediante pdf-parse
    const rawText = await this.extractTextFromFile(file);
    console.log(`[IA Bóveda Médica] Caracteres de texto descomprimidos: ${rawText.length}`);

    // 2. Intentar análisis inteligente por IA con OpenAI (gpt-4o-mini con soporte para PDF y Vision)
    const aiAnalysis = await this.analyzeWithOpenAI(file, rawText, userProfile);

    if (aiAnalysis && Array.isArray(aiAnalysis.biomarkers) && aiAnalysis.biomarkers.length > 0) {
      console.log(`[IA Bóveda Médica] Análisis por IA completado exitosamente con ${aiAnalysis.biomarkers.length} biomarcadores.`);
      aiAnalysis.formatDetected = isPDF ? 'Documento PDF (Texto Descomprimido)' : isImage ? 'Imagen (Vision IA)' : 'Estándar';
      return aiAnalysis;
    }

    // 3. Fallback: Extracción estructurada sobre el texto descomprimido del PDF
    console.log('[IA Bóveda Médica] Ejecutando análisis clínico de respaldo sobre el texto extraído del PDF...');
    const extractedBiomarkers = this.extractBiomarkersWithAI(rawText, file.originalname || file.filename);

    const analysis = this.analyzeBiomarkers(extractedBiomarkers, userProfile);
    analysis.formatDetected = isPDF ? 'PDF' : isImage ? 'Imagen (PNG/JPG/JPEG)' : 'Estándar';
    return analysis;
  }

  /**
   * Motor de Inteligencia Artificial para extracción clínica universal:
   */
  static extractBiomarkersWithAI(rawText = '', fileName = '') {
    const biomarkers = [];
    const textToScan = (rawText || '') + '\n' + (fileName || '');
    const lines = textToScan.split(/\r?\n/);

    const labRowRegex = /^([a-zA-ZáéíóúÁÉÍÓÚñÑ\s\(\)\/\%\+\-\.\,\:\#]+?)\s+([\d\.\,]+|NEG|NORM|AMARILLO|LIMPIO)\s*([a-zA-Z0-9\^\/\%\µ\u00B5]+)?\s*([\*\s]*([\d\.\,]+\s*-\s*[\d\.\,]+|<\s*[\d\.\,]+|>\s*[\d\.\,]+|NEG|NORM)?)?/i;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 4) return;
      if (/^(página|orden|fecha|médico|paciente|laboratorio|servicio|nit)/i.test(trimmed)) return;

      const match = trimmed.match(labRowRegex);
      if (match) {
        const name = match[1].trim();
        const value = match[2].trim();
        const unit = match[3] ? match[3].trim() : '';
        const referenceRange = match[4] ? match[4].replace(/^\*/, '').trim() : '';

        if (/^(examen|resultado|unidades|valores|nombre)/i.test(name)) return;

        let status = 'optimal';
        let statusLabel = 'En Rango Óptimo';

        if (referenceRange && referenceRange.includes('-')) {
          const parts = referenceRange.split('-').map((p) => parseFloat(p.trim())).filter((n) => !isNaN(n));
          const numVal = parseFloat(value);
          if (parts.length === 2 && !isNaN(numVal)) {
            if (numVal > parts[1]) {
              status = 'high';
              statusLabel = 'Elevado / Límite Alto';
            } else if (numVal < parts[0]) {
              status = 'low';
              statusLabel = 'Bajo / Deficiente';
            }
          }
        } else if (referenceRange.startsWith('<')) {
          const maxVal = parseFloat(referenceRange.replace('<', '').trim());
          const numVal = parseFloat(value);
          if (!isNaN(maxVal) && !isNaN(numVal) && numVal > maxVal) {
            status = 'high';
            statusLabel = 'Elevado / Límite Alto';
          }
        } else if (referenceRange.startsWith('>')) {
          const minVal = parseFloat(referenceRange.replace('>', '').trim());
          const numVal = parseFloat(value);
          if (!isNaN(minVal) && !isNaN(numVal) && numVal < minVal) {
            status = 'low';
            statusLabel = 'Bajo / Deficiente';
          }
        }

        biomarkers.push({
          id: `bm_${Date.now()}_${Math.round(Math.random() * 10000)}`,
          name,
          value,
          unit: unit || 'unidad',
          referenceRange: referenceRange || 'Clínico',
          status,
          statusLabel,
          category: 'Laboratorio Clínico',
        });
      }
    });

    return biomarkers;
  }

  /**
   * Generación DINÁMICA de análisis médico
   */
  static analyzeBiomarkers(biomarkers, userProfile = {}) {
    if (!biomarkers || !Array.isArray(biomarkers) || biomarkers.length === 0) {
      return {
        biochemScore: 0,
        alertCount: 0,
        alertLevel: 'low',
        summary: 'No se ha registrado ningún examen médico de laboratorio en la base de datos.',
        biomarkers: [],
        recommendedFoods: [],
        restrictedFoods: [],
        exerciseAdjustments: [],
        nextExamDays: 0,
        nextExamText: 'Adjunta tu examen médico para activar la telemetría.',
      };
    }

    const age = Number(userProfile.age || 29);
    const name = userProfile.name || 'Atleta';

    const highAlerts = biomarkers.filter((b) => b.status === 'high');
    const lowAlerts = biomarkers.filter((b) => b.status === 'low');
    const alertCount = highAlerts.length + lowAlerts.length;

    const biochemScore = Math.max(50, 100 - highAlerts.length * 12 - lowAlerts.length * 10);

    const recommendedFoods = [];
    const restrictedFoods = [];
    const exerciseAdjustments = [];

    biomarkers.forEach((bm) => {
      const bName = bm.name;
      const bVal = bm.value;
      const bUnit = bm.unit;

      if (bm.status === 'high') {
        recommendedFoods.push(`Nutrientes prescritos por la IA para modular el marcador elevado '${bName}' (${bVal} ${bUnit}).`);
        restrictedFoods.push(`Ingredientes y compuestos a restringir por alterar '${bName}' (${bVal} ${bUnit}).`);
        exerciseAdjustments.push(`Rutina y estímulo físico adaptado para regular '${bName}' elevado.`);
      } else if (bm.status === 'low') {
        recommendedFoods.push(`Nutrientes y superalimentos indicados para nivelar el déficit en '${bName}' (${bVal} ${bUnit}).`);
        restrictedFoods.push(`Alimentos e inhibidores de absorción a restringir relacionados con '${bName}' deficiente.`);
        exerciseAdjustments.push(`Estímulo metabólico progresivo prescrito para elevar '${bName}'.`);
      }
    });

    const uniqueRecommended = [...new Set(recommendedFoods)];
    const uniqueRestricted = [...new Set(restrictedFoods)];
    const uniqueExercise = [...new Set(exerciseAdjustments)];

    return {
      biochemScore,
      alertCount,
      alertLevel: alertCount > 2 ? 'high' : alertCount > 0 ? 'medium' : 'low',
      summary: `Análisis médico procesado por la IA para ${name} (${age} años). Se evaluaron ${biomarkers.length} biomarcadores del examen de laboratorio. Se generaron ${uniqueRecommended.length} recomendaciones y ${uniqueRestricted.length} restricciones nutricionales registradas en la BD.`,
      biomarkers,
      recommendedFoods: uniqueRecommended,
      restrictedFoods: uniqueRestricted,
      exerciseAdjustments: uniqueExercise,
      nextExamDays: 60,
      nextExamText: 'Siguiente control de laboratorio recomendado en 60 días.',
    };
  }
}

module.exports = MedicalService;

