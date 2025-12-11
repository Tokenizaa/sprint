import { GoogleGenAI, Type } from "@google/genai";
import { GreetingResult } from "../types";

// Initialize the Gemini client
// Note: API key is injected via process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateGreeting = async (userInput: string): Promise<GreetingResult> => {
  const modelId = "gemini-2.5-flash"; // Using the specified efficient model

  // Define the schema for structured JSON output
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      greeting: {
        type: Type.STRING,
        description: "The actual greeting phrase translated or stylized.",
      },
      language: {
        type: Type.STRING,
        description: "The language or persona used for the greeting.",
      },
      style: {
        type: Type.STRING,
        description: "The style or tone of the greeting (e.g., Casual, Formal, Code).",
      },
      explanation: {
        type: Type.STRING,
        description: "A brief, fun explanation of why this specific greeting was chosen.",
      },
    },
    required: ["greeting", "language", "style", "explanation"],
    propertyOrdering: ["greeting", "language", "style", "explanation"],
  };

  const prompt = `
    The user wants a variation of "Hello World". 
    User specific request: "${userInput}".
    
    If the user input is empty or just "ola mundo" or "hello world", provide a creative, random variation or a standard one with a twist.
    Be creative. The output must be strict JSON adhering to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Add a bit of creativity
      },
    });

    const text = response.text;
    
    if (!text) {
        throw new Error("No response text from Gemini.");
    }

    // Parse the JSON string into our typed object
    const result: GreetingResult = JSON.parse(text);
    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};