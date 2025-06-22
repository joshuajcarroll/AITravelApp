/*import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import * as z from 'zod'; // Make sure you have zod installed: npm install zod

export const dynamic = 'force-dynamic';

// 1. Define a comprehensive map of cities to IANA time zone names
const CITY_TIMEZONE_MAP: { [key: string]: string } = {
  "london": "Europe/London",
  "paris": "Europe/Paris",
  "berlin": "Europe/Berlin",
  "tokyo": "Asia/Tokyo",
  "new york": "America/New_York",
  "los angeles": "America/Los_Angeles",
  "sydney": "Australia/Sydney",
  "dubai": "Asia/Dubai",
  "ypsilanti": "America/Detroit",
  "ann arbor": "America/Detroit",
  "detroit": "America/Detroit",
  "michigan": "America/Detroit",
  "chicago": "America/Chicago",
  "boston": "America/New_York",
  "san francisco": "America/Los_Angeles",
  "seattle": "America/Los_Angeles",
  "miami": "America/New_York",
  "rome": "Europe/Rome",
  "rome italy": "Europe/Rome",
  "moscow": "Europe/Moscow",
  "beijing": "Asia/Shanghai",
  "shanghai": "Asia/Shanghai",
  "hong kong": "Asia/Hong_Kong",
  "singapore": "Asia/Singapore",
  "mumbai": "Asia/Kolkata",
  "delhi": "Asia/Kolkata",
  "sao paulo": "America/Sao_Paulo",
  "rio de janeiro": "America/Rio_de_Janeiro", // Corrected for Rio
  "mexico city": "America/Mexico_City",
  "toronto": "America/Toronto",
  "vancouver": "America/Vancouver",
  "cairo": "Africa/Cairo",
  "johannesburg": "Africa/Johannesburg",
  "capetown": "Africa/Johannesburg",
  "ankara": "Europe/Istanbul",
  "istanbul": "Europe/Istanbul",
  "athens": "Europe/Athens",
  "madrid": "Europe/Madrid",
  "barcelona": "Europe/Madrid",
  "lisbon": "Europe/Lisbon",
  "amsterdam": "Europe/Amsterdam",
  "brussels": "Europe/Brussels",
  "stockholm": "Europe/Stockholm",
  "oslo": "Europe/Oslo",
  "helsinki": "Europe/Helsinki",
  "copenhagen": "Europe/Copenhagen",
  "warsaw": "Europe/Warsaw",
  "prague": "Europe/Prague",
  "vienna": "Europe/Vienna",
  "budapest": "Europe/Budapest",
  "zurich": "Europe/Zurich",
  "geneva": "Europe/Zurich",
  "dublin": "Europe/Dublin",
  "edinburgh": "Europe/London",
  "glasgow": "Europe/London",
  "belfast": "Europe/London",
  "cardiff": "Europe/London",
  "manchester": "Europe/London",
  "liverpool": "Europe/London",
  "newcastle": "Europe/London",
  "leeds": "Europe/London",
  "bristol": "Europe/London",
  "birmingham": "Europe/London",
  "sheffield": "Europe/London",
  "nottingham": "Europe/London",
  "leicester": "Europe/London",
  "coventry": "Europe/London",
  "stoke-on-trent": "Europe/London",
  "plymouth": "Europe/London",
  "wolverhampton": "Europe/London",
  "derby": "Europe/London",
  "southampton": "Europe/London",
  "portsmouth": "Europe/London",
  "brighton": "Europe/London",
  "oxford": "Europe/London",
  "cambridge": "Europe/London",
  "bangkok": "Asia/Bangkok",
  "ho chi minh city": "Asia/Ho_Chi_Minh",
  "hanoi": "Asia/Ho_Chi_Minh",
  "kuala lumpur": "Asia/Kuala_Lumpur",
  "jakarta": "Asia/Jakarta",
  "manila": "Asia/Manila",
  "melbourne": "Australia/Melbourne",
  "brisbane": "Australia/Brisbane",
  "perth": "Australia/Perth",
  "auckland": "Pacific/Auckland",
  "wellington": "Pacific/Auckland",
  "fiji": "Pacific/Fiji",
  "honolulu": "Pacific/Honolulu",
  "anchorage": "America/Anchorage",
  "denver": "America/Denver",
  "phoenix": "America/Phoenix",
  "dallas": "America/Chicago",
  "houston": "America/Chicago",
  "atlanta": "America/New_York",
  "philadelphia": "America/New_York",
  "washington dc": "America/New_York",
  "charlotte": "America/New_York",
  "orlando": "America/New_York",
  "nashville": "America/Chicago",
  "new orleans": "America/Chicago",
  "st. louis": "America/Chicago",
  "minneapolis": "America/Chicago",
  "salt lake city": "America/Salt_Lake_City", // Corrected for Salt Lake City
  "san diego": "America/Los_Angeles",
  "portland": "America/Los_Angeles",
  "las vegas": "America/Los_Angeles",
  "calgary": "America/Edmonton",
  "edmonton": "America/Edmonton",
  "winnipeg": "America/Winnipeg",
  "montreal": "America/Toronto",
  "quebec city": "America/Toronto",
  "halifax": "America/Halifax",
  "reykjavik": "Atlantic/Reykjavik",
  "nairobi": "Africa/Nairobi",
  "lagos": "Africa/Lagos",
  "accra": "Africa/Accra",
  "dakar": "Africa/Dakar",
  "casablanca": "Africa/Casablanca",
  "algiers": "Africa/Algiers",
  "tunis": "Africa/Tunis",
  "tripoli": "Africa/Tripoli",
  "baghdad": "Asia/Baghdad",
  "riyadh": "Asia/Riyadh",
  "doha": "Asia/Qatar",
  "abu dhabi": "Asia/Dubai",
  "muscat": "Asia/Muscat",
  "kuwait city": "Asia/Kuwait",
  "manama": "Asia/Bahrain",
  "tel aviv": "Asia/Jerusalem",
  "jerusalem": "Asia/Jerusalem",
  "beirut": "Asia/Beirut",
  "damascus": "Asia/Damascus",
  "san jose": "America/Los_Angeles", // Assuming CA, USA San Jose
  "san juan": "America/Puerto_Rico",
  "bogota": "America/Bogota",
  "lima": "America/Lima",
  "santiago": "America/Santiago",
  "buenos aires": "America/Argentina/Buenos_Aires",
  "montevideo": "America/Montevideo",
  "caracas": "America/Caracas",
  "quito": "America/Guayaquil",
  "la paz": "America/La_Paz",
  "asuncion": "America/Asuncion",
  "georgetown": "America/Guyana",
  "kingston": "America/Jamaica",
  "havana": "America/Havana",
  "port-au-prince": "America/Port-au-Prince",
  "santo domingo": "America/Santo_Domingo",
  "panama city": "America/Panama",
  "san salvador": "America/El_Salvador",
  "guatemala city": "America/Guatemala",
  "tegucigalpa": "America/Tegucigalpa",
  "managua": "America/Managua",
  "belmopan": "America/Belize",
  "nassau": "America/Nassau",
  "bridgetown": "America/Barbados",
  "castries": "America/St_Lucia",
  "port of spain": "America/Port_of_Spain",
  "paramaribo": "America/Paramaribo",
  "cayenne": "America/Cayenne",
  "nuuk": "America/Nuuk",
  "saint-pierre": "America/Miquelon",
  "funchal": "Atlantic/Madeira",
  "praia": "Atlantic/Cape_Verde",
  "abidjan": "Africa/Abidjan",
  "conakry": "Africa/Conakry",
  "monrovia": "Africa/Monrovia",
  "freetown": "Africa/Freetown",
  "bamako": "Africa/Bamako",
  "ouagadougou": "Africa/Ouagadougou",
  "niamey": "Africa/Niamey",
  "n'djamena": "Africa/Ndjamena",
  "khartoum": "Africa/Khartoum",
  "addis ababa": "Africa/Addis_Ababa",
  "dar es salaam": "Africa/Dar_es_Salaam",
  "kampala": "Africa/Kampala",
  "kigali": "Africa/Kigali",
  "bujumbura": "Africa/Bujumbura",
  "lusaka": "Africa/Lusaka",
  "harare": "Africa/Harare",
  "gaborone": "Africa/Gaborone",
  "windhoek": "Africa/Windhoek",
  "luanda": "Africa/Luanda",
  "brazzaville": "Africa/Brazzaville",
  "kinshasa": "Africa/Kinshasa",
  "libreville": "Africa/Libreville",
  "yaounde": "Africa/Douala",
  "douala": "Africa/Douala",
  "bangui": "Africa/Bangui",
  "juba": "Africa/Juba",
  "porto-novo": "Africa/Porto-Novo",
  "lome": "Africa/Lome",
  "cotonou": "Africa/Porto-Novo",
  "malabo": "Africa/Malabo",
  "saudi arabia": "Asia/Riyadh",
  "united arab emirates": "Asia/Dubai",
  "qatar": "Asia/Qatar",
  "oman": "Asia/Muscat",
  "kuwait": "Asia/Kuwait",
  "bahrain": "Asia/Bahrain",
  "israel": "Asia/Jerusalem",
  "lebanon": "Asia/Beirut",
};

function _getLocalTimeForCity(city: string): string {
  const normalizedCity = city.toLowerCase();
  const timeZone = CITY_TIMEZONE_MAP[normalizedCity];

  if (!timeZone) {
    return `Sorry, I don't have specific time zone information for "${city}". Please try a major global city like Tokyo, London, or New York.`;
  }

  try {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone: timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    const localTime = new Intl.DateTimeFormat('en-US', options).format(now);
    return `The current local time in ${city} is ${localTime}.`;
  } catch (error) {
    console.error(`Error getting time for ${city} (${timeZone}):`, error);
    return `There was an error trying to get the time for ${city}.`;
  }
}

// 2. Define the 'tool' object for the AI SDK with the execute function
const getTimeForCityTool = {
  name: 'getTimeForCity',
  description: 'Get the current local time for a specified global city. Use this when the user asks about the current time in a city.',
  parameters: z.object({
    city: z.string().describe('The name of the city, e.g., "Tokyo", "London", "New York".'),
  }),
  execute: async ({ city }: { city: string }) => {
    console.log(`[Tool Call] getTimeForCity for city: ${city}`);
    const time = _getLocalTimeForCity(city);
    console.log(`[Tool Output] ${time}`);
    return time;
  },
};

export async function POST(req: Request) {
  try {
    console.log('API Route: Request received.');
    const { messages } = await req.json();
    console.log('API Route: Messages parsed:', JSON.stringify(messages));

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('API Route: GOOGLE_GENERATIVE_AI_API_KEY not found.');
      return new Response('Google API key not found. Please set GOOGLE_GENERATIVE_AI_API_KEY.', { status: 500 });
    }
    const model = google('models/gemini-1.5-flash');

    const systemMessage = {
      role: 'system',
      content: `You are an AI-powered travel assistant specializing in itinerary creation and providing helpful travel information.
      When asked to create an itinerary or plan a trip, generate a response structured with daily breakdowns.
      For each day, suggest activities, sights, and perhaps food recommendations.
      Use clear headings for days (e.g., "Day 1: Arrival and City Exploration") and markdown for formatting.
      Keep responses engaging and easy to read.
      If asked about booking flights, hotels, or other real-time services, always suggest looking up real-time availability on dedicated booking websites (e.g., Expedia, Booking.com, Google Flights).
      You have access to a tool to get the current time in specific cities. When the user asks about the current time in a city, you MUST use the 'getTimeForCity' tool. After successfully using the tool and receiving the result, you MUST then provide a clear, conversational answer to the user in natural language, directly stating the time you retrieved. Do NOT just output the tool result.`,
    };

    console.log('API Route: Calling streamText with tools and onError...');
    const result = await streamText({
      model: model,
      messages: [systemMessage, ...messages],
      temperature: 0.0,
      maxTokens: 1000,
      tools: { getTimeForCity: getTimeForCityTool },
      // Removed tool_choice: 'required' to allow the model to decide and then converse
      maxSteps: 5, // Allows the model to take multiple turns (e.g., tool call, then text generation)
      onError: (error) => {
        console.error('AI SDK streamText Error (from onError callback):', JSON.stringify(error, null, 2));
      },
    });

    // --- NEW DEBUGGING LOGGING ---
    console.log('API Route: Starting stream iteration for debugging...');
    let fullGeneratedText = '';
    for await (const delta of result.fullStream) {
      if (delta.type === 'text-delta') {
        fullGeneratedText += delta.textDelta;
        console.log(`[Stream Delta] Type: text-delta, Content: "${delta.textDelta}"`);
      } else if (delta.type === 'tool-call') {
        console.log(`[Stream Delta] Type: tool-call, Name: ${delta.toolName}, Args: ${JSON.stringify(delta.args)}`);
      } else if (delta.type === 'tool-result') {
        console.log(`[Stream Delta] Type: tool-result, Name: ${delta.toolName}, Result: ${JSON.stringify(delta.result)}`);
      } else {
        console.log(`[Stream Delta] Other Type: ${delta.type}`);
      }
    }
    console.log('API Route: Stream iteration completed.');
    console.log('API Route: Full generated text from stream:', fullGeneratedText);
    // --- END NEW DEBUGGING LOGGING ---

    console.log('API Route: streamText call completed. Returning response.');
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Route: Caught an error during request processing (from catch block):', error);
    // Provide more detail in development mode
    if (process.env.NODE_ENV === 'development') {
      return new Response(`Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}



// app/api/chat/route.ts
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import * as z from 'zod';

export const dynamic = 'force-dynamic';

async function _getLocalTimeForCity(city: string): Promise<string> {
  // Use TIMEZONE_API_KEY as per your .env file
  const googleMapsApiKey = process.env.TIMEZONE_API_KEY;

  if (!googleMapsApiKey) {
    return "Error: Time Zone API key not configured on the server. Cannot get city time.";
  }

  try {
    // Step 1: Use Google Geocoding API to get Lat/Lon for the city
    console.log(`[Tool] Calling Google Geocoding API for city: ${city}`);
    const geocodingResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${googleMapsApiKey}`
    );

    if (!geocodingResponse.ok) {
      console.error(`Geocoding API error for ${city}: ${geocodingResponse.status} ${geocodingResponse.statusText}`);
      const errorBody = await geocodingResponse.text();
      return `Sorry, there was an issue finding "${city}" on the map. (Details: ${errorBody.substring(0, 100)})`;
    }

    const geocodingData = await geocodingResponse.json();

    if (geocodingData.status !== 'OK' || geocodingData.results.length === 0) {
      return `Sorry, I couldn't find a precise location for "${city}". Please try a more specific or common city name. Status: ${geocodingData.status}`;
    }

    const { lat, lng } = geocodingData.results[0].geometry.location;
    console.log(`[Tool] Geocoded ${city} to Lat: ${lat}, Lng: ${lng}`);

    // Step 2: Use Google Time Zone API with Lat/Lon
    console.log(`[Tool] Calling Google Time Zone API for Lat: ${lat}, Lng: ${lng}`);
    const timestamp = Math.floor(Date.now() / 1000); // Current UTC timestamp in seconds
    const timezoneResponse = await fetch(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${googleMapsApiKey}`
    );

    if (!timezoneResponse.ok) {
      console.error(`Time Zone API error for ${city}: ${timezoneResponse.status} ${timezoneResponse.statusText}`);
      const errorBody = await timezoneResponse.text();
      return `Sorry, there was an issue getting the time zone for "${city}". (Details: ${errorBody.substring(0, 100)})`;
    }

    const timezoneData = await timezoneResponse.json();

    if (timezoneData.status !== 'OK') {
      return `Sorry, I couldn't retrieve the time zone for "${city}". Status: ${timezoneData.status} - ${timezoneData.errorMessage || ''}`;
    }

    const timeZoneId = timezoneData.timeZoneId; // e.g., "America/New_York"
    console.log(`[Tool] Time Zone ID for ${city}: ${timeZoneId}`);

    // Step 3: Format the time using Intl.DateTimeFormat
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone: timeZoneId, // Use the retrieved timeZoneId
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    const localTime = new Intl.DateTimeFormat('en-US', options).format(now);
    return `The current local time in ${city} is ${localTime}.`;

  } catch (error) {
    console.error(`Error in _getLocalTimeForCity for ${city}:`, error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return `There was a network issue trying to connect to the time zone service. Please check your internet connection or try again later.`;
    }
    return `There was an unexpected error trying to get the time for ${city}.`;
  }
}

const getTimeForCityTool = {
  name: 'getTimeForCity',
  description: 'Get the current local time for a specified global city. Use this when the user asks about the current time in a city.',
  parameters: z.object({
    city: z.string().describe('The name of the city, e.g., "Tokyo", "London", "New York".'),
  }),
  execute: async ({ city }: { city: string }) => {
    console.log(`[Tool Call] getTimeForCity for city: ${city}`);
    const time = await _getLocalTimeForCity(city);
    console.log(`[Tool Output] ${time}`);
    return time;
  },
};

export async function POST(req: Request) {
  try {
    console.log('API Route: Request received.');
    const { messages } = await req.json();
    console.log('API Route: Messages parsed:', JSON.stringify(messages));

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('API Route: GOOGLE_GENERATIVE_AI_API_KEY not found.');
      return new Response('Google API key not found. Please set GOOGLE_GENERATIVE_AI_API_KEY.', { status: 500 });
    }
    
    // Check for TIMEZONE_API_KEY now
    if (!process.env.TIMEZONE_API_KEY) {
        console.error('API Route: TIMEZONE_API_KEY not found. Time zone tool will not function correctly.');
    }

    const model = google('models/gemini-1.5-flash');

    const systemMessage = {
      role: 'system',
      content: `You are an AI-powered travel assistant specializing in itinerary creation and providing helpful travel information.
      When asked to create an itinerary or plan a trip, generate a response structured with daily breakdowns.
      For each day, suggest activities, sights, and perhaps food recommendations.
      Use clear headings for days (e.g., "Day 1: Arrival and City Exploration") and markdown for formatting.
      Keep responses engaging and easy to read.
      If asked about booking flights, hotels, or other real-time services, always suggest looking up real-time availability on dedicated booking websites (e.g., Expedia, Booking.com, Google Flights).
      You have access to a tool to get the current time in specific cities. When the user asks about the current time in a city, you MUST use the 'getTimeForCity' tool. After successfully using the tool and receiving the result, you MUST then provide a clear, conversational answer to the user in natural language, directly stating the time you retrieved.`,
    };

    console.log('API Route: Calling streamText with tools...');
    const result = await streamText({
      model: model,
      messages: [systemMessage, ...messages],
      temperature: 0.0,
      maxTokens: 1000,
      tools: { getTimeForCity: getTimeForCityTool },
      maxSteps: 5,
      onError: (error) => {
        console.error('AI SDK streamText Error (from onError callback):', JSON.stringify(error, null, 2));
      },
    });

    console.log('API Route: streamText call completed. Returning response.');
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Route: Caught an error during request processing (from catch block):', error);
    if (process.env.NODE_ENV === 'development') {
      return new Response(`Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}



// app/api/chat/route.ts
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import * as z from 'zod';

export const dynamic = 'force-dynamic';

// Renamed from _getLocalTimeForCity for clarity, and adapted for direct use.
// This function now precisely matches the logic you provided.
async function getTimeForCity(cityName: string): Promise<string> { // Changed return type to string for direct use in tool output
  const apiKey = process.env.TIMEZONE_API_KEY; // Using your preferred env var name

  if (!apiKey) {
    console.error("getTimeForCity: TIMEZONE_API_KEY not configured.");
    return "Error: Time Zone API key not configured on the server. Cannot get city time.";
  }

  try {
    // 1. Geocoding
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${apiKey}`;
    console.log(`[Tool] Calling Google Geocoding API for city: ${cityName}`);

    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = await geocodingResponse.json();

    if (!geocodingResponse.ok || geocodingData.status !== 'OK') {
      const errorDetail = geocodingData.error_message || geocodingData.status;
      console.error(`Geocoding failed for ${cityName}: ${errorDetail}`);
      if (geocodingData.status === 'REQUEST_DENIED') {
        return `Sorry, I couldn't access location services for "${cityName}". There might be an issue with the API key or its permissions.`;
      }
      return `Sorry, I couldn't find a precise location for "${cityName}". Please try a more specific or common city name.`;
    }

    if (geocodingData.results.length === 0) {
        return `Sorry, I couldn't find a location for "${cityName}". It might be too obscure or spelled incorrectly.`;
    }

    const {
      lat,
      lng
    } = geocodingData.results[0].geometry.location;
    console.log(`[Tool] Geocoded ${cityName} to Lat: ${lat}, Lng: ${lng}`);

    // 2. Time Zone Identification
    const timestamp = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
    const timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`;
    console.log(`[Tool] Calling Google Time Zone API for Lat: ${lat}, Lng: ${lng}`);

    const timezoneResponse = await fetch(timezoneUrl);
    const timezoneData = await timezoneResponse.json();

    if (!timezoneResponse.ok || timezoneData.status !== 'OK') {
        const errorDetail = timezoneData.error_message || timezoneData.status;
        console.error(`Time Zone API failed for ${cityName}: ${errorDetail}`);
        if (timezoneData.status === 'REQUEST_DENIED') {
            return `Sorry, I couldn't access time zone services for "${cityName}". There might be an issue with the API key or its permissions.`;
        }
        return `Sorry, I couldn't determine the time zone for "${cityName}".`;
    }

    const timeZoneId = timezoneData.timeZoneId;
    console.log(`[Tool] Time Zone ID for ${cityName}: ${timeZoneId}`);

    // 3. Local Time Calculation
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Example: 10:30:00 PM
      timeZone: timeZoneId,
      weekday: 'short', // Mon, Tue, etc.
      month: 'short',   // Jan, Feb, etc.
      day: 'numeric',   // 1, 2, 3, etc.
    };
    const now = new Date(); // Use current date for formatting
    const localTime = new Intl.DateTimeFormat('en-US', options).format(now);

    return `The current local time in ${cityName} is ${localTime}.`;

  } catch (error) {
    console.error(`Error in getTimeForCity for ${cityName}:`, error);
    // Provide a more generic error if it's an unexpected fetch/network issue
    return `There was an unexpected error trying to get the time for ${cityName}.`;
  }
}

// 2. Define the 'tool' object for the AI SDK with the execute function
const getTimeForCityTool = {
  name: 'getTimeForCity',
  description: 'Get the current local time for a specified global city. Use this when the user asks about the current time in a city.',
  parameters: z.object({
    city: z.string().describe('The name of the city, e.g., "Tokyo", "London", "New York".'),
  }),
  execute: async ({ city }: { city: string }) => {
    console.log(`[Tool Call] getTimeForCity for city: ${city}`);
    const time = await getTimeForCity(city); // Call your new robust function
    console.log(`[Tool Output] ${time}`);
    return time;
  },
};

export async function POST(req: Request) {
  try {
    console.log('API Route: Request received.');
    const { messages } = await req.json();
    console.log('API Route: Messages parsed:', JSON.stringify(messages));

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('API Route: GOOGLE_GENERATIVE_AI_API_KEY not found.');
      return new Response('Google API key not found. Please set GOOGLE_GENERATIVE_AI_API_KEY.', { status: 500 });
    }
    
    if (!process.env.TIMEZONE_API_KEY) { // Check for your Maps/Time Zone API key
        console.error('API Route: TIMEZONE_API_KEY not found. Time zone tool will not function correctly.');
        // Optionally, return an error here if the tool is critical:
        // return new Response('Time Zone API key not found. Please set TIMEZONE_API_KEY.', { status: 500 });
    }

    const model = google('models/gemini-1.5-flash');

    const systemMessage = {
      role: 'system',
      content: `You are an AI-powered travel assistant specializing in itinerary creation and providing helpful travel information.
      When asked to create an itinerary or plan a trip, generate a response structured with daily breakdowns.
      For each day, suggest activities, sights, and perhaps food recommendations.
      Use clear headings for days (e.g., "Day 1: Arrival and City Exploration") and markdown for formatting.
      Keep responses engaging and easy to read.
      If asked about booking flights, hotels, or other real-time services, always suggest looking up real-time availability on dedicated booking websites (e.g., Expedia, Booking.com, Google Flights).
      You have access to a tool to get the current time in specific cities. When the user asks about the current time in a city, you MUST use the 'getTimeForCity' tool. After successfully using the tool and receiving the result, you MUST then provide a clear, conversational answer to the user in natural language, directly stating the time you retrieved.`,
    };

    console.log('API Route: Calling streamText with tools...');
    const result = await streamText({
      model: model,
      messages: [systemMessage, ...messages],
      temperature: 0.0,
      maxTokens: 1000,
      tools: { getTimeForCity: getTimeForCityTool },
      maxSteps: 5,
      onError: (error) => {
        console.error('AI SDK streamText Error (from onError callback):', JSON.stringify(error, null, 2));
      },
    });

    console.log('API Route: streamText call completed. Returning response.');
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Route: Caught an error during request processing (from catch block):', error);
    if (process.env.NODE_ENV === 'development') {
      return new Response(`Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}




*/
// app/api/chat/route.ts
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import * as z from 'zod';

