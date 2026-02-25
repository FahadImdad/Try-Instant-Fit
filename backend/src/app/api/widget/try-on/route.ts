import { NextRequest, NextResponse } from 'next/server';
import { getGenAI, TRYON_MODEL, TRYON_PROMPT } from '@/lib/gemini';
import { uploadTryOnResult } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

// 60s timeout — image generation can take ~5-20s
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();

    const userPhotoFile = formData.get('user_photo') as File | null;
    const productImageUrl = formData.get('product_image_url') as string | null;
    const brandId = formData.get('brand_id') as string | null;
    const productId = formData.get('product_id') as string | null;
    const productName = formData.get('product_name') as string | null;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!userPhotoFile) {
      return NextResponse.json({ error: 'user_photo is required' }, { status: 400 });
    }
    if (!productImageUrl) {
      return NextResponse.json({ error: 'product_image_url is required' }, { status: 400 });
    }
    if (!brandId) {
      return NextResponse.json({ error: 'brand_id is required' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(userPhotoFile.type)) {
      return NextResponse.json({ error: 'Photo must be JPG, PNG, or WebP' }, { status: 400 });
    }
    if (userPhotoFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Photo must be under 10MB' }, { status: 400 });
    }

    // ── Convert user photo to base64 ──────────────────────────────────────────
    const userPhotoBuffer = Buffer.from(await userPhotoFile.arrayBuffer());
    const userPhotoBase64 = userPhotoBuffer.toString('base64');

    // ── Fetch and convert product image ──────────────────────────────────────
    const productResponse = await fetch(productImageUrl, {
      headers: { 'User-Agent': 'TryInstantFit/1.0' },
    });
    if (!productResponse.ok) {
      return NextResponse.json(
        { error: 'Could not fetch product image. Please try again.' },
        { status: 400 }
      );
    }
    const productBuffer = Buffer.from(await productResponse.arrayBuffer());
    const productMimeType = (productResponse.headers.get('content-type') ?? 'image/jpeg').split(';')[0];
    const productBase64 = productBuffer.toString('base64');

    // ── Call Google AI (Gemini) ───────────────────────────────────────────────
    const model = getGenAI().getGenerativeModel({ model: TRYON_MODEL });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            // Person photo
            {
              inlineData: {
                data: userPhotoBase64,
                mimeType: userPhotoFile.type,
              },
            },
            // Product/garment image
            {
              inlineData: {
                data: productBase64,
                mimeType: productMimeType,
              },
            },
            // Instruction
            { text: TRYON_PROMPT },
          ],
        },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
      } as any,
    });

    // ── Extract generated image ───────────────────────────────────────────────
    const parts = result.response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.inlineData?.mimeType?.startsWith('image/')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;

    if (!imagePart?.inlineData?.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textPart = parts.find((p: any) => p.text) as any;
      console.error('[try-on] No image in AI response. Text:', textPart?.text);
      return NextResponse.json(
        { error: 'AI could not generate the try-on. Please try a clearer, front-facing photo.' },
        { status: 422 }
      );
    }

    const resultImageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
    const resultMimeType = imagePart.inlineData.mimeType ?? 'image/jpeg';

    // ── Upload result to Google Cloud Storage ─────────────────────────────────
    const resultUrl = await uploadTryOnResult(resultImageBuffer, brandId, resultMimeType);

    const processingTimeMs = Date.now() - startTime;

    // ── Save to Supabase (fire-and-forget) ────────────────────────────────────
    supabase
      .from('tryons')
      .insert({
        brand_id: brandId,
        product_id: productId,
        product_name: productName,
        result_image_url: resultUrl,
        ai_model: TRYON_MODEL,
        processing_time_ms: processingTimeMs,
        cost_usd: 0.004,
        source: 'ghost-layer',
      })
      .then(({ error }) => {
        if (error) console.error('[try-on] Failed to save tryon record:', error.message);
      });

    return NextResponse.json({
      result_url: resultUrl,
      processing_time_ms: processingTimeMs,
    });
  } catch (error) {
    const processingTimeMs = Date.now() - startTime;
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[try-on] Unhandled error:', msg, error);
    return NextResponse.json(
      {
        error: 'Something went wrong generating your try-on. Please try again.',
        debug: msg,
        processing_time_ms: processingTimeMs,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
