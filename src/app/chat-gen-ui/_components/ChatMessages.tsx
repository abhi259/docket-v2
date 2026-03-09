"use client";

import { useRef, useEffect } from "react";
import type { UIMessage } from "@ai-sdk/react";
import WelcomeMessge from "./ChatMessagesComponents/WelcomeMessge";
import StreamIndicator from "./ChatMessagesComponents/StreamIndicator";
import ChatContent from "./ChatMessagesComponents/ChatContent";

interface ChatMessagesProps {
  messages: UIMessage[];
  isStreaming: boolean;
  error?: Error;
  addToolOutput: (output: {
    tool: string;
    toolCallId: string;
    output: any;
  }) => void;
}

export function ChatMessages({
  messages,
  isStreaming,
  error,
  addToolOutput,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="w-full max-w-full px-4 py-6">
        {messages.length === 0 ? (
          <WelcomeMessge />
        ) : (
          <div className="space-y-6">
            <ChatContent messages={messages} addToolOutput={addToolOutput} />

            {isStreaming && <StreamIndicator />}

            {/* Error message */}
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                  {error.message}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </main>
  );
}
