"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [rotation, setRotation] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 4) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      router.push(`/chat-gen-ui?message=${encodeURIComponent(message)}`);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Gradient fade from transparent to semi-opaque - pointer-events-none allows clicks through */}
      <div className="absolute inset-0 bg-linear-to-t from-[#000000] via-[#000000]/50 to-transparent h-48 pointer-events-none" />

      {/* Chat input container */}
      <div className="relative flex justify-center pb-12 pt-8">
        {/* Rotating border wrapper */}
        <div className="relative w-full max-w-2xl mx-4 p-[2px] rounded-2xl overflow-hidden pointer-events-auto">
          {/* Rotating gradient border - only render on client to avoid hydration mismatch */}

          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `conic-gradient(from ${rotation}deg, #ff8c00, #ff8c00, transparent, transparent, #ff8c00, #ff8c00)`,
            }}
          />

          {/* Inner content container */}
          <div
            className={`relative flex items-end gap-3 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 transition-all duration-300 ease-out ${isFocused ? "shadow-amber-500/20" : ""}`}
          >
            {/* Sparkle icon */}
            <div className="flex items-center pl-4 pb-3.5">
              <Sparkles
                className={`w-5 h-5 transition-colors duration-300 ${
                  isFocused ? "text-amber-500" : "text-gray-400"
                }`}
              />
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className="flex-1 py-3.5 pr-2 bg-transparent text-gray-800 placeholder-gray-400 text-base resize-none outline-none max-h-[150px]"
            />

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={!message.trim()}
              className={`flex items-center justify-center w-10 h-10 mr-2 mb-2 rounded-xl transition-all duration-300 ease-out ${message.trim() ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 scale-100" : "bg-gray-100 text-gray-400 scale-95"}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
