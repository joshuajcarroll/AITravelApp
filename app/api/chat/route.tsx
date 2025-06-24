import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import * as z from 'zod';

export const dynamic = 'force-dynamic';

// --- Utility Functions ---

/**
 * Maps common language names to their DeepL compatible language codes.
 * This can be expanded as needed. DeepL generally uses ISO 639-1 codes.
 * Note: DeepL often uses broader categories for some languages (e.g., 'zh' for Chinese).
 */
const LANGUAGE_CODES_DEEPL: { [key: string]: string } = {
    'english': 'en',
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'italian': 'it',
    'portuguese': 'pt', // Portugal/Brazil distinctions might be like PT-PT, PT-BR
    'russian': 'ru',
    'japanese': 'ja',
    'chinese': 'zh', // Simplified Chinese
    'korean': 'ko',
    'arabic': 'ar',
    'hindi': 'hi',
    'dutch': 'nl',
    'greek': 'el',
    'turkish': 'tr',
    'ukrainian': 'uk', // DeepL supports Ukrainian
    'polish': 'pl',
    'swedish': 'sv',
    'norwegian': 'nb', // DeepL uses nb for Norwegian Bokmål generally
    'danish': 'da',
    'finnish': 'fi',
    'indonesian': 'id',
    'czech': 'cs',
    'slovak': 'sk',
    'bulgarian': 'bg',
    'estonian': 'et',
    'latvian': 'lv',
    'lithuanian': 'lt',
    'romanian': 'ro',
    'slovenian': 'sl',
    'hungarian': 'hu',
    // Always check DeepL's official documentation for their exact supported codes.
    // Example: https://www.deepl.com/docs-api/languages/
};

/**
 * Helper map for common currency names to ISO 4217 codes
 */
