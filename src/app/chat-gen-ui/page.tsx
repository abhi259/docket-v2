"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";

export default function Page() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, addToolOutput } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      // console.log("toolCall", toolCall);
      // console.log("messages", messages);
      // if (toolCall.dynamic) return;
      // if (toolCall.toolName === "getSearchResults") {
      //   const { query } = toolCall.input as { query: string };
      //   const response = await fetch("/api/get-food");
      //   const data = await response.json();
      //   const results = filterFoodsByQuery(data.foods, query);
      //   addToolOutput({
      //     tool: "getSearchResults",
      //     toolCallId: toolCall.toolCallId,
      //     output: { query, results },
      //   });
      // }
    },
  });

  const handleSubmit = () => {
    const text = input.trim();
    if (!text || status === "streaming") return;
    sendMessage({ text });
    setInput("");
  };

  const isStreaming = status === "streaming";

  return (
    <div className="flex flex-col w-full  bg-gray-50">
      {/* Header */}
      <ChatHeader />

      {/* Messages Area */}
      <ChatMessages
        messages={messages}
        isStreaming={isStreaming}
        error={error}
      />

      {/* Input Area */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isStreaming={isStreaming}
      />
    </div>
  );
}
