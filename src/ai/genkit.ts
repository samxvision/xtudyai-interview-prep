import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import * as dotenv from 'dotenv';

dotenv.config();

export const ai = genkit({
  plugins: [
    // By not passing an API key, Genkit will automatically use the
    // Application Default Credentials from the environment.
    googleAI(),
  ],
  logLevel: 'info',
  enableDevUi: false,
});
