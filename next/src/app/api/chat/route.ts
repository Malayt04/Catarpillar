import { CoreMessage, generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const { responseMessages } = await generateText({
    model: google('models/gemini-1.5-pro-latest'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return Response.json({ messages: responseMessages });
}