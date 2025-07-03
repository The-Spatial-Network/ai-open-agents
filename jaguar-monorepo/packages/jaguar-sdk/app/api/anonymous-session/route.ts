import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveAnonymousSession } from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';
import { ChatSDKError } from '@/lib/errors';

const createAnonymousSessionSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  sessionData: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, sessionData } = createAnonymousSessionSchema.parse(body);

    const sessionId = generateUUID();

    await saveAnonymousSession({
      id: sessionId,
      initialPrompt: prompt,
      sessionData,
    });

    return NextResponse.json({
      sessionId,
      success: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new ChatSDKError(
        'bad_request:api',
        'Invalid request data',
      ).toResponse();
    }

    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error('Unexpected error in anonymous session API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
