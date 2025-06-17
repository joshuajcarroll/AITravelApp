// app/api/chat/route.ts
import { streamText } from 'ai';
// ONLY import google, comment out or remove openai
import { google } from '@ai-sdk/google';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('API Route: Request received.');
    const { messages } = await req.json();
    console.log('API Route: Messages parsed:', messages);

    // Directly use Google model, remove the if/else if block for simplicity
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error('API Route: GOOGLE_GENERATIVE_AI_API_KEY not found.');
        return new Response('Google API key not found. Please set GOOGLE_GENERATIVE_AI_API_KEY.', { status: 500 });
    }
    const model = google('models/gemini-1.5-flash'); // Use 'models/gemini-pro' for good quality text chat
    console.log('API Route: Using Google Gemini model.');


    const systemMessage = {
      role: 'system',
      content: `You are an AI-powered travel assistant specializing in itinerary creation.
      Provide helpful, concise, and inspiring travel advice, suggestions, and information.
      When asked to create an itinerary or plan a trip, generate a response structured with daily breakdowns.
      For each day, suggest activities, sights, and perhaps food recommendations.
      Use clear headings for days (e.g., "Day 1: Arrival and City Exploration").
      Keep responses engaging and easy to read.
      If asked about booking, always suggest looking up real-time services on dedicated booking sites.`,
    };

    console.log('API Route: Calling streamText...');
    const result = await streamText({
      model: model,
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      maxTokens: 500,
    });
    console.log('API Route: streamText call completed. Returning response.');

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Route: Caught an error during request processing:', error);
    // This will now provide a more useful error to the client if something genuinely throws
    if (process.env.NODE_ENV === 'development') {
      return new Response(`Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}