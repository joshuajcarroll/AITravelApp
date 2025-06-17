// app/page.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setInput } = useChat(); // Add setInput
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested starter prompts
  const starterPrompts = [
    "Suggest a budget-friendly destination for a solo traveler.",
    "What are the must-see sights in Paris?",
    "Tell me about local food in Thailand.",
    "How do I find cheap flights and hotels?",
    "What should I pack for a beach vacation?",
  ];

  // Handler for clicking a starter prompt button
  const handlePromptClick = (prompt: string) => {
    setInput(prompt); // Set the input field to the clicked prompt
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold shadow-md">
        AI Travel Assistant
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-700 mt-10">
            <p className="text-xl mb-4">Start by asking me about your next adventure!</p>
            <div className="flex flex-wrap justify-center gap-3">
              {starterPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-full border border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
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

        <div ref={messagesEndRef} />
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
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}