const CURRENCY_CODES: { [key: string]: string } = {
    "us dollar": "USD", "usd": "USD",
    "euro": "EUR", "eur": "EUR",
    "japanese yen": "JPY", "jpy": "JPY",
    "british pound": "GBP", "gbp": "GBP",
    "canadian dollar": "CAD", "cad": "CAD",
    "australian dollar": "AUD", "aud": "AUD",
    "swiss franc": "CHF", "chf": "CHF",
    "chinese yuan": "CNY", "cny": "CNY",
    "indian rupee": "INR", "inr": "INR",
    "brazilian real": "BRL", "brl": "BRL",
    "mexican peso": "MXN", "mxn": "MXN",
    // Add more as needed based on common user queries
    "singapore dollar": "SGD", "sgd": "SGD",
    "hong kong dollar": "HKD", "hkd": "HKD",
    "new zealand dollar": "NZD", "nzd": "NZD",
    "south african rand": "ZAR", "zar": "ZAR",
    "swedish krona": "SEK", "sek": "SEK",
    "norwegian krone": "NOK", "nok": "NOK",
    "danish krone": "DKK", "dkk": "DKK",
    "polish zloty": "PLN", "pln": "PLN",
    "turkish lira": "TRY", "try": "TRY",
    "russian ruble": "RUB", "rub": "RUB",
    "south korean won": "KRW", "krw": "KRW",
    "indonesian rupiah": "IDR", "idr": "IDR",
};

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
            } catch{
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
            } catch{
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
        leg.steps.slice(0, 7).forEach((step: { html_instructions: string; distance: { text: string } }, index: number) => {
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

/**
 * Translates a given text phrase from one language to another using DeepL API.
 * @param phrase The text to translate.
 * @param targetLanguage The language to translate into (e.g., "Russian", "ru").
 * @param sourceLanguage Optional: The original language of the phrase (e.g., "English", "en").
 * @returns The translated phrase, or an error message.
 */
async function translatePhrase(phrase: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey) {
        console.error("translatePhrase: DEEPL_API_KEY not configured.");
        return "Error: DeepL API key not configured. Cannot translate.";
    }

    // Determine DeepL API base URL based on key type (free vs. pro)
    // IMPORTANT: Based on your key starting with '1211' (common for DeepL Free API Keys that don't start with 'd2v')
    // We are explicitly pointing to the free endpoint. If you upgrade to a Pro key, you'll need to change this.
    const apiUrl = apiKey.startsWith('1211') // Use your key's prefix here, or just 'https://api-free.deepl.com/v2/translate' directly
        ? 'https://api-free.deepl.com/v2/translate'
        : 'https://api.deepl.com/v2/translate'; // Fallback for other non-d2v/1211 prefixes, likely Pro.

    // If you are certain your key is a FREE API Key, you can directly specify the free endpoint:
    // const apiUrl = 'https://api-free.deepl.com/v2/translate';


    // Convert targetLanguage name to DeepL compatible code
    const targetLangCode = LANGUAGE_CODES_DEEPL[targetLanguage.toLowerCase()] || targetLanguage.toUpperCase(); // DeepL often expects upper case for target
    // Convert sourceLanguage name to DeepL compatible code if provided
    const sourceLangCode = sourceLanguage ? (LANGUAGE_CODES_DEEPL[sourceLanguage.toLowerCase()] || sourceLanguage.toUpperCase()) : undefined;

    try {
        console.log(`[Tool] Calling DeepL API for phrase: "${phrase}" to ${targetLangCode} (from ${sourceLangCode || 'auto-detect'})`);

        const body: { text: string[]; target_lang: string; source_lang?: string; } = {
            text: [phrase],
            target_lang: targetLangCode,
        };
        if (sourceLangCode) {
            body.source_lang = sourceLangCode;
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorDetail = data.message || response.statusText;
            console.error(`DeepL API failed for "${phrase}" to ${targetLanguage}: ${errorDetail}`);
            if (response.status === 403) { // Forbidden - often API key issues
                 return `Sorry, there was an issue with the DeepL API key or its permissions. (Error: Authentication failed)`;
            }
            if (response.status === 400 && data.message && data.message.includes('target_lang')) {
                return `Sorry, "${targetLanguage}" might not be a supported target language for DeepL, or the code is incorrect.`;
            }
            if (response.status === 400 && data.message && data.message.includes('source_lang')) {
                return `Sorry, "${sourceLanguage}" might not be a supported source language for DeepL, or the code is incorrect.`;
            }
            return `Sorry, I couldn't translate that phrase. (Details: ${errorDetail})`;
        }

        if (!data.translations || data.translations.length === 0) {
            return `No translation found for "${phrase}".`;
        }

        const translatedText = data.translations[0].text;
        const detectedSourceLanguage = data.translations[0].detected_source_language;

        let resultString = `"${phrase}" translated into ${targetLanguage} is: "${translatedText}"`;
        if (!sourceLanguage && detectedSourceLanguage) {
            // Find human-readable name for detected language if possible
            const detectedLangName = Object.keys(LANGUAGE_CODES_DEEPL).find(key => LANGUAGE_CODES_DEEPL[key].toUpperCase() === detectedSourceLanguage.toUpperCase());
            if (detectedLangName) {
                resultString += ` (Detected original language: ${detectedLangName.charAt(0).toUpperCase() + detectedLangName.slice(1)})`;
            } else {
                resultString += ` (Detected original language code: ${detectedSourceLanguage})`;
            }
        }
        return resultString;

    } catch (error) {
        console.error(`Error in translatePhrase for "${phrase}" to ${targetLanguage}:`, error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return `There was a network issue trying to connect to the DeepL translation service. Please check your internet connection or try again later.`;
        }
        return `There was an unexpected error trying to translate the phrase.`;
    }
}

async function getCurrencyExchangeRate(fromCurrency: string, toCurrency: string, amount?: number): Promise<string> {
    const apiKey = process.env.EXCHANGERATE_API_KEY;

    if (!apiKey) {
        console.error("getCurrencyExchangeRate: EXCHANGERATE_API_KEY not configured.");
        return "Error: Currency exchange API key not configured. Cannot get exchange rate.";
    }

    // Normalize currency inputs to ISO codes
    const normalizedFromCurrency = CURRENCY_CODES[fromCurrency.toLowerCase()] || fromCurrency.toUpperCase();
    const normalizedToCurrency = CURRENCY_CODES[toCurrency.toLowerCase()] || toCurrency.toUpperCase();

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${normalizedFromCurrency}`);
        const data = await response.json();

        if (data.result === 'error') {
            if (data['error-type'] === 'unsupported-code') {
                return `Error: One of the currency codes (${fromCurrency} or ${toCurrency}) is not supported. Please check for typos or use standard ISO currency codes (e.g., USD, EUR).`;
            }
            console.error(`ExchangeRate-API Error: ${data['error-type']}`);
            return `Sorry, I encountered an error fetching currency data: ${data['error-type']}.`;
        }

        if (!data.conversion_rates || typeof data.conversion_rates[normalizedToCurrency] === 'undefined') {
            return `Sorry, I couldn't find an exchange rate for ${fromCurrency} to ${toCurrency}. Please ensure both are valid currencies.`;
        }

        const rate = data.conversion_rates[normalizedToCurrency];
        let result = `The current exchange rate from 1 ${normalizedFromCurrency} to ${normalizedToCurrency} is ${rate.toFixed(4)}.`;

        if (amount) {
            const convertedAmount = amount * rate;
            result += ` So, ${amount} ${normalizedFromCurrency} is approximately ${convertedAmount.toFixed(2)} ${normalizedToCurrency}.`;
        }

        return result;

    } catch (error) {
        console.error("Error fetching currency exchange rate:", error);
        return "Sorry, I couldn't fetch the currency exchange rate due to a network or API issue. Please try again later.";
    }
}

