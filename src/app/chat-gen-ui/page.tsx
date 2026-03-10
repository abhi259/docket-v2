"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatInput } from "./_components/ChatInput";
import { ChatHeader } from "./_components/ChatHeader";
import { ChatMessages } from "./_components/ChatMessages";
import { useChatStore } from "../store/store";

const HUMAN_INPUT_TOOLS = ["askForComparison", "proceedToCheckout"];

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

  // console.log("messages", messages);

  const hasPendingHumanInputTool = useMemo(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "assistant") return false;

    return lastMessage.parts.some((part: any) => {
      if (!part.type?.startsWith("tool-")) return false;
      const toolName = part.type.replace("tool-", "");
      return (
        HUMAN_INPUT_TOOLS.includes(toolName) && part.state === "input-available"
      );
    });
  }, [messages]);

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
    if (!text || status === "streaming" || hasPendingHumanInputTool) return;
    sendMessage({ text });
    setInput("");
  };

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted" || status === "streaming";
  const isInputDisabled = isStreaming || hasPendingHumanInputTool;

  return (
    <div className="flex flex-col w-full  bg-gray-50">
      {/* Header */}
      <ChatHeader />

      {/* Messages Area */}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        error={error}
        addToolOutput={addToolOutput}
      />

      {/* Input Area */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isStreaming={isStreaming}
        disabled={isInputDisabled || isLoading}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          Loading...
        </div>
      }
    >
      <ChatPage />
    </Suspense>
  );
}
