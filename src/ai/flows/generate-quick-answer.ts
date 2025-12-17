'use server';

/**
 * @fileOverview A flow to generate a quick, concise answer for a question using Genkit.
 *
 * - generateQuickAnswer - A function that generates a quick answer to a given question.
 * - GenerateQuickAnswerInput - The input type for the generateQuickAnswer function.
 * - GenerateQuickAnswerOutput - The return type for the generateQuickAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuickAnswerInputSchema = z.object({
  question: z.string().describe('The question to generate a quick answer for.'),
});
export type GenerateQuickAnswerInput = z.infer<typeof GenerateQuickAnswerInputSchema>;

const GenerateQuickAnswerOutputSchema = z.object({
  quickAnswer: z.string().describe('A quick, concise answer to the question.'),
});
export type GenerateQuickAnswerOutput = z.infer<typeof GenerateQuickAnswerOutputSchema>;

export async function generateQuickAnswer(input: GenerateQuickAnswerInput): Promise<GenerateQuickAnswerOutput> {
  return generateQuickAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuickAnswerPrompt',
  input: {schema: GenerateQuickAnswerInputSchema},
  output: {schema: GenerateQuickAnswerOutputSchema},
  prompt: `You are an expert in Oil and Gas QA/QC. Provide a quick and concise answer to the following question:\n\nQuestion: {{{question}}}`,
});

const generateQuickAnswerFlow = ai.defineFlow(
  {
    name: 'generateQuickAnswerFlow',
    inputSchema: GenerateQuickAnswerInputSchema,
    outputSchema: GenerateQuickAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      quickAnswer: output!.quickAnswer,
    };
  }
);
