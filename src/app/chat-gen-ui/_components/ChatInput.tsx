"use client";

import { useRef, useEffect } from "react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isStreaming,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <footer className="shrink-0 border-t border-gray-200 bg-white">
      <div className="w-full max-w-full px-4 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="relative flex items-end gap-3"
        >
          <div className="flex-1 relative flex items-center">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 text-[15px] resize-none outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              style={{ maxHeight: "150px" }}
            />
          </div>
          <button
            type="submit"
            disabled={isStreaming || !input.trim() || disabled}
            className="shrink-0 w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isStreaming ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-3">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </footer>
  );
}
