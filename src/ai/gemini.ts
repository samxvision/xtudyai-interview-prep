'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in the environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generates a structured answer using the Gemini API.
 * This function now uses the stable gemini-pro model.
 */
export async function generateAiAnswer(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to ensure it's valid JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Attempt to parse the cleaned JSON
    try {
        return JSON.parse(jsonString);
    } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        console.error("Original AI response text:", text);
        // Fallback for non-JSON or malformed JSON responses
        // Create a structured object from the raw text
        return {
            shortAnswer_en: text,
            shortAnswer_hi: "एआई से कोई संरचित प्रतिक्रिया नहीं मिली।",
            longAnswer_en: text,
            longAnswer_hi: "एआई से कोई संरचित प्रतिक्रिया नहीं मिली।",
            summaryPoints_en: [text],
            summaryPoints_hi: ["एआई से कोई संरचित प्रतिक्रिया नहीं मिली।"]
        };
    }

  } catch (error: any) {
    console.error(`AI model failed to respond. Error:`, error);
    throw new Error(`AI model failed to respond. Last error: ${error?.message || 'Unknown error'}`);
  }
}
