"use client";

import { Check, X } from "lucide-react";

interface YesNoPromptProps {
  question: string;
  onYes: () => void;
  onNo: () => void;
  yesLabel?: string;
  noLabel?: string;
  isLoading?: boolean;
}

export default function YesNoPrompt({
  question,
  onYes,
  onNo,
  yesLabel = "Yes",
  noLabel = "No",
  isLoading = false,
}: YesNoPromptProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-5  w-[600px] mx-auto">
      <p className="text-gray-900 font-medium text-base mb-4">{question}</p>

      <div className="flex items-center gap-3">
        <button
          onClick={onNo}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <X size={16} />
          {noLabel}
        </button>

        <button
          onClick={onYes}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Check size={16} />
          {yesLabel}
        </button>
      </div>
    </div>
  );
}
