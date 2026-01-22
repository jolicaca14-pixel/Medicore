import { GoogleGenAI } from "@google/genai";
import { sanitizeInput } from '../utils/security';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateClinicalSummary = async (notes: string): Promise<string> => {
  if (!ai) return "Clave API de Gemini no configurada.";

  // 🛡️ SENTINEL: Sanitize input to mitigate prompt injection risks.
  const sanitizedNotes = sanitizeInput(notes);

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
  
    // 🛡️ SENTINEL: Sanitize input to mitigate prompt injection risks.
    const sanitizedSymptoms = sanitizeInput(symptoms);

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
