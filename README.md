✈️ AI Travel Assistant
Welcome to the AI Travel Assistant! This is a full-stack web application designed to be your intelligent companion for planning trips and getting real-time travel information. Leveraging the power of large language models and a suite of external APIs, it can help you with everything from generating detailed itineraries to providing weather forecasts, finding local attractions, and even helping with visa information.

✨ Features
This application is built to provide a comprehensive travel planning experience through natural language interaction:

Intelligent Itinerary Creation:

Generates multi-day trip plans with daily breakdowns.

Suggests activities, sights, and food recommendations tailored to your destination and dates.

Proactively integrates real-time data (like weather forecasts and local events) into daily recommendations.

Dynamic Packing List Generator:

Creates comprehensive and categorized packing lists (Clothing, Toiletries, Electronics, Documents, Miscellaneous).

Utilizes real-time weather forecasts for your destination to provide context-aware packing suggestions.

Real-time Weather Information:

Provides current weather conditions for any global city.

Offers multi-day (up to 5-day) weather forecasts, including temperature ranges and descriptions.

Points of Interest Search:

Finds popular attractions, museums, parks, and other points of interest in a specified city.

Restaurant Finder:

Locates dining options in a specific area, with potential filters for cuisine, price, and open status.

Note: Does not handle reservations; advises users to contact restaurants directly.

Global Event Search:

Searches for upcoming events, concerts, festivals, sports games, and other happenings in cities or broader regions for specified date ranges.

Travel Directions:

Provides estimated distance, travel time, and initial step-by-step directions between two locations.

Note: Advises users to consult dedicated mapping applications for full, real-time navigation.

Currency Exchange Rate Converter:

Provides real-time exchange rates between different currencies.

Travel Advisories & Visa Information:

Offers warnings, advisories, entry requirements, and visa information for countries.

Intelligently asks for user nationality when required for accurate visa information.

Includes a disclaimer to verify information with official government sources.

Flight Search (Information Only):

Searches for flight options and prices between two locations for specified dates.

Crucially, the app does not handle flight bookings; it advises users to visit external booking websites for actual reservations.

User-Friendly Interface:

Clean, responsive chat interface built with React and Tailwind CSS.

Clear loading indicators and intuitive interaction elements.

🚀 Live Demo
Experience the AI Travel Assistant in action right now!

👉 https://ai-travel-app-lemon.vercel.app/ 👈


🛠️ Technologies Used
Frontend:

Next.js (React Framework for the Web)

React

Tailwind CSS (for styling)

@ai-sdk/react (for AI chat integration)

React Markdown & remark-gfm (for rendering markdown in chat responses)

@heroicons/react (for UI icons)

Backend (Next.js API Routes):

Google Generative AI (Gemini API for the core AI model)

@ai-sdk/google (AI SDK for Google models)

Zod (for schema validation in tool definitions)

External APIs (Tools):

Google Maps Platform APIs: (Geocoding, Places, Directions, Time Zone)

OpenWeatherMap API: (for current weather and forecasts)

Serper API: (Potentially used for Google Search results, depending on implementation for places/events/directions)

DeepL API: (for translation, if implemented over Google Translate)

ExchangeRate-API: (for currency exchange rates)

Travel Advisories API: (for travel warnings and visa info)

Deployment:

Vercel

⚙️ Local Development Setup
If you wish to run this application locally and explore its codebase, follow these steps.

Prerequisites
Node.js (v18 or higher recommended)

npm or Yarn

Git

1. Clone the Repository
git clone <your-repo-url>
cd ai-travel-app

2. Install Dependencies
npm install
# or
yarn install

3. Configure Environment Variables for Local Use
This application relies on several API keys for its functionality. You'll need to obtain these keys and set them up in a .env.local file in the root of your project.

Create a file named .env.local and add the following, replacing the placeholder values with your actual API keys:

# Google Generative AI (Gemini API) Key
GOOGLE_GENERATIVE_AI_API_KEY="YOUR_GEMINI_API_KEY"

# OpenWeatherMap API Key
OPENWEATHERMAP_API_KEY="YOUR_OPENWEATHERMAP_API_KEY"

