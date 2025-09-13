import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export const generate = async (prompt: string) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set. Please provide a valid Gemini API key in your environment.');
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Exponential backoff retries for transient errors like 429/5xx
    let lastErr: any;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return text;
      } catch (err: any) {
        lastErr = err;
        const status = (err as any)?.status;
        const retryable = status === 429 || (status >= 500 && status < 600);
        if (!retryable || attempt === 4) break;
        const delay = 500 * Math.pow(2, attempt - 1); // 500ms, 1s, 2s
        await sleep(delay);
      }
    }
    throw lastErr;
  } catch (error) {
    console.error('Error generating response with Gemini:', error);
    throw error;
  }
}