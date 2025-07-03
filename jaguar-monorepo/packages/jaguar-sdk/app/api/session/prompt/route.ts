import { type NextRequest, NextResponse } from 'next/server';
import { getAnonymousSession } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return new ChatSDKError(
        'bad_request:api',
        'Session ID is required',
      ).toResponse();
    }

    const session = await getAnonymousSession({ id: sessionId });

    if (!session) {
      return new ChatSDKError(
        'not_found:session',
        'Session not found',
      ).toResponse();
    }

    return NextResponse.json({
      prompt: session.initialPrompt,
      sessionId: session.id,
      sessionData: session.sessionData ? JSON.parse(session.sessionData as string) : null,
    });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error('Unexpected error in session prompt API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
