import { GoogleAuth } from 'google-auth-library';

// Google AI API — gemini-2.0-flash-exp-image-generation supports native image output
// Requires OAuth2 (not API keys); uses service account from GOOGLE_CLOUD_KEY_JSON
export const TRYON_MODEL = 'gemini-3-pro-image-preview';

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

export const TRYON_PROMPT = `You are a precise garment-swap tool. Your ONLY job is to replace the clothing in IMAGE 1 with the garment from IMAGE 2.

STRICT RULES — DO NOT BREAK ANY OF THESE:
1. OUTPUT must be IMAGE 1 with ONLY the clothing changed. Nothing else.
2. DO NOT change the person's face, eyes, nose, mouth, beard, hair, skin tone, or body shape.
3. DO NOT change the camera angle, head tilt, pose, or body position. The person must be in the EXACT same pose as IMAGE 1.
4. DO NOT reframe, crop, zoom, or resize. Output the same framing as IMAGE 1.
5. DO NOT change the background, lighting direction, or room details.
6. ONLY change the clothing: remove the existing outfit and replace it with the exact style, colour, and fabric from IMAGE 2.
7. The garment must fit naturally on the person's actual body in IMAGE 1.

Think of it as Photoshop: keep everything the same, just swap the clothes.`;

