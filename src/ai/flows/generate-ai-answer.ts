
'use server';

/**
 * @fileOverview A Genkit flow to generate a comprehensive answer for a given question,
 * mimicking the structure of the `Question` type.
 *
 * - generateAiAnswer - A function that generates a structured answer from the AI.
 * - GenerateAiAnswerInput - The input type for the flow.
 * - GenerateAiAnswerOutput - The return type for the flow, matching parts of the Question type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { generate } from 'genkit/generate';

const GenerateAiAnswerInputSchema = z.object({
  question: z.string().describe('The user\'s question.'),
  language: z.enum(['en', 'hi']).describe('The language of the question (English or Hinglish).'),
});
export type GenerateAiAnswerInput = z.infer<typeof GenerateAiAnswerInputSchema>;

// This schema matches the structure needed to populate the AnswerCard component.
// We generate for both languages at once to allow seamless switching on the frontend.
const GenerateAiAnswerOutputSchema = z.object({
  shortAnswer_en: z.string().describe('A short, concise answer to the question in English.'),
  shortAnswer_hi: z.string().describe('A short, concise answer to the question in Hindi (Hinglish).'),
  longAnswer_en: z.string().describe('A detailed, comprehensive answer to the question in English. Use markdown for formatting with paragraphs.'),
  longAnswer_hi: z.string().describe('A detailed, comprehensive answer to the question in Hindi (Hinglish). Use markdown for formatting with paragraphs.'),
  summaryPoints_en: z.array(z.string()).describe('An array of key takeaway points summarizing the answer in English.'),
  summaryPoints_hi: z.array(z.string()).describe('An array of key takeaway points summarizing the answer in Hindi (Hinglish).'),
});
export type GenerateAiAnswerOutput = z.infer<typeof GenerateAiAnswerOutputSchema>;

export async function generateAiAnswer(input: GenerateAiAnswerInput): Promise<GenerateAiAnswerOutput> {
  return generateAiAnswerFlow(input);
}

const generateAiAnswerFlow = ai.defineFlow(
  {
    name: 'generateAiAnswerFlow',
    inputSchema: GenerateAiAnswerInputSchema,
    outputSchema: GenerateAiAnswerOutputSchema,
  },
  async (input) => {
    try {
        const safeQuestion = typeof input.question === "string" && input.question.trim() ? input.question.trim() : "Explain this technical concept.";

        const prompt = `You are an expert in Oil and Gas QA/QC interview questions. The user has asked a question in ${input.language}.
Your task is to provide a comprehensive and structured answer in BOTH English and Hindi (Hinglish).

The question is: ${safeQuestion}

Please generate the following fields:
1.  **shortAnswer_en**: A quick, direct answer in English.
2.  **shortAnswer_hi**: A quick, direct answer in Hindi (Hinglish).
3.  **longAnswer_en**: A detailed explanation in English. Structure it with paragraphs.
4.  **longAnswer_hi**: A detailed explanation in Hindi (Hinglish). Structure it with paragraphs.
5.  **summaryPoints_en**: A list of 3-5 key takeaway bullet points in English.
6.  **summaryPoints_hi**: A list of 3-5 key takeaway bullet points in Hindi (Hinglish).

Provide a factual, professional, and clear response suitable for someone preparing for a technical interview.`;


      const response = await generate({
        model: googleAI('gemini-1.5-pro'),
        prompt: prompt,
        output: {
          schema: GenerateAiAnswerOutputSchema,
        },
      });
      
      const output = response.output();

      if (output) {
        return output;
      }
      
      throw new Error('AI model returned a null output without an error.');

    } catch (error: any) {
        console.error(`AI model failed to respond. Error:`, error);
        throw new Error(`AI model failed to respond. Last error: ${error?.message || 'Unknown error'}`);
    }
  }
);
