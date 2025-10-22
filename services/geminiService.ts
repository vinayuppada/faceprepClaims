
import { GoogleGenAI, Type } from "@google/genai";
import { ClaimCategory } from "../types";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        amount: {
            type: Type.NUMBER,
            description: "The total amount found on the receipt. Should be a number.",
        },
        date: {
            type: Type.STRING,
            description: "The date of the transaction in YYYY-MM-DD format.",
        },
        category: {
            type: Type.STRING,
            description: "The most likely expense category.",
            enum: Object.values(ClaimCategory),
        },
    },
};

export const extractInfoFromReceipt = async (base64Image: string, mimeType: string): Promise<{ amount: number; date: string; category: string } | null> => {
    if (!API_KEY) {
        console.error("Cannot call Gemini API: API_KEY is not configured.");
        // Return a mock response or null when API key is not available
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        return null; 
    }

    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };

        const textPart = {
            // FIX: Corrected date format in prompt to match schema.
            text: `Analyze this receipt and extract the total amount, the date of the transaction, and suggest the most appropriate category. Categories are: ${Object.values(ClaimCategory).join(', ')}. Return the date in YYYY-MM-DD format.`,
        };

        const response = await ai.models.generateContent({
            // FIX: Use correct model 'gemini-2.5-flash' instead of prohibited 'gemini-1.5-flash'.
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        // FIX: Access response text via the .text property instead of calling .text().
        const jsonText = response.text.trim();
        if (jsonText) {
            return JSON.parse(jsonText) as { amount: number; date: string; category: string };
        }
        return null;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return null;
    }
};