import { VertexAI } from '@google-cloud/vertexai';

let _vertexAI: VertexAI | null = null;

export function getVertexAI(): VertexAI {
  if (_vertexAI) return _vertexAI;

  const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
  if (!project) throw new Error('GOOGLE_CLOUD_PROJECT_ID is required');

  let credentials: object | undefined;
  if (process.env.GOOGLE_CLOUD_KEY_JSON) {
    try {
      credentials = JSON.parse(process.env.GOOGLE_CLOUD_KEY_JSON);
    } catch {
      throw new Error('GOOGLE_CLOUD_KEY_JSON must be valid JSON');
    }
  }

  _vertexAI = new VertexAI({
    project,
    location: process.env.VERTEX_LOCATION ?? 'us-central1',
    googleAuthOptions: credentials ? { credentials } : undefined,
  });

  return _vertexAI;
}

export const TRYON_MODEL = 'gemini-3-pro-image-preview';

export const TRYON_PROMPT = `You are a virtual try-on AI. Generate a realistic photo showing the person wearing the garment.

Rules:
- Keep the person's face, skin tone, pose, and background EXACTLY as in their photo
- Replace ONLY the clothing with the provided garment
- Make the garment look natural — adjust for body shape, lighting, and shadows
- The result must look like a real photo, not an illustration

Generate the virtual try-on image now.`;
