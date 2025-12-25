import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import * as dotenv from 'dotenv';

dotenv.config();

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })],
  logLevel: 'silent',
  enableDevUi: false,
});
