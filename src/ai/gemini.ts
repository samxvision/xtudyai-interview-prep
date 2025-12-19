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
export async function generateAiAnswer(input: { question: string, language: 'en' | 'hi' }) {
  try {
    const { question, language } = input;

    const safeQuestion = typeof question === "string" && question.trim()
      ? question.trim()
      : "Explain a technical concept in oil and gas.";

    const prompt = `You are an expert in Oil and Gas QA/QC interview questions. The user has asked a question in ${language}.
Your task is to provide a comprehensive and structured answer in BOTH English and Hindi (Hinglish) in JSON format.

The user's question is: "${safeQuestion}"

Generate a JSON object with the following fields:
1.  "shortAnswer_en": A quick, direct answer in English.
2.  "shortAnswer_hi": A quick, direct answer in Hindi (Hinglish).
3.  "longAnswer_en": A detailed explanation in English. Use markdown for formatting with paragraphs.
4.  "longAnswer_hi": A detailed explanation in Hindi (Hinglish). Use markdown for formatting with paragraphs.
5.  "summaryPoints_en": An array of 3-5 key takeaway bullet points in English.
6.  "summaryPoints_hi": An array of 3-5 key takeaway bullet points in Hindi (Hinglish).

Provide a factual, professional, and clear response suitable for someone preparing for a technical interview. The response must be a valid JSON object.
`;

    const model = genAI.getGenerativeModel({
        model: "gemini-pro", // ✅ Using the stable gemini-pro model
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