# Google Maps Platform API Keys (ensure relevant APIs are enabled in your GCP project)
# You might use a single key for multiple Google Maps services if configured correctly in GCP
TIMEZONE_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_FOR_GEOCODING_TIMEZONE"
GOOGLE_PLACES_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_FOR_PLACES"
GOOGLE_EVENTS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_FOR_EVENTS" # If using Google Events API directly
GOOGLE_DIRECTIONS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_FOR_DIRECTIONS"

# Serper API Key (if you're using Serper for Google Search results for places/events/directions)
SERPAPI_API_KEY="YOUR_SERPAPI_API_KEY"

# DeepL API Key (if using DeepL for translation)
DEEPL_API_KEY="YOUR_DEEPL_API_KEY"

# ExchangeRate-API Key
EXCHANGERATE_API_KEY="YOUR_EXCHANGERATE_API_KEY"

# Travel Advisories API Key (e.g., from a service like Travel-Advisory-API or similar)
TRAVEL_ADVISORIES_API_KEY="YOUR_TRAVEL_ADVISORIES_API_KEY"

Important Notes on API Keys:

Google API Keys: You can manage all your Google API keys (Generative Language API, Maps Platform APIs) within a single Google Cloud project. Ensure you enable the necessary APIs (Generative Language API, Geocoding API, Places API, Directions API, etc.) in your Google Cloud project.

Quota Management: Be aware of the free-tier quotas for each API. The Gemini API often has a limit of 50 requests/day on the free tier. If you hit this, you may need to wait for the quota to reset or request an increase in the Google Cloud Console.

Security: Never commit your .env.local file to Git! It's already ignored by default in .gitignore.

4. Run the Development Server
npm run dev
# or
yarn dev

Open http://localhost:3000 in your browser to see the application.

💡 How to Use
Simply type your travel-related questions or requests into the chat input field. Here are some examples:

"Plan a 3-day trip to Paris for next month."

"What should I pack for a beach vacation in Miami next week?"

"What's the weather forecast for Tokyo for the next 5 days?"

"Find some Italian restaurants in Rome."

"Are there any concerts in London this weekend?"

"How do I get from the Eiffel Tower to the Louvre?"

"How many Euros are in 100 US Dollars?"

"Do American citizens need a visa for Russia?"

"Find flights from New York to Los Angeles for July 15th."

🚧 Challenges & Learnings
Developing this AI Travel Assistant presented several interesting challenges and learning opportunities:

API Key Management & Quotas: A significant challenge involved correctly configuring and managing multiple API keys across different services (Google, OpenWeatherMap, etc.) and understanding their respective free-tier quotas. Debugging 429 RESOURCE_EXHAUSTED errors on deployment required careful tracing of API key origins and quota limits in the Google Cloud Console.

AI Tool Calling (Function Calling): Precisely defining tool descriptions and instructing the AI model (via the system message) on when and how to use specific tools was crucial. Refining these instructions to ensure the AI correctly identifies user intent and invokes the right tool (e.g., distinguishing between current weather and forecast) required iterative prompt engineering.

Date & Timezone Handling: Accurately processing dates and times, especially when dealing with API responses that use UTC timestamps and presenting them in a user-friendly local format, proved to be a subtle but important detail, particularly for the weather forecast feature.

Frontend-Backend Communication: Seamlessly integrating the React frontend with Next.js API Routes for AI interaction and tool execution was a core aspect of building this full-stack application.

🔮 Future Improvements
Real-time Hotel & Flight Booking Integration: Explore more robust (potentially paid) APIs for live hotel availability and flight booking, or integrate with affiliate programs to provide more direct booking options.

User Authentication & Personalization: Allow users to save itineraries, preferences, and past trips.

Multi-modal Input: Enable voice input for a more natural conversational experience.

Advanced Itinerary Customization: Allow users to drag-and-drop activities, specify interests, and set budget preferences for itinerary generation.

Push Notifications: For real-time updates on flight changes, weather alerts, etc.

More Comprehensive Travel Advisories: Integrate with more detailed travel advisory sources.

Enhanced UI/UX: Further refine the visual design, add animations, and improve accessibility.

Thank you for checking out the AI Travel Assistant!
