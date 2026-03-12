"use client";

import { useState, useRef, useCallback, useMemo } from "react";

type UseVoiceInputReturn = {
  isListening: boolean;
  isSupported: boolean;
  start: (onResult: (text: string) => void) => void;
  stop: () => void;
};

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);

  const isSupported = useMemo(
    () =>
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
    []
  );

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const start = useCallback(
    (onResult: (text: string) => void) => {
      if (!isSupported) return;

      recognitionRef.current?.stop();

      const SpeechRecognition =
        window.SpeechRecognition ??
        (
          window as unknown as {
            webkitSpeechRecognition: typeof window.SpeechRecognition;
          }
        ).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = navigator.language || "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };
      recognition.onerror = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onresult = (event: Event) => {
        const e = event as SpeechRecognitionEvent;
        const transcript = e.results[0]?.[0]?.transcript ?? "";
        if (transcript) onResult(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [isSupported]
  );

  return { isListening, isSupported, start, stop };
}
