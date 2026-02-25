import { GoogleGenerativeAI } from '@google/generative-ai';

let _genAI: GoogleGenerativeAI | null = null;

export function getGenAI(): GoogleGenerativeAI {
  if (_genAI) return _genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is required');

  _genAI = new GoogleGenerativeAI(apiKey);
  return _genAI;
}

export const TRYON_MODEL = 'gemini-2.0-flash-exp';

export const TRYON_PROMPT = `You are a virtual try-on AI. Generate a realistic photo showing the person wearing the garment.

Rules:
- Keep the person's face, skin tone, pose, and background EXACTLY as in their photo
- Replace ONLY the clothing with the provided garment
- Make the garment look natural — adjust for body shape, lighting, and shadows
- The result must look like a real photo, not an illustration

Generate the virtual try-on image now.`;
