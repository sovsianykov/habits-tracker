"use client";

import { useState, useRef, useCallback } from "react";

type UseVoiceInputReturn = {
  isListening: boolean;
  isSupported: boolean;
  start: (onResult: (text: string) => void) => void;
  stop: () => void;
};

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback((onResult: (text: string) => void) => {
    if (!isSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) onResult(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported]);

  return { isListening, isSupported, start, stop };
}