/**
 * Searches for travel advisories, entry requirements, and visa information for a specific destination.
 * Uses SerpApi's Google Search engine.
 * @param destinationCountry The country to search information for (e.g., "France", "Japan").
 * @param travelerNationality Optional: The nationality of the traveler for visa queries (e.g., "US citizen", "Australian").
 * @param queryType The specific type of information requested ('advisory', 'visa', 'general').
 * @returns A string summarizing the found information and a crucial disclaimer, or an error message.
 */
async function getTravelAdvisoriesAndVisaInfo(destinationCountry: string, travelerNationality?: string, queryType: 'advisory' | 'visa' | 'general' = 'general'): Promise<string> {
    const serpApiKey = process.env.SERPAPI_API_KEY;

    if (!serpApiKey) {
        console.error("getTravelAdvisoriesAndVisaInfo: SERPAPI_API_KEY not configured.");
        return "Error: SerpApi API key not configured. Cannot search for travel advisories or visa information.";
    }

    try {
        const baseUrl = 'https://serpapi.com/search';
        const params = new URLSearchParams();
        params.append('api_key', serpApiKey);
        params.append('engine', 'google'); // Use general Google Search

        let searchQuery: string;
        if (queryType === 'advisory') {
            searchQuery = `${travelerNationality ? travelerNationality + ' ' : ''}travel advisory for ${destinationCountry}`;
        } else if (queryType === 'visa') {
            searchQuery = `${travelerNationality ? travelerNationality + ' ' : ''}visa requirements for ${destinationCountry}`;
        } else {
            searchQuery = `travel information ${destinationCountry}`; // General query
        }

        params.append('q', searchQuery);
        params.append('num', '3'); // Get top 3 organic results for brevity

        const url = `${baseUrl}?${params.toString()}`;
        console.log(`[Tool] Calling SerpApi Google Search for travel info: "${searchQuery}"`);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            const errorDetail = data.error?.message || response.statusText;
            console.error(`SerpApi Google Search failed for travel advisories/visa: ${errorDetail}`);
            return `Sorry, I couldn't perform a search for travel advisories or visa information. (Details: ${errorDetail})`;
        }

        if (!data.organic_results || data.organic_results.length === 0) {
            return `I couldn't find specific information for "${searchQuery}". Please try refining your query or check official government websites directly.`;
        }

        let resultString = `Here's what I found regarding travel advisories and visa information for ${destinationCountry}:\n\n`;

        interface OrganicResult {
            title?: string;
            snippet?: string;
            link?: string;
        }

        data.organic_results.slice(0, 3).forEach((result: OrganicResult, index: number) => {
            resultString += `${index + 1}. **${result.title}**\n`;
            if (result.snippet) {
                resultString += `   Snippet: ${result.snippet}\n`;
            }
            if (result.link) {
                resultString += `   Link: ${result.link}\n`;
            }
            resultString += '\n';
        });

        // IMPORTANT: Add the crucial disclaimer about checking official sources
        resultString += `**IMPORTANT:** Travel advisories and visa requirements can change frequently and depend on your nationality. For the most accurate and up-to-date information, you MUST always check the official government website of your nationality's foreign affairs department (e.g., U.S. Department of State, Global Affairs Canada, UK Foreign, Commonwealth & Development Office) and the embassy or consulate of the destination country.`;

        return resultString;

    } catch (error) {
        console.error(`Error in getTravelAdvisoriesAndVisaInfo for "${destinationCountry}":`, error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return `There was a network issue trying to connect to the search service. Please check your internet connection or try again later.`;
        }
        return `Sorry, there was an unexpected error trying to fetch travel advisories or visa information.`;
    }
}

