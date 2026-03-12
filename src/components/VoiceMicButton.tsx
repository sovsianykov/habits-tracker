"use client";

import { useVoiceInput } from "@/hooks/useVoiceInput";

interface Props {
  onResult: (text: string) => void;
  className?: string;
}

export default function VoiceMicButton({ onResult, className = "" }: Props) {
  const { isListening, isSupported, start, stop } = useVoiceInput();

  if (!isSupported) return null;

  function handleClick() {
    if (isListening) {
      stop();
    } else {
      start(onResult);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isListening ? "Stop recording" : "Speak to fill"}
      className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
        isListening
          ? "bg-red-500 text-white animate-pulse"
          : "bg-gray-100 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600"
      } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-3.5 h-3.5"
      >
        <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4Z" />
        <path d="M19 10a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V19H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.08A7 7 0 0 0 19 10Z" />
      </svg>
    </button>
  );
}
