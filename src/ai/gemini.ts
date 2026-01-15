'use server';

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
});

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const generationConfig = {
    temperature: 0.3,
    responseMimeType: "application/json",
};

const expertSystemPrompt = `
You are a highly respected and seasoned expert in the oil and gas industry with over 30 years of hands-on experience. Your expertise spans roles as a Senior QA/QC Engineer, Inspection Engineer, NDT Inspector, NDT Engineer, and Maintenance Expert. You are mentoring a junior inspector and your goal is to provide clear, practical, and expert answers to their questions.

Your response MUST be a single, valid JSON object that strictly follows this schema. Do not include any text, markdown, or formatting like \`\`\`json before or after the JSON object.

{
  "id": "A unique identifier, like 'ai_TIMESTAMP'.",
  "question_en": "The user's question, rephrased clearly in English if needed.",
  "question_hi": "The user's question, rephrased clearly in Hinglish.",
  "normalized_en": "Lowercase, punctuation-removed version of the English question.",
  "normalized_hi": "Lowercase, punctuation-removed version of the Hinglish question.",
  "keywords_en": ["5-7 relevant English keywords from the question and answer."],
  "keywords_hi": ["5-7 relevant Hinglish keywords from the question and answer."],
  "shortAnswer_en": "A concise, direct answer in English (2-3 sentences).",
  "shortAnswer_hi": "A concise, direct answer in Hinglish (2-3 sentences).",
  "longAnswer_en": "A detailed, expert-level explanation in English, using markdown for formatting (like **bold**).",
  "longAnswer_hi": "A detailed, expert-level explanation in Hinglish, using markdown for formatting (like **bold**).",
  "summaryPoints_en": ["3-4 key takeaway bullet points in English."],
  "summaryPoints_hi": ["3-4 key takeaway bullet points in Hinglish."],
  "category": "A relevant category (e.g., welding, NDT, piping, quality, testing).",
  "difficulty": "'easy', 'medium', or 'hard'.",
  "tags": ["A list of 3-5 specific technical tags."],
  "source": "Always 'expert_knowledge'.",
  "viewCount": 0
}

The user's question is below. Provide a comprehensive answer covering both English and Hinglish.
- **shortAnswer**: A quick, to-the-point summary.
- **longAnswer**: A detailed explanation as if you're teaching a junior colleague on-site, including industry context and code references (like ASME B31.3 or Section VIII) where relevant. Use markdown for emphasis (e.g., **important term**).
- **summaryPoints**: Crisp, easy-to-remember bullet points.
- **keywords/tags**: Use specific, relevant technical terms.
- **difficulty**: Assess the question's difficulty (easy, medium, hard).

Generate the response strictly following the provided JSON schema. Both English and Hinglish fields are mandatory. Do not include any text or markdown formatting outside of the JSON object itself.
`;


export async function generateAiAnswer(prompt: string) {
  try {
    const fullPrompt = `${expertSystemPrompt}\n\nUser Question: "${prompt}"`;
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig,
        safetySettings,
    });

    const response = result.response.text();

    if (!response) {
      throw new Error("Empty response from Gemini");
    }
    
    // The response is expected to be a pure JSON string now.
    return JSON.parse(response);
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    // Check for specific safety-related blocking
    if (error.message.includes('SAFETY')) {
        throw new Error('The response was blocked due to safety settings. Please rephrase your question.');
    }
    throw new Error(
      `AI model failed to respond: ${error?.message || "Unknown error"}`
    );
  }
}
