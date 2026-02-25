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

export const TRYON_PROMPT = `INSTRUCTIONS FOR AI TAILOR:
1. Look at the FIRST IMAGE (the Person). This is the model who will be wearing the clothes.
2. Look at the SECOND IMAGE (the Garment). This is the exact piece of clothing (Shalwar Kameez/Suit) to be applied.

TRANSFORMATION STEPS:
- PERFORM A GARMENT TRANSFER: Remove the existing clothing from the Person in the first image.
- APPLY THE NEW GARMENT: Dress the Person in the EXACT garment shown in the second image.
- PRESERVE IDENTITY: Do not change the person's face, hair, skin tone, or body proportions.
- PRESERVE ENVIRONMENT: Keep the background, lighting, and camera angle identical to the first image.
- REALISM: Ensure the fabric folds, shadows, and textures (like embroidery or collar details) look 100% natural as if they were worn in the original photo.

Output ONLY the transformed image.`;
