// app/page.tsx
'use client'; // This directive makes this a Client Component

import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, task lists)

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold shadow-md">
        AI Travel Assistant
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-20"> {/* pb-20 to ensure space for input */}
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 mt-10">
            Start by asking me about your next adventure!
          </div>
        )}

        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md p-3 rounded-lg shadow-md ${
                m.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <strong className="capitalize">{m.role}: </strong>
              {/* Render markdown content */}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-center">
            <div className="p-3 rounded-lg shadow-md bg-gray-200 text-gray-700">
              AI is thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="p-3 rounded-lg shadow-md bg-red-100 text-red-700">
              Error: {error.message}. Please try again or check your API key.
            </div>
          </div>
        )}
      </main>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg flex items-center">
        <input
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          value={input}
          placeholder={isLoading ? "Generating response..." : "Ask me about travel..."}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isLoading || !input.trim()} // Disable if loading or input is empty
        >
          Send
        </button>
      </form>
    </div>
  );
}