async function findRestaurants(
    location: string,
    cuisineType?: string,
    priceRange?: '$' | '$$' | '$$$' | '$$$$',
    minRating?: number,
    openNow?: boolean
): Promise<string> {
    const googlePlacesApiKey = process.env.TIMEZONE_API_KEY;

    if (!googlePlacesApiKey) {
        console.error("findRestaurants: GOOGLE_PLACES_API_KEY not configured.");
        return "Error: Google Places API key not configured. Cannot search for restaurants.";
    }

    try {
        const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
        const params = new URLSearchParams();

        params.append('key', googlePlacesApiKey);
        params.append('query', `${cuisineType || ''} restaurant in ${location}`); // Combine cuisine and location
        params.append('type', 'restaurant'); // Ensure we're searching for restaurants

        if (priceRange) {
            // Google Places API uses price_level (0-4), we need to map our $ to this
            const priceMap = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };
            const mappedPriceLevel = priceMap[priceRange as keyof typeof priceMap];
            if (mappedPriceLevel) {
                params.append('maxprice', mappedPriceLevel.toString()); // Max price level
                // For min price, if you wanted to implement a range:
                // params.append('minprice', (mappedPriceLevel - 1).toString());
            }
        }

        if (minRating) {
            // Google Places API doesn't directly support min_rating in text search,
            // but we can filter results after fetching if needed, or rely on sorting.
            // For now, we'll note it but not include in API call directly.
            console.warn("Google Places API textsearch does not directly support 'minRating' as a query parameter. Filtering will be done manually or rely on sorting.");
        }

        if (openNow) {
            params.append('opennow', 'true');
        }

        const url = `${baseUrl}?${params.toString()}`;
        console.log(`[Tool] Calling Google Places API for: ${url}`);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || data.status !== 'OK') {
            const errorDetail = data.error_message || data.status || response.statusText;
            console.error(`Google Places API failed for ${location}: ${errorDetail}`);
            return `Sorry, I couldn't find restaurant information for ${location}. (Details: ${errorDetail})`;
        }

        if (!data.results || data.results.length === 0) {
            return `I couldn't find any restaurants matching your criteria in ${location}.`;
        }

        let resultString = `Here are some restaurants in ${location}`;
        if (cuisineType) resultString += ` for ${cuisineType} cuisine`;
        resultString += `:\n\n`;

        // Define a type for restaurant results from Google Places API
        interface RestaurantResult {
            name: string;
            formatted_address: string;
            rating?: number;
            user_ratings_total?: number;
            price_level?: number;
            opening_hours?: { open_now?: boolean };
            plus_code?: { compound_code?: string };
            place_id?: string;
        }

        // Filter by minRating manually as it's not a direct API parameter for textsearch
        const filteredResults = minRating
            ? (data.results as RestaurantResult[]).filter((r) => r.rating !== undefined && r.rating >= minRating)
            : (data.results as RestaurantResult[]);

        filteredResults.slice(0, 3).forEach((place: RestaurantResult, index: number) => { // Show top 3 results
            resultString += `${index + 1}. **${place.name}**\n`;
            resultString += `   Address: ${place.formatted_address}\n`;
            if (place.rating) resultString += `   Rating: ${place.rating}/5 (${place.user_ratings_total || 0} reviews)\n`;
            if (place.price_level !== undefined) {
                const priceMap = { 0: 'Free', 1: '$', 2: '$$', 3: '$$$', 4: '$$$$' };
                resultString += `   Price Level: ${priceMap[place.price_level as keyof typeof priceMap] || 'N/A'}\n`;
            }
            if (place.opening_hours?.open_now !== undefined) {
                resultString += `   Status: ${place.opening_hours.open_now ? 'Open Now' : 'Closed'}\n`;
            }
            if (place.plus_code?.compound_code) {
                // Example of a link to Google Maps
                resultString += `   More Info: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}\n\n`;
            } else {
                 resultString += `   More Info: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.formatted_address)}\n\n`;
            }
        });

        resultString += `Remember to verify current opening hours and make reservations directly with the restaurant.`;
        
        return resultString;

    } catch (error) {
        console.error(`Error in findRestaurants for ${location}:`, error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return `There was a network issue trying to connect to the restaurant search service. Please check your internet connection or try again later.`;
        }
        return `There was an unexpected error trying to find restaurants.`;
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
    description: 'Get travel directions, estimated distance, and travel time between two specific locations, with an optional mode of transport (driving, walking, bicycling, transit). Use this when the user asks for "directions from X to Y", "how to get from A to B", "travel time between locations", or "public transport from/to specific places". When providing directions, you MUST clearly state the estimated distance and travel time. Additionally, you MUST provide the initial few steps of the journey directly in a clear, numbered list format from the tool\'s output to give the user a preview of the route. After providing these summary directions, you should then advise the user to consult a dedicated mapping application for full, real-time navigation details.',
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

const translatePhraseTool = {
    name: 'translatePhrase',
    description: 'Translates a given text phrase from one language to another. Use this when the user asks to "translate" a phrase or word from one language to another, or asks "how to say X in Y language".',
    parameters: z.object({
        phrase: z.string().describe('The text phrase to be translated.'),
        targetLanguage: z.string().describe('The language to translate the phrase into (e.g., "Russian", "French", "Japanese", "Spanish", or language codes like "ru", "fr", "ja", "es").'),
        sourceLanguage: z.string().optional().describe('Optional: The original language of the phrase if known (e.g., "English", "German", or language codes like "en", "de"). If not provided, the tool will attempt to detect it.'),
    }),
    execute: async ({ phrase, targetLanguage, sourceLanguage }: { phrase: string; targetLanguage: string; sourceLanguage?: string }) => {
        console.log(`[Tool Call] translatePhrase: "${phrase}" to ${targetLanguage} (from ${sourceLanguage || 'auto-detect'})`);
        const result = await translatePhrase(phrase, targetLanguage, sourceLanguage);
        console.log(`[Tool Output] ${result}`);
        return result;
    },
};

const getCurrencyExchangeRateTool = {
    name: 'getCurrencyExchangeRate',
    description: 'Gets the current exchange rate between two specified currencies or converts a specified amount from one currency to another. Use ISO 4217 codes (e.g., USD, EUR, JPY) or common currency names (e.g., "US Dollar", "Euro").',
    parameters: z.object({
        fromCurrency: z.string().describe('The currency code or common name to convert from (e.g., "USD", "US Dollar", "Euro").'),
        toCurrency: z.string().describe('The currency code or common name to convert to (e.g., "JPY", "Japanese Yen", "British Pound").'),
        amount: z.number().optional().describe('Optional: The amount of the "from" currency to convert. If not provided, only the exchange rate is returned.'),
    }),
    execute: async ({ fromCurrency, toCurrency, amount }: { fromCurrency: string; toCurrency: string; amount?: number }) => {
        console.log(`[Tool Call] getCurrencyExchangeRate: from ${fromCurrency} to ${toCurrency} amount ${amount || 'rate only'}`);
        const result = await getCurrencyExchangeRate(fromCurrency, toCurrency, amount);
        console.log(`[Tool Output] ${result}`);
        return result;
    },
};

const getTravelAdvisoriesAndVisaInfoTool = {
    name: 'getTravelAdvisoriesAndVisaInfo',
    description: 'Searches for travel advisories, safety warnings, entry requirements, and visa information for a specific destination country. If asking about visa requirements, it\'s crucial to specify the traveler\'s nationality (e.g., "US citizen", "Australian"). This tool emphasizes checking official government sources for the most up-to-date and accurate information.',
    parameters: z.object({
        destinationCountry: z.string().describe('The destination country for which to find advisories or visa information (e.g., "France", "Japan", "Brazil").'),
        travelerNationality: z.string().optional().describe('Optional: The nationality or citizenship of the traveler for visa requirement queries (e.g., "US citizen", "Australian passport holder", "UK national"). Highly recommended for accuracy when asking about visas.'),
        queryType: z.enum(['advisory', 'visa', 'general']).default('general').describe('The specific type of information requested: "advisory" for safety warnings, "visa" for entry requirements, or "general" for broad travel info. Defaults to "general".'),
    }),
    execute: async ({ destinationCountry, travelerNationality, queryType }: { destinationCountry: string; travelerNationality?: string; queryType?: 'advisory' | 'visa' | 'general' }) => {
        console.log(`[Tool Call] getTravelAdvisoriesAndVisaInfo for ${destinationCountry}, nationality: ${travelerNationality || 'N/A'}, type: ${queryType}`);
        const result = await getTravelAdvisoriesAndVisaInfo(destinationCountry, travelerNationality, queryType);
        console.log(`[Tool Output] ${result}`);
        return result;
    },
};

const findRestaurantsTool = {
    name: 'findRestaurants',
    description: 'Searches for restaurants in a specified location with optional filters for cuisine, price range, minimum rating, and current operating status. Useful for finding dining options. Always advise users to verify current opening hours and make reservations directly.',
    parameters: z.object({
        location: z.string().describe('The city, neighborhood, or specific address to search for restaurants (e.g., "New York City", "Paris 7th Arrondissement", "near Eiffel Tower").'),
        cuisineType: z.string().optional().describe('Optional: The type of cuisine (e.g., "Italian", "Mexican", "Sushi", "Vegan").'),
        priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional().describe('Optional: The price range. "$" for inexpensive, "$$$$" for very expensive.'),
        minRating: z.number().min(1).max(5).optional().describe('Optional: The minimum average user rating (1.0 to 5.0).'),
        openNow: z.boolean().optional().describe('Optional: True if the restaurant should be currently open. Defaults to false (do not filter by open status).'),
    }),
    execute: async ({ location, cuisineType, priceRange, minRating, openNow }: { 
        location: string; 
        cuisineType?: string; 
        priceRange?: '$' | '$$' | '$$$' | '$$$$'; 
        minRating?: number; 
        openNow?: boolean; 
    }) => {
        // This will be our mock execution function, defined next
        return await findRestaurants(location, cuisineType, priceRange, minRating, openNow);
    },
};

// --- Main POST Function for AI Stream ---

export async function POST(req: Request) {
    try {
        console.log('API Route: Request received.');
        const { messages } = await req.json();
        console.log('API Route: Messages parsed:', JSON.stringify(messages));

        // --- Critical API Key Checks ---
        const missingApiKeys: string[] = [];
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            missingApiKeys.push('Google Generative AI API Key');
        }
        if (!process.env.TIMEZONE_API_KEY) {
            missingApiKeys.push('Google Maps Platform API Key (for Time Zone, Geocoding, Places, Directions)');
        }
        if (!process.env.OPENWEATHERMAP_API_KEY) {
            missingApiKeys.push('OpenWeatherMap API Key');
        }
        if (!process.env.SERPAPI_API_KEY) {
            missingApiKeys.push('SerpApi Key');
        }
        if (!process.env.DEEPL_API_KEY) {
            missingApiKeys.push('DeepL API Key');
        }
        if (!process.env.EXCHANGERATE_API_KEY) { // <-- ADDED FOR CURRENCY
            missingApiKeys.push('ExchangeRate-API Key'); // <-- ADDED FOR CURRENCY
        }

        if (missingApiKeys.length > 0) {
            const errorMessage = `API Route: The following essential API keys are not configured: ${missingApiKeys.join(', ')}. Please check your .env.local file. Some tools may not function correctly.`;
            console.error(errorMessage);
            // In a real application, you might want to return an error response here or disable affected tools.
            // For now, we'll let it proceed with warnings so other tools can still work if their keys are present.
            // return new Response(errorMessage, { status: 500 });
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
            When asked to generate a packing list, first try to identify the destination and the dates or duration of the trip.
          Then, proactively use the 'getWeatherForecastForCity' tool for the specified destination to gather weather information.
          Based on the weather forecast, the trip duration, and general travel common sense, generate a comprehensive and categorized packing list.
          Include categories like:
          - **Clothing & Footwear** (e.g., shirts, pants, underwear, socks, shoes, outerwear based on weather)
          - **Toiletries & Personal Care** (e.g., toothbrush, toothpaste, shampoo, sunscreen, medications)
          - **Electronics & Accessories** (e.g., phone, charger, power bank, adapter)
          - **Documents & Money** (e.g., passport, ID, tickets, credit cards, local currency)
          - **Miscellaneous** (e.g., reusable water bottle, small backpack, umbrella, sleep mask, snacks)
          Always remind the user that the list is a suggestion and should be customized to their personal needs and specific activities. If a specific activity is mentioned (e.g., "hiking," "beach trip"), include items relevant to that activity.
          If specific dates aren't provided for the packing list, assume a general trip or ask for clarification if the weather is highly variable.
            When creating an itinerary, proactively use your available tools (like weather forecasts, event searches, and place searches) to gather relevant information for the destination and dates, and seamlessly integrate this real-time data into your daily recommendations.
            If asked about booking flights, hotels, or other real-time services, always suggest looking up real-time availability on dedicated booking websites (e.g., Expedia, Booking.com, Google Flights).
            If you are unable to find information using your tools for specific queries (e.g., for very specific real-time schedules like professional sports games, or if a general search yields no results), or if the information retrieved is incomplete (such as missing exact dates or specific times for events), please provide a user-friendly explanation and advise the user to check authoritative external sources relevant to their query (e.g., official event websites, league/team websites, local venue sites, broader event listing platforms like Ticketmaster/Live Nation, local tourism boards, or dedicated sports news platforms like ESPN/MLB.com).
            When offering to find more information, make sure to phrase it in natural language. Crucially, you MUST NOT mention the names of your internal tools (like 'getWeatherForecastForCity' or 'searchGlobalEvents') or their technical parameters directly to the user.
            When asked about travel advisories, safety warnings, entry requirements, or visa information for a destination:
          - You MUST use the 'getTravelAdvisoriesAndVisaInfo' tool.
          - If the user asks specifically about **visa requirements** and they have **NOT** specified their nationality (e.g., "Do I need a visa for France?"), you MUST first ask them to provide their nationality or citizenship to give an accurate response. For example, "To provide accurate visa information, could you please tell me your nationality?". Do NOT attempt to use the tool for visa queries without explicit nationality.
          - Always include the strong disclaimer provided by the tool's output, emphasizing that they must check official government websites for the most current and accurate information, as rules can change frequently.
            You have access to tools to get current information:
            - 'getTimeForCity': Use this when the user asks about the current time in a city.
            - 'getWeatherForCity': Use this when the user asks about the current weather or temperature in a city.
            - 'getWeatherForecastForCity': Use this when the user asks for the "forecast", "weather for next week", or "weather outlook" for a city.
            - 'searchPlacesOfInterest': Use this when the user asks for attractions, points of interest, or specific types of places (like museums, parks, restaurants) in a city.
            - 'findRestaurants': Use this when the user asks to find restaurants, dining options, or places to eat in a specific location, optionally filtered by cuisine, price, or if they are currently open. You MUST advise the user to verify current opening hours and make reservations directly with the restaurant, as you cannot make reservations.**
            - 'searchGlobalEvents': Find upcoming global events, concerts, festivals, sports, and other happenings using Google Events search. This is the primary tool for all event searches. It can be used for specific cities or broader queries, and works with date ranges like "today", "tomorrow", "this weekend", "next week", "this month", "next month".
            - 'getTravelDirections': When providing directions, you MUST clearly state the estimated distance and travel time. Additionally, you MUST provide the initial few steps of the journey directly in a clear, numbered list format from the tool\'s output to give the user a preview of the route. After providing these summary directions, you should then advise the user to consult a dedicated mapping application for full, real-time navigation details.
            - 'translatePhrase': Use this when the user asks to "translate" a phrase or word from one language to another, or asks "how to say X in Y language".
            - 'getCurrencyExchangeRate': Use this when the user asks about currency exchange rates or wants to convert an amount between two currencies.
            - 'getTravelAdvisoriesAndVisaInfo': Use this when the user asks about travel warnings, advisories, entry requirements, or visa information for a country. Remember to ask for nationality if needed for visa queries.
            - 'searchFlights': Use this when the user asks to find flights, search for flight prices, or ask about flight options between two locations for specific dates. **Crucially, you cannot book flights. Only provide flight search results and advise the user to visit external booking websites (like Google Flights, Expedia, Kayak) for actual booking and real-time availability.**
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
                getTravelDirections: getTravelDirectionsTool,
                translatePhrase: translatePhraseTool,
                getCurrencyExchangeRate: getCurrencyExchangeRateTool, // <-- ADDED TOOL
                getTravelAdvisoriesAndVisaInfo: getTravelAdvisoriesAndVisaInfoTool,
                findRestaurants: findRestaurantsTool,
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