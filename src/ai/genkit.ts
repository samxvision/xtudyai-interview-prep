import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    // When called without an API key, Genkit will use Application
    // Default Credentials to authenticate.
    googleAI(),
  ],
  logLevel: 'info',
  enableDevUi: false,
});
