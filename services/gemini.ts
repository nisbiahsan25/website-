
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts and parses JSON from model output, handling markdown blocks if present.
 */
const parseAiJson = (text: string | undefined, defaultValue: any) => {
  if (!text) return defaultValue;
  try {
    // Remove markdown code blocks if they exist (e.g., ```json ... ```)
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("Failed to parse AI JSON:", text);
    return defaultValue;
  }
};

export const getMarketingCopy = async (productName: string, features: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create high-converting ad copy for ${productName}. Key features: ${features.join(', ')}. Target audience: Direct-to-consumer buyers on Facebook. Use emojis and high-energy language.`,
      config: {
        systemInstruction: "You are a world-class growth marketing copywriter specializing in Meta Ads."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Experience quality like never before. Shop now!";
  }
};

export const detectFraud = async (orderData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: JSON.stringify(orderData),
      config: {
        systemInstruction: "Analyze this order for potential fraud (Fake COD, high return probability). Return a risk score from 0-100 and a reason in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ["riskScore", "reason"],
          propertyOrdering: ["riskScore", "reason"]
        }
      }
    });
    return parseAiJson(response.text, { riskScore: 0, reason: "No data" });
  } catch (error) {
    return { riskScore: 5, reason: "Error analyzing" };
  }
};

export const getAIOptimizationSuggestions = async (metrics: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyze these business metrics: ${JSON.stringify(metrics)}. Suggest 3 specific optimizations for ROAS and LTV.`,
      config: {
        systemInstruction: "You are a Senior Growth Engineer and Data Scientist for a multi-million dollar ecommerce brand."
      }
    });
    return response.text;
  } catch (error) {
    return "Continue monitoring campaign performance.";
  }
};

export const getStockForecast = async (historicalSales: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Based on these sales: ${JSON.stringify(historicalSales)}, forecast inventory requirements for the next 30 days. Return the SKU and recommended reorder quantity in JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sku: { type: Type.STRING },
              forecastQuantity: { type: Type.NUMBER },
              daysUntilStockout: { type: Type.NUMBER }
            },
            required: ["sku", "forecastQuantity", "daysUntilStockout"]
          }
        }
      }
    });
    return parseAiJson(response.text, []);
  } catch (error) {
    return [];
  }
};

export const getSmartRecommendations = async (userHistory: any, allProducts: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Context: ${JSON.stringify(userHistory)}. Product Catalog: ${JSON.stringify(allProducts.slice(0, 50))}. Recommend 5 product IDs that this user is most likely to buy next.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return parseAiJson(response.text, []);
  } catch (error) {
    return [];
  }
};
