"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatInput } from "./_components/ChatInput";
import { ChatHeader } from "./_components/ChatHeader";
import { ChatMessages } from "./_components/ChatMessages";
import { useChatStore } from "../store/store";

function ChatPage() {
  const [input, setInput] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasProcessedUrlMessage = useRef(false);
  const { messages: storedMessages, setMessages } = useChatStore();

  const { messages, sendMessage, status, error, addToolOutput } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    messages: storedMessages.length > 0 ? storedMessages : undefined,
  });

  // Sync messages to store whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      setMessages(messages);
    }
  }, [messages, setMessages]);

  useEffect(() => {
    const urlMessage = searchParams.get("message");
    if (urlMessage && !hasProcessedUrlMessage.current) {
      hasProcessedUrlMessage.current = true;
      sendMessage({ text: urlMessage });
      router.replace("/chat-gen-ui", { scroll: false });
    }
  }, [searchParams, sendMessage, router]);

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
        addToolOutput={addToolOutput}
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

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-gray-50">Loading...</div>}>
      <ChatPage />
    </Suspense>
  );
}
