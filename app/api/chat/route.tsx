// app/api/chat/route.ts
import { streamText } from 'ai';
// Import the correct provider based on your choice
import { openai } from '@ai-sdk/openai'; // If using OpenAI
import { google } from '@ai-sdk/google'; // If using Google Gemini

// Allow streaming to the client
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Determine which model to use based on your setup
    let model;
    if (process.env.OPENAI_API_KEY) {
      model = openai('gpt-4o'); // Or 'gpt-3.5-turbo' for cheaper option
    } else if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      model = google('models/gemini-pro'); // Use gemini-pro for general chat
    } else {
      return new Response('No AI API key found. Please set OPENAI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY.', { status: 500 });
    }

    // System message to guide the AI for a travel app context
    const systemMessage = {
      role: 'system',
      content: 'You are an AI-powered travel assistant. Provide helpful, concise, and inspiring travel advice, suggestions, and information. Encourage travel and exploration. If asked about booking, suggest looking up real-time services on dedicated booking sites.',
    };

    const result = await streamText({
      model: model,
      // Prepend the system message to guide the AI's behavior
      messages: [systemMessage, ...messages],
      temperature: 0.7, // Adjust for creativity (higher = more creative)
      maxTokens: 500, // Limit response length to control costs and conciseness
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    // Provide a more detailed error message in development
    if (process.env.NODE_ENV === 'development') {
      const errorMessage = (error && typeof error === 'object' && 'message' in error) ? (error as { message: string }).message : 'Unknown error';
      return new Response(`Error processing request: ${errorMessage}`, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}