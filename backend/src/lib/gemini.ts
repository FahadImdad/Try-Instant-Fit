import { GoogleAuth } from 'google-auth-library';

// Google AI API — gemini-2.0-flash-exp-image-generation supports native image output
// Requires OAuth2 (not API keys); uses service account from GOOGLE_CLOUD_KEY_JSON
export const TRYON_MODEL = 'gemini-2.0-flash-exp-image-generation';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${TRYON_MODEL}:generateContent`;

async function getAccessToken(): Promise<string> {
  const keyJson = process.env.GOOGLE_CLOUD_KEY_JSON;
  if (!keyJson) throw new Error('GOOGLE_CLOUD_KEY_JSON is required');

  const credentials = JSON.parse(keyJson);
  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/generative-language'],
  });

  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) throw new Error('Failed to get OAuth2 access token from service account');
  return token;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateContent(requestBody: object): Promise<any> {
  const token = await getAccessToken();

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini API ${response.status}: ${text}`);
  }

  return response.json();
}

export const TRYON_PROMPT = `TASK: Virtual try-on — dress the TARGET PERSON (Image 1) in the garment from the GARMENT SOURCE (Image 2).

CRITICAL RULES:
- The OUTPUT must show the PERSON from IMAGE 1. Do NOT output the person from Image 2.
- Image 2 may show a model or mannequin wearing the garment — extract ONLY the garment, ignore that model entirely.
- PRESERVE the face, hair, skin tone, body, pose, and background from IMAGE 1 exactly.
- REPLACE only the clothing with the exact garment (colour, style, fabric, embroidery) from IMAGE 2.
- Make the garment fit naturally — realistic folds, shadows, and fabric texture.

Output ONLY the final transformed image of the Image 1 person wearing the Image 2 garment.`;
