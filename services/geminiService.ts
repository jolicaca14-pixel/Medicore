import { GoogleGenAI } from "@google/genai";

// 🛡️ SENTINEL: Basic input sanitization to mitigate prompt injection risks.
// This is a simple defense-in-depth measure. For production, consider more robust
// contextual sanitizers or structured input methods if the LLM allows.
const sanitizeInput = (text: string): string => {
  // Removes characters that could be used to manipulate instructions,
  // like backticks, and escapes common string terminators.
  return text
    .replace(/`/g, '')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
};

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateClinicalSummary = async (notes: string): Promise<string> => {
  if (!ai) return "Clave API de Gemini no configurada.";

  const sanitizedNotes = sanitizeInput(notes);

  // Mock response for testing if key is dummy
  if (apiKey === 'dummy_key_for_testing') {
      return "RESUMEN MOCK (MODO PRUEBA): Paciente estable. Se observa evolución favorable en el cuadro clínico reportado. Se recomienda continuar con el plan de tratamiento actual y monitoreo de signos vitales.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un asistente médico útil. Resume las siguientes notas clínicas en un párrafo conciso adecuado para una entrega de paciente o epicrisis. Usa terminología médica profesional en español. \n\n Notas: ${sanitizedNotes}`,
    });
    return response.text || "No se generó resumen.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generando el resumen. Intente nuevamente.";
  }
};

export const suggestICDCodes = async (symptoms: string): Promise<string> => {
    if (!ai) return "Clave API de Gemini no configurada.";
  
    const sanitizedSymptoms = sanitizeInput(symptoms);

    // Mock response for testing if key is dummy
    if (apiKey === 'dummy_key_for_testing') {
        return "• 8A80.0 Migraña sin aura\n• 8A82 Cefalea de tipo tensional\n• 8A84 Cefalea en racimos";
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Basado en los siguientes síntomas y hallazgos, sugiere 3 posibles códigos CIE-11 con sus descripciones en español. Formato de lista con viñetas. \n\n Hallazgos: ${sanitizedSymptoms}`,
      });
      return response.text || "No se encontraron sugerencias.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error buscando códigos CIE.";
    }
  };
