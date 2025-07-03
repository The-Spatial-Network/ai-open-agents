import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/app/(auth)/auth';
import {
  getAnonymousSession,
  convertAnonymousSession,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import { generateUUID } from '@/lib/utils';
import { ChatSDKError } from '@/lib/errors';

const convertSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError(
        'unauthorized:auth',
        'Authentication required',
      ).toResponse();
    }

    const body = await request.json();
    const { sessionId } = convertSessionSchema.parse(body);

    // Get the anonymous session
    const anonymousSession = await getAnonymousSession({ id: sessionId });

    if (!anonymousSession) {
      return new ChatSDKError(
        'not_found:session',
        'Session not found',
      ).toResponse();
    }

    if (anonymousSession.convertedUserId) {
      return new ChatSDKError(
        'bad_request:session',
        'Session already converted',
      ).toResponse();
    }

    // Create a new chat with the user's prompt
    const chatId = generateUUID();
    const messageId = generateUUID();

    await saveChat({
      id: chatId,
      userId: session.user.id,
      title: `${anonymousSession.initialPrompt.slice(0, 50)}...`,
      visibility: 'private',
    });

    // Save the initial message
    await saveMessages({
      messages: [
        {
          id: messageId,
          chatId,
          role: 'user',
          parts: [{ type: 'text', text: anonymousSession.initialPrompt }],
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    // Mark the anonymous session as converted
    await convertAnonymousSession({
      sessionId,
      userId: session.user.id,
      chatId,
    });

    return NextResponse.json({
      chatId,
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

    console.error('Unexpected error in convert session API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
