// This file is used to run Genkit in development mode.
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Make sure to register your flows here
// import './flows/generate-ai-answer';

export default genkit({
  plugins: [
    // The Google AI plugin is used to generate content with Google's models.
    googleAI(),
  ],
  // Log all traces to the console.
  logLevel: 'debug',
  // Open the Developer UI on startup.
  enableDevUi: true,
});
