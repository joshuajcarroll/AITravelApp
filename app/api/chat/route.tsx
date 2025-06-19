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

*/

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
      second: 'numeric',
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