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
      model: "models/gemini-1.5-pro-latest", // ✅ FIXED MODEL
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to ensure it's valid JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);

  } catch (error: any) {
    console.error(`AI model failed to respond. Error:`, error);
    throw new Error(`AI model failed to respond. Last error: ${error?.message || 'Unknown error'}`);
  }
}
