import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getConciergeRecommendation = async (userQuery: string): Promise<string> => {
  try {
    const productCatalog = PRODUCTS.map(p => 
      `- ${p.name} (${p.category} - ${p.brand}): ${p.description}. Precio: ${p.price.toLocaleString('es-PY')} PYG`
    ).join('\n');

    const systemInstruction = `
      Eres el "Concierge Virtual" de Soberano, una tienda de lujo de relojes y perfumes en Paraguay.
      Tu tono es extremadamente elegante, profesional, sobrio y servicial (como un mayordomo de alta gama).
      
      Tu objetivo es recomendar productos de nuestro catálogo basándote en la consulta del usuario.
      
      Catálogo actual:
      ${productCatalog}
      
      Reglas:
      1. Recomienda SOLO productos del catálogo.
      2. Sé breve y directo, máximo 3 párrafos cortos.
      3. Si el usuario pregunta por precios, dáselos en Guaraníes (PYG).
      4. Recuerda mencionar nuestras promociones: "Envío gratis en Asunción" para relojes y "Decant de regalo con la compra de un reloj".
      5. Finaliza invitando a agregar al carrito o comprar por WhatsApp con Lucas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } // Low latency
      }
    });

    return response.text || "Disculpe, en este momento estoy reordenando el inventario mental. Por favor, consulte directamente con Lucas vía WhatsApp.";
  } catch (error) {
    console.error("Error consultando al concierge:", error);
    return "Mis disculpas, ha ocurrido un error de conexión. Por favor intente nuevamente o contacte a nuestro soporte.";
  }
};