export const dynamic = 'force-dynamic';

// --- Utility Functions ---

/**
 * Gets the current local time for a specified city using Google Geocoding and Time Zone APIs.
 * Requires TIMEZONE_API_KEY (which is a Google Maps Platform API key with Geocoding API and Time Zone API enabled).
 * @param cityName The name of the city.
 * @returns A string containing the current local time in the specified city, or an error message.
 */
async function getTimeForCity(cityName: string): Promise<string> {
    const apiKey = process.env.TIMEZONE_API_KEY;

    if (!apiKey) {
        console.error("getTimeForCity: TIMEZONE_API_KEY not configured.");
        return "Error: Time Zone API key not configured on the server. Cannot get city time.";
    }

    try {
        // Step 1: Use Google Geocoding API to get Lat/Lon for the city
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${apiKey}`;
        console.log(`[Tool] Calling Google Geocoding API for city: ${cityName}`);
        const geocodingResponse = await fetch(geocodingUrl);
        const geocodingData = await geocodingResponse.json();

        if (!geocodingResponse.ok || geocodingData.status !== 'OK') {
            const errorDetail = geocodingData.error_message || geocodingData.status;
            console.error(`Geocoding failed for ${cityName}: ${errorDetail}`);
            if (geocodingData.status === 'REQUEST_DENIED') {
                return `Sorry, I couldn't access location services for "${cityName}". There might be an issue with the API key or its permissions.`;
            }
            return `Sorry, I couldn't find a precise location for "${cityName}". Please try a more specific or common city name.`;
        }
        if (geocodingData.results.length === 0) {
            return `Sorry, I couldn't find a location for "${cityName}". It might be too obscure or spelled incorrectly.`;
        }

        const { lat, lng } = geocodingData.results[0].geometry.location;
        console.log(`[Tool] Geocoded ${cityName} to Lat: ${lat}, Lng: ${lng}`);

        // Step 2: Use Google Time Zone API with Lat/Lon
        const timestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp
        const timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`;
        console.log(`[Tool] Calling Google Time Zone API for Lat: ${lat}, Lng: ${lng}`);
        const timezoneResponse = await fetch(timezoneUrl);
        const timezoneData = await timezoneResponse.json();

        if (!timezoneResponse.ok || timezoneData.status !== 'OK') {
            const errorDetail = timezoneData.error_message || timezoneData.status;
            console.error(`Time Zone API failed for ${cityName}: ${errorDetail}`);
            if (timezoneData.status === 'REQUEST_DENIED') {
                return `Sorry, I couldn't access time zone services for "${cityName}". There might be an issue with the API key or its permissions.`;
            }
            return `Sorry, I couldn't determine the time zone for "${cityName}".`;
        }

        const timeZoneId = timezoneData.timeZoneId;
        console.log(`[Tool] Time Zone ID for ${cityName}: ${timeZoneId}`);

        // Step 3: Format the current time for the determined time zone
        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, // Use 12-hour format with AM/PM
            timeZone: timeZoneId,
            weekday: 'short', // e.g., "Mon"
            month: 'short',   // e.g., "Jan"
            day: 'numeric',   // e.g., "1"
        };
        const now = new Date();
        const localTime = new Intl.DateTimeFormat('en-US', options).format(now);
        return `The current local time in ${cityName} is ${localTime}.`;

    } catch (error) {
        console.error(`Error in getTimeForCity for ${cityName}:`, error);
        return `There was an unexpected error trying to get the time for ${cityName}.`;
    }
}

/**
 * Gets the current weather conditions for a specified city.
 * Uses Google Geocoding API (with TIMEZONE_API_KEY) for coordinates and OpenWeatherMap API (with OPENWEATHERMAP_API_KEY) for weather data.
 * @param cityName The name of the city.
 * @returns A string describing the current weather, or an error message.
 */
async function getWeatherForCity(cityName: string): Promise<string> {
    const googleMapsApiKey = process.env.TIMEZONE_API_KEY; // Reusing for Geocoding
    const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!googleMapsApiKey) {
        return "Error: Google Maps API key not configured for location services. Cannot get weather.";
    }
    if (!openWeatherMapApiKey) {
        return "Error: OpenWeatherMap API key not configured. Cannot get weather.";
    }

    try {
        // Step 1: Use Google Geocoding API to get Lat/Lon for the city
        console.log(`[Tool] Calling Google Geocoding API for weather for city: ${cityName}`);
        const geocodingResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${googleMapsApiKey}`
        );
        const geocodingData = await geocodingResponse.json();

        if (!geocodingResponse.ok || geocodingData.status !== 'OK' || geocodingData.results.length === 0) {
            const errorDetail = geocodingData.error_message || geocodingData.status;
            console.error(`Geocoding failed for weather in ${cityName}: ${errorDetail}`);
            if (geocodingData.status === 'REQUEST_DENIED') {
                return `Sorry, I couldn't access location services to find "${cityName}'s" weather. There might be an issue with the Google Maps API key or its permissions.`;
            }
            return `Sorry, I couldn't find "${cityName}" to get its weather. Please try a more specific or common city name.`;
        }

        const { lat, lng } = geocodingData.results[0].geometry.location;
        console.log(`[Tool] Geocoded ${cityName} for weather to Lat: ${lat}, Lng: ${lng}`);

        // Step 2: Use OpenWeatherMap API with Lat/Lon
        // Using 'units=imperial' for Fahrenheit, 'units=metric' for Celsius, 'units=standard' for Kelvin
        console.log(`[Tool] Calling OpenWeatherMap API for Lat: ${lat}, Lng: ${lng}`);
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${openWeatherMapApiKey}`
        );

        if (!weatherResponse.ok) {
            console.error(`OpenWeatherMap API error for ${cityName}: ${weatherResponse.status} ${weatherResponse.statusText}`);
            const errorBody = await weatherResponse.text();
            // OpenWeatherMap often returns an object with 'message' on error
            try {
                const errorJson = JSON.parse(errorBody);
                return `Sorry, there was an issue getting current weather for "${cityName}". (Details: ${errorJson.message || weatherResponse.statusText})`;
            } catch {
                return `Sorry, there was an issue getting current weather for "${cityName}". (Status: ${weatherResponse.status} ${weatherResponse.statusText})`;
            }
        }

        const weatherData = await weatherResponse.json();
        console.log(`[Tool] Weather Data for ${cityName}:`, weatherData);

        // Extract and round relevant weather data
        const temperature = Math.round(weatherData.main.temp); // Rounded to whole number
        const feelsLike = Math.round(weatherData.main.feels_like); // Rounded to whole number
        const description = weatherData.weather[0].description;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed; // in miles/hour if units=imperial

        return `The current weather in ${cityName} is ${description} with a temperature of ${temperature}°F (feels like ${feelsLike}°F). Humidity is ${humidity}% and wind speed is ${windSpeed} mph.`;

    } catch (error) {
        console.error(`Error in getWeatherForCity for ${cityName}:`, error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return `There was a network issue trying to connect to the current weather service. Please check your internet connection or try again later.`;
        }
        return `There was an unexpected error trying to get the current weather for ${cityName}.`;
    }
}

/**
 * Gets the weather forecast for a specified city for the next few days.
 * Uses Google Geocoding API (with TIMEZONE_API_KEY) for coordinates and OpenWeatherMap API (with OPENWEATHERMAP_API_KEY) for forecast data.
 * @param cityName The name of the city.
 * @returns A string describing the weather forecast, or an error message.
 */
async function getWeatherForecastForCity(cityName: string): Promise<string> {
    const googleMapsApiKey = process.env.TIMEZONE_API_KEY; // Reusing for Geocoding
    const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!googleMapsApiKey) {
        return "Error: Google Maps API key not configured for location services. Cannot get weather forecast.";
    }
    if (!openWeatherMapApiKey) {
        return "Error: OpenWeatherMap API key not configured. Cannot get weather forecast.";
    }

    try {
        // Step 1: Use Google Geocoding API to get Lat/Lon for the city
        console.log(`[Tool] Calling Google Geocoding API for forecast for city: ${cityName}`);
        const geocodingResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${googleMapsApiKey}`
        );
        const geocodingData = await geocodingResponse.json();

        if (!geocodingResponse.ok || geocodingData.status !== 'OK' || geocodingData.results.length === 0) {
            const errorDetail = geocodingData.error_message || geocodingData.status;
            console.error(`Geocoding failed for forecast in ${cityName}: ${errorDetail}`);
            if (geocodingData.status === 'REQUEST_DENIED') {
                return `Sorry, I couldn't access location services to find "${cityName}'s" forecast. There might be an issue with the Google Maps API key or its permissions.`;
            }
            return `Sorry, I couldn't find "${cityName}" to get its weather forecast. Please try a more specific or common city name.`;
        }

        const { lat, lng } = geocodingData.results[0].geometry.location;
        console.log(`[Tool] Geocoded ${cityName} for forecast to Lat: ${lat}, Lng: ${lng}`);

        // Step 2: Use OpenWeatherMap 5-day / 3-hour forecast API
        console.log(`[Tool] Calling OpenWeatherMap Forecast API for Lat: ${lat}, Lng: ${lng}`);
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=imperial&appid=${openWeatherMapApiKey}`
        );

        if (!forecastResponse.ok) {
            console.error(`OpenWeatherMap Forecast API error for ${cityName}: ${forecastResponse.status} ${forecastResponse.statusText}`);
            const errorBody = await forecastResponse.text();
            try {
                const errorJson = JSON.parse(errorBody);
                return `Sorry, there was an issue getting the weather forecast for "${cityName}". (Details: ${errorJson.message || forecastResponse.statusText})`;
            } catch {
                return `Sorry, there was an issue getting the weather forecast for "${cityName}". (Status: ${forecastResponse.status} ${forecastResponse.statusText})`;
            }
        }

        const forecastData = await forecastResponse.json();
        console.log(`[Tool] Forecast Data for ${cityName}:`, forecastData);

        if (!forecastData.list || forecastData.list.length === 0) {
            return `No forecast data available for ${cityName}.`;
        }

        const dailyForecasts: { [key: string]: { minTemp: number, maxTemp: number, descriptions: Set<string> } } = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of today

        // Aggregate forecast data by day
        for (const item of forecastData.list) {
            const date = new Date(item.dt * 1000); // dt is in seconds
            date.setHours(0, 0, 0, 0); // Normalize to start of the day

            // Only consider up to 5 full days from today (including today if available)
            if (date.getTime() < today.getTime()) continue;
            const dayDiff = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff > 4) continue; // Limit to current day + next 4 days (5 days total)

            const dayKey = date.toISOString().split('T')[0]; //YYYY-MM-DD

            if (!dailyForecasts[dayKey]) {
                dailyForecasts[dayKey] = {
                    minTemp: item.main.temp_min,
                    maxTemp: item.main.temp_max,
                    descriptions: new Set<string>(),
                };
            }
            dailyForecasts[dayKey].minTemp = Math.min(dailyForecasts[dayKey].minTemp, item.main.temp_min);
            dailyForecasts[dayKey].maxTemp = Math.max(dailyForecasts[dayKey].maxTemp, item.main.temp_max);
            dailyForecasts[dayKey].descriptions.add(item.weather[0].description);
        }

        let resultString = `Here's the weather forecast for ${cityName}:\n\n`;
        const sortedDates = Object.keys(dailyForecasts).sort();

        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };

        for (const dayKey of sortedDates) {
            const forecast = dailyForecasts[dayKey];
            const date = new Date(dayKey);
            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
            const descriptions = Array.from(forecast.descriptions).join(', ');

            resultString += `**${formattedDate}**: ${descriptions} with temperatures from ${Math.round(forecast.minTemp)}°F to ${Math.round(forecast.maxTemp)}°F.\n`;
        }

        return resultString;

    } catch (error) {
        console.error(`Error in getWeatherForecastForCity for ${cityName}:`, error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return `There was a network issue trying to connect to the weather forecast service. Please check your internet connection or try again later.`;
        }
        return `There was an unexpected error trying to get the weather forecast for ${cityName}.`;
    }
}

/**
 * Searches for points of interest or attractions in a specified city using Google Places API (New).
 * Requires TIMEZONE_API_KEY (Google Maps Platform API key with Geocoding API and Places API (New) enabled).
 * @param city The city name to search within.
 * @param query The specific search query (e.g., "museums", "restaurants", "Eiffel Tower").
 * @returns A string summarizing the found places, or an error message.
 */
async function searchPlacesOfInterest(city: string, query: string): Promise<string> {
    const apiKey = process.env.TIMEZONE_API_KEY; // Reusing the comprehensive Google Maps Platform API key

    if (!apiKey) {
        console.error("searchPlacesOfInterest: TIMEZONE_API_KEY not configured.");
        return "Error: Google Maps Platform API key not configured on the server. Cannot search for places.";
    }

    try {
        // Step 1: Geocode the city to get coordinates for locationBias (improves search relevance)
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;
        console.log(`[Tool] Calling Google Geocoding API for city for Places Search: ${city}`);
        const geocodingResponse = await fetch(geocodingUrl);
        const geocodingData = await geocodingResponse.json();

        if (!geocodingResponse.ok || geocodingData.status !== 'OK' || geocodingData.results.length === 0) {
            const errorDetail = geocodingData.error_message || geocodingData.status;
            console.error(`Geocoding failed for places search in ${city}: ${errorDetail}`);
            return `Sorry, I couldn't find a precise location for "${city}" to search for places. Please try a more specific city name.`;
        }

        const { lat, lng } = geocodingData.results[0].geometry.location;
        console.log(`[Tool] Geocoded ${city} to Lat: ${lat}, Lng: ${lng} for places search.`);

        // Step 2: Call Google Places API (New) searchText endpoint
        const placesApiUrl = `https://places.googleapis.com/v1/places:searchText`;
        console.log(`[Tool] Calling Google Places API (New) for query: "${query}" in ${city}`);

        const response = await fetch(placesApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey, // API Key is sent via this header for Places API (New)
                // 'X-Goog-FieldMask' is crucial to specify what data you want back
                // This reduces billing and improves performance by fetching only necessary fields.
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.editorialSummary,places.types,places.websiteUri'
            },
            body: JSON.stringify({
                textQuery: `${query} in ${city}`, // Combine city and query for best text search
                languageCode: 'en', // Optional: specify language
                locationBias: {
                    circle: {
                        center: { latitude: lat, longitude: lng },
                        radius: 50000 // 50 km radius around the city center (adjust as needed)
                    }
                },
                // You can add more parameters like rankPreference: 'POPULARITY' or 'DISTANCE'
                // For 'DISTANCE', locationRestriction/locationBias must be more precise (e.g., strict center)
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorDetail = data.error?.message || response.statusText;
            console.error(`Google Places API failed for "${query}" in ${city}: ${errorDetail}`);
            return `Sorry, I couldn't find any places for "${query}" in ${city}. (Details: ${errorDetail})`;
        }

        if (!data.places || data.places.length === 0) {
            return `I couldn't find any notable places matching "${query}" in ${city}.`;
        }

        let resultString = `Here are some places matching "${query}" in ${city}:\n\n`;
        const placesToShow = data.places.slice(0, 3); // Show top 3 results for brevity

        interface Place {
            displayName?: { text?: string };
            formattedAddress?: string;
            rating?: number;
            editorialSummary?: { text?: string };
            types?: string[];
            websiteUri?: string;
        }
        placesToShow.forEach((place: Place, index: number) => {
            resultString += `${index + 1}. **${place.displayName?.text || 'N/A'}**\n`;
            if (place.formattedAddress) {
                resultString += `   Address: ${place.formattedAddress}\n`;
            }
            if (place.rating) {
                resultString += `   Rating: ${place.rating} out of 5\n`;
            }
            if (place.editorialSummary?.text) {
                resultString += `   Summary: ${place.editorialSummary.text}\n`;
            }
            if (place.websiteUri) {
                resultString += `   Website: ${place.websiteUri}\n`;
            }
            resultString += `\n`;
        });

        return resultString;

    } catch (error) {
        console.error(`Error in searchPlacesOfInterest for "${query}" in ${city}:`, error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return `There was a network issue trying to connect to the places search service. Please check your internet connection or try again later.`;
        }
        return `There was an unexpected error trying to search for places in ${city}.`;
    }
}

/**
 * Searches for global events using SerpApi's Google Events API.
 * Requires SERPAPI_API_KEY configured.
 * @param query The specific search query for events (e.g., "music festival", "football game", "art show").
 * @param city Optional: The city name to narrow down the event search.
 * @param dateRange Optional: A human-readable date range (e.g., "today", "tomorrow", "this weekend", "next week", "this month", "next month").
 * @returns A string summarizing the found events, or an error message.
 */
async function searchGlobalEvents(query: string, city?: string, dateRange?: string): Promise<string> {
    const serpApiKey = process.env.SERPAPI_API_KEY;

    if (!serpApiKey) {
        console.error("searchGlobalEvents: SERPAPI_API_KEY not configured.");
        return "Error: SerpApi API key not configured on the server. Cannot search for global events.";
    }

    try {
        const baseUrl = 'https://serpapi.com/search';
        const params = new URLSearchParams();

        params.append('api_key', serpApiKey);
        params.append('engine', 'google_events');
        params.append('q', query); // Main query (e.g., "events", "concerts", "festivals")

        if (city) {
            params.append('location', city); // Narrow search to a city
        }

        // Map human-readable date ranges to SerpApi's htichips for Google Events
        const dateChipMap: { [key: string]: string } = {
            'today': 'date:today',
            'tomorrow': 'date:tomorrow',
            'this weekend': 'date:this_weekend',
            'next week': 'date:next_week',
            'this month': 'date:this_month',
            'next month': 'date:next_month',
        };

        const effectiveDateRange = dateRange ? dateRange.toLowerCase() : '';
        if (dateChipMap[effectiveDateRange]) {
            params.append('htichips', `event_chips:${dateChipMap[effectiveDateRange]}`);
        } else if (dateRange) { // Log unsupported date ranges but don't error out
             console.warn(`[Tool] Unsupported dateRange for SerpApi htichips: "${dateRange}"`);
             // For unsupported ranges, the query might still be broad enough for Google to interpret.
             // No 'htichips' means no specific date filter from SerpApi's side, relying on 'q'.
        }

        // Limit to a reasonable number of results for brevity
        params.append('num', '5');

        const url = `${baseUrl}?${params.toString()}`;
        console.log(`[Tool] Calling SerpApi Google Events API for query: "${query}" (City: "${city || 'any'}", Date: "${dateRange || 'any'}")`);
        
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            const errorDetail = data.error?.message || response.statusText;
            console.error(`SerpApi Google Events API failed for query "${query}" in ${city}: ${errorDetail}`);
            return `Sorry, I couldn't find any events for "${query}" in ${city || 'the specified location'}. (Details: ${errorDetail})`;
        }

        if (!data.events_results || data.events_results.length === 0) {
            let msg = `I couldn't find any events`;
            if (query && query !== 'events') msg += ` matching "${query}"`; // Don't repeat "events events"
            if (city) msg += ` in ${city}`;
            if (dateRange && dateChipMap[effectiveDateRange]) msg += ` for ${dateRange}`; // Only mention if it was a supported filter
            msg += `. Please try a different query or location.`;
            return msg;
        }

        let resultString = `Here are some events`;
        if (query && query !== 'events') resultString += ` matching "${query}"`;
        if (city) resultString += ` in ${city}`;
        if (dateRange && dateChipMap[effectiveDateRange]) resultString += ` for ${dateRange}`;
        resultString += `:\n\n`;

        const eventsToShow = data.events_results.slice(0, 3); // Show top 3 events for brevity

        interface SerpApiEvent {
            title?: string;
            address?: string[];
            starts_at?: string; // e.g., "Monday, June 24" or "7:00 PM"
            description?: string;
            link?: string;
            ticket_info?: {
                link?: string;
                source?: string;
            };
        }

        eventsToShow.forEach((event: SerpApiEvent, index: number) => {
            const eventName = event.title || 'N/A';
            const eventAddress = event.address ? event.address.join(', ') : 'Unknown location';
            const eventTime = event.starts_at ? new Date(event.starts_at).toLocaleString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
            }) : 'Unknown time';
            const eventDescription = event.description ? event.description.split('\n')[0].substring(0, 150) + (event.description.length > 150 ? '...' : '') : ''; // Shorten description
            const eventLink = event.link || event.ticket_info?.link || 'No URL available';

            resultString += `${index + 1}. **${eventName}**\n`;
            resultString += `   When: ${eventTime}\n`;
            resultString += `   Where: ${eventAddress}\n`;
            if (eventDescription) {
                resultString += `   Description: ${eventDescription}\n`;
            }
            if (eventLink && eventLink !== 'No URL available') {
                resultString += `   More Info: ${eventLink}\n`;
            }
            resultString += `\n`;
        });

        return resultString;

    } catch (error) {
        console.error(`Error in searchGlobalEvents for query "${query}" in ${city}:`, error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return `There was a network issue trying to connect to the event search service. Please check your internet connection or try again later.`;
        }
        return `There was an unexpected error trying to find global events.`;
    }
}

/**
 * Gets travel directions, estimated distance, and travel time between two specific locations.
 * Uses Google Maps Platform Directions API.
 * Requires Google Maps Platform API key with Directions API enabled (reusing TIMEZONE_API_KEY for simplicity).
 * @param origin The starting location (e.g., "Eiffel Tower", "Heathrow Airport").
 * @param destination The ending location (e.g., "Louvre Museum", "Central London").
 * @param mode The mode of transport ('driving', 'walking', 'bicycling', 'transit'). Defaults to 'driving'.
 * @param cityOrRegion Optional: Contextual city/region to help disambiguate locations.
 * @returns A string containing the directions summary and steps, or an error message.
 */
async function getTravelDirections(
    origin: string,
    destination: string,
    mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving',
    cityOrRegion?: string
): Promise<string> {
    const apiKey = process.env.TIMEZONE_API_KEY; // Reusing Google Maps Platform API key

    if (!apiKey) {
        return "Error: Google Maps Platform API key not configured. Cannot get directions.";
    }

    try {
        const params = new URLSearchParams();
        // Combine origin/destination with cityOrRegion if provided to make query more specific for Directions API
        const fullOrigin = cityOrRegion ? `${origin}, ${cityOrRegion}` : origin;
        const fullDestination = cityOrRegion ? `${destination}, ${cityOrRegion}` : destination;

        params.append('origin', fullOrigin);
        params.append('destination', fullDestination);
        params.append('mode', mode); // driving, walking, bicycling, transit
        params.append('key', apiKey);

        const url = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`;
        console.log(`[Tool] Calling Google Directions API for ${fullOrigin} to ${fullDestination} via ${mode}`);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || data.status !== 'OK') {
            const errorDetail = data.error_message || data.status;
            console.error(`Directions API failed for ${fullOrigin} to ${fullDestination}: ${errorDetail}`);
            if (data.status === 'ZERO_RESULTS') {
                return `Sorry, I couldn't find directions for ${origin} to ${destination} via ${mode}. The locations might be too far, or there might be no route available for that mode of transport. Please try being more specific or try a different mode.`;
            }
            if (data.status === 'REQUEST_DENIED') {
                 return `Sorry, I couldn't access directions services. There might be an issue with the Google Maps Platform API key or its permissions (ensure Directions API is enabled).`;
            }
            return `Sorry, there was an issue getting directions for ${origin} to ${destination}. (Details: ${errorDetail})`;
        }

        const route = data.routes[0];
        if (!route) {
            return `Sorry, I couldn't find a route from ${origin} to ${destination} via ${mode}.`;
        }

        const leg = route.legs[0]; // Assuming single leg for simple A-B directions
        const distance = leg.distance.text; // e.g., "1.5 km"
        const duration = leg.duration.text; // e.g., "5 mins"

        let resultString = `Directions from ${origin} to ${destination} by ${mode}:\n`;
        resultString += `Estimated distance: ${distance}\n`;
        resultString += `Estimated travel time: ${duration}\n\n`;

        resultString += `Steps:\n`;
        // Limit steps to first 5-7 for brevity in AI response
        interface DirectionStep {
            html_instructions: string;
            distance: { text: string };
        }
        leg.steps.slice(0, 7).forEach((step: DirectionStep, index: number) => {
            // Remove HTML tags from instructions (e.g., <b>)
            const instruction = step.html_instructions.replace(/<[^>]*>/g, '');
            resultString += `${index + 1}. ${instruction} (${step.distance.text})\n`;
        });
        if (leg.steps.length > 7) {
            resultString += `...and ${leg.steps.length - 7} more steps. For full detailed instructions, consider using a mapping app.\n`;
        }

        return resultString;

    } catch (error) {
        console.error(`Error in getTravelDirections for ${origin} to ${destination}:`, error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return `There was a network issue trying to connect to the directions service. Please check your internet connection or try again later.`;
        }
        return `There was an unexpected error trying to get directions.`;
    }
}


// --- Tool Definitions ---

const getTimeForCityTool = {
    name: 'getTimeForCity',
    description: 'Get the current local time for a specified global city. Use this when the user asks about the current time in a city.',
    parameters: z.object({
        city: z.string().describe('The name of the city, e.g., "Tokyo", "London", "New York".'),
    }),
    execute: async ({ city }: { city: string }) => {
        console.log(`[Tool Call] getTimeForCity for city: ${city}`);
        const time = await getTimeForCity(city);
        console.log(`[Tool Output] ${time}`);
        return time;
    },
};

const getWeatherForCityTool = {
    name: 'getWeatherForCity',
    description: 'Get the current weather conditions for a specified global city. Use this when the user asks about the current weather or temperature in a city.',
    parameters: z.object({
        city: z.string().describe('The name of the city, e.g., "Tokyo", "London", "New York".'),
    }),
    execute: async ({ city }: { city: string }) => {
        console.log(`[Tool Call] getWeatherForCity for city: ${city}`);
        const weather = await getWeatherForCity(city);
        console.log(`[Tool Output] ${weather}`);
        return weather;
    },
};

const getWeatherForecastForCityTool = {
    name: 'getWeatherForecastForCity',
    description: 'Get the multi-day weather forecast for a specified global city. Use this when the user asks for the "forecast", "weather for next week", or "weather outlook" for a city.',
    parameters: z.object({
        city: z.string().describe('The name of the city, e.g., "Tokyo", "London", "New York".'),
    }),
    execute: async ({ city }: { city: string }) => {
        console.log(`[Tool Call] getWeatherForecastForCity for city: ${city}`);
        const forecast = await getWeatherForecastForCity(city);
        console.log(`[Tool Output] ${forecast}`);
        return forecast;
    },
};

const searchPlacesOfInterestTool = {
    name: 'searchPlacesOfInterest',
    description: 'Find points of interest, attractions, or specific places in a given city. Use this when the user asks for things to see, do, or find in a city (e.g., "museums in Berlin", "best parks in London", "Eiffel Tower in Paris", "restaurants near me in New York").',
    parameters: z.object({
        city: z.string().describe('The name of the city for the search, e.g., "Paris", "London". This is required.'),
        query: z.string().describe('The specific search query for places, e.g., "museums", "restaurants", "parks", "historical sites", "famous landmarks", or a specific place name like "Louvre Museum". This is required.'),
    }),
    execute: async ({ city, query }: { city: string; query: string }) => {
        console.log(`[Tool Call] searchPlacesOfInterest for query: "${query}" in city: "${city}"`);
        const result = await searchPlacesOfInterest(city, query);
        console.log(`[Tool Output] ${result}`);
        return result;
    },
};

const searchGlobalEventsTool = {
    name: 'searchGlobalEvents',
    description: 'Find upcoming global events, concerts, festivals, sports, and other happenings using Google Events search. **This is the primary tool for all event searches.** It can be used for specific cities or broader queries, and works with date ranges like "today", "tomorrow", "this weekend", "next week", "this month", "next month".',
    parameters: z.object({
        query: z.string().describe('The specific type of event or general event query, e.g., "music festivals", "rock concerts", "football games", "food festivals", "art exhibitions", or simply "events". This is required.'),
        city: z.string().optional().describe('Optional: The name of the city or general location to narrow down the event search, e.g., "London", "Tokyo", "California".'),
        dateRange: z.string().optional().describe('Optional: A human-readable date range for the events, e.g., "today", "tomorrow", "this weekend", "next week", "this month", "next month".'),
    }),
    execute: async ({ query, city, dateRange }: { query: string; city?: string; dateRange?: string }) => {
        console.log(`[Tool Call] searchGlobalEvents for query: "${query}" (City: "${city || 'any'}", Date: "${dateRange || 'any'}")`);
        const result = await searchGlobalEvents(query, city, dateRange);
        console.log(`[Tool Output] ${result}`);
        return result;
    },
};

