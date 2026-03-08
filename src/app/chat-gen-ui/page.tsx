"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useState } from "react";
import { filterFoodsByQuery } from "@/app/lib/utils/filterFoodsByQuery";

export default function Page() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, addToolOutput } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      console.log("toolCall", toolCall);
      console.log("messages", messages);
      if (toolCall.dynamic) return;
      if (toolCall.toolName === "getSearchResults") {
        const { query } = toolCall.input as { query: string };
        const response = await fetch("/api/get-food");
        const data = await response.json();
        const results = filterFoodsByQuery(data.foods, query);
        addToolOutput({
          tool: "getSearchResults",
          toolCallId: toolCall.toolCallId,
          output: { query, results },
        });
      }
    },
  });
  return (
    <div className="w-full h-full bg-white p-10 flex flex-col justify-center items-center gap-10">
      <div>
        {status === "streaming" && (
          <div className="rounded-2xl px-4 py-3 bg-(--foreground)/5 mr-auto max-w-[85%]">
            <span className="inline-block w-2 h-4 bg-(--foreground)/50 animate-pulse" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 mb-2 text-center">
            {error.message}
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl px-4 py-3 max-w-[85%] ${
              message.role === "user"
                ? "bg-(--foreground)/10 ml-auto"
                : "bg-(--foreground)/5 mr-auto"
            }`}
          >
            <p className="text-xs font-medium opacity-70 mb-1">
              {message.role === "user" ? "You" : "Assistant"}
            </p>
            <div className="whitespace-pre-wrap wrap-break-word">
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  return <span key={`${message.id}-${i}`}>{part.text}</span>;
                }
                return null;
              })}
            </div>
          </div>
        ))}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = input.trim();
            if (!text) return;
            sendMessage({ text });
            setInput("");
          }}
          className="w-full flex gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 rounded-2xl px-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 text-base resize-none outline-none max-h-[150px]"
          />
          <button
            type="submit"
            disabled={status === "streaming"}
            className="bg-(--foreground)/10 text-(--foreground)/50 px-4 py-2 rounded-2xl hover:bg-(--foreground)/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "streaming" ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
      <p className="text-2xl font-bold">Chat with Docket</p>
    </div>
  );
}
