import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  // By removing the default model here, we allow flows to specify their own model,
  // which is necessary for the model fallback logic.
});