const getTravelDirectionsTool = {
    name: 'getTravelDirections',
    description: 'Get travel directions, estimated distance, and travel time between two specific locations, with an optional mode of transport (driving, walking, bicycling, transit). Use this when the user asks for "directions from X to Y", "how to get from A to B", "travel time between locations", or "public transport from/to specific places".',
    parameters: z.object({
        origin: z.string().describe('The starting location (e.g., "Eiffel Tower", "Heathrow Airport", "My hotel"). This should be as specific as possible.'),
        destination: z.string().describe('The ending location (e.g., "Louvre Museum", "Central London", "a restaurant"). This should be as specific as possible.'),
        mode: z.enum(['driving', 'walking', 'bicycling', 'transit']).optional().describe('Optional: The mode of transport. Choose "transit" for public transportation requests, "walking" for walking, "bicycling" for cycling, or "driving" for car travel. Defaults to "driving" if not specified and not implied otherwise.'),
        cityOrRegion: z.string().optional().describe('Optional: The city or region where the directions are needed (e.g., "Paris", "London"). Provide this to help disambiguate locations if they are generic (e.g., "Main Street").'),
    }),
    execute: async ({ origin, destination, mode, cityOrRegion }: { origin: string; destination: string; mode?: 'driving' | 'walking' | 'bicycling' | 'transit'; cityOrRegion?: string }) => {
        console.log(`[Tool Call] getTravelDirections from "${origin}" to "${destination}" via "${mode || 'default'}" in ${cityOrRegion || 'N/A'}`);
        
        const result = await getTravelDirections(origin, destination, mode, cityOrRegion);
        console.log(`[Tool Output] ${result}`);
        return result;
    },
};


// --- Main POST Function for AI Stream ---

export async function POST(req: Request) {
    try {
        console.log('API Route: Request received.');
        const { messages } = await req.json();
        console.log('API Route: Messages parsed:', JSON.stringify(messages));

        // --- Critical API Key Checks ---
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error('API Route: GOOGLE_GENERATIVE_AI_API_KEY not found.');
            return new Response('Google API key not found. Please set GOOGLE_GENERATIVE_AI_API_KEY.', { status: 500 });
        }
        // Informative warnings for other API keys, but don't stop the whole service if they're missing
        if (!process.env.TIMEZONE_API_KEY) {
            console.error('API Route: TIMEZONE_API_KEY not found. Time zone, Geocoding, Places, and Directions tools may not function correctly.');
        }
        if (!process.env.OPENWEATHERMAP_API_KEY) {
            console.error('API Route: OPENWEATHERMAP_API_KEY not found. Weather tools will not function correctly.');
        }
        if (!process.env.SERPAPI_API_KEY) {
            console.error('API Route: SERPAPI_API_KEY not found. Global event search tool (Google Events) will not function correctly.');
        }


        const model = google('models/gemini-1.5-flash');

        // --- Dynamic Current Date Injection ---
        const now = new Date();
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const currentDateString = dateFormatter.format(now);

        // --- System Message Definition (now includes dynamic date and updated tool preferences) ---
        const baseSystemMessageContent = `You are an AI-powered travel assistant specializing in itinerary creation and providing helpful travel information.
            When asked to create an itinerary or plan a trip, generate a response structured with daily breakdowns.
            For each day, suggest activities, sights, and perhaps food recommendations.
            Use clear headings for days (e.g., "Day 1: Arrival and City Exploration") and markdown for formatting.
            Keep responses engaging and easy to read.
            When creating an itinerary, proactively use your available tools (like weather forecasts, event searches, and place searches) to gather relevant information for the destination and dates, and seamlessly integrate this real-time data into your daily recommendations.
            If asked about booking flights, hotels, or other real-time services, always suggest looking up real-time availability on dedicated booking websites (e.g., Expedia, Booking.com, Google Flights).
            If you are unable to find information using your tools for specific queries (e.g., for very specific real-time schedules like professional sports games, or if a general search yields no results), or if the information retrieved is incomplete (such as missing exact dates or specific times for events), please provide a user-friendly explanation and advise the user to check authoritative external sources relevant to their query (e.g., official event websites, league/team websites, local venue sites, broader event listing platforms like Ticketmaster/Live Nation, local tourism boards, or dedicated sports news platforms like ESPN/MLB.com).
            You have access to tools to get current information:
            - 'getTimeForCity': Use this when the user asks about the current time in a city.
            - 'getWeatherForCity': Use this when the user asks about the current weather or temperature in a city.
            - 'getWeatherForecastForCity': Use this when the user asks for the "forecast", "weather for next week", or "weather outlook" for a city.
            - 'searchPlacesOfInterest': Use this when the user asks for attractions, points of interest, or specific types of places (like museums, parks, restaurants) in a city.
            - 'searchGlobalEvents': Find upcoming global events, concerts, festivals, sports, and other happenings using Google Events search. This is the primary tool for all event searches. It can be used for specific cities or broader queries, and works with date ranges like "today", "tomorrow", "this weekend", "next week", "this month", "next month".
            - 'getTravelDirections': Use this when the user asks for "directions from X to Y", "how to get from A to B", "travel time between locations", or "public transport from/to specific places". **When providing directions, you MUST clearly state the estimated distance and travel time.** Additionally, **you MUST provide the initial few steps of the journey directly in a clear, numbered list format** from the tool's output to give the user a preview of the route. After providing these summary directions, **you should then** advise the user to consult a dedicated mapping application for full, real-time navigation details.
            After successfully using a tool and receiving the result, you MUST then provide a clear, conversational, and factually precise answer to the user in natural language, directly stating the information you retrieved. Do NOT just output the raw tool result.`;

        const systemMessage = {
            role: 'system',
            content: `The current date is ${currentDateString}.\n\n${baseSystemMessageContent}`,
        };

        console.log('API Route: Calling streamText with tools...');
        const result = await streamText({
            model: model,
            messages: [systemMessage, ...messages], // Pass the dynamically created system message and user messages
            temperature: 0.0, // Set low for more deterministic tool use
            maxTokens: 1000,
            tools: {
                getTimeForCity: getTimeForCityTool,
                getWeatherForCity: getWeatherForCityTool,
                getWeatherForecastForCity: getWeatherForecastForCityTool,
                searchPlacesOfInterest: searchPlacesOfInterestTool,
                searchGlobalEvents: searchGlobalEventsTool,
                getTravelDirections: getTravelDirectionsTool, // <-- NEW TOOL ADDED HERE
            },
            maxSteps: 5, // Limit the number of tool calls the model can make in a single turn
            onError: (error) => {
                console.error('AI SDK streamText Error (from onError callback):', JSON.stringify(error, null, 2));
            },
        });

        console.log('API Route: streamText call completed. Returning response.');
        return result.toDataStreamResponse();
    } catch (error) {
        console.error('API Route: Caught an error during request processing (from catch block):', error);
        // Provide more detail in development mode, generic error in production
        if (process.env.NODE_ENV === 'development') {
            return new Response(`Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
        }
        return new Response('Internal Server Error', { status: 500 });
    }
}