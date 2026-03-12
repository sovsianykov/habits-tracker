"use client";

import { useState, useEffect, useRef } from "react";
import SessionForm from "@/components/SessionForm";

interface Props {
  habitId: string;
  habitTitle: string;
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function toLocalDatetimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function SessionTimer({ habitId, habitTitle }: Props) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const startRef = useRef<Date | null>(null);
  const endRef = useRef<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function start() {
    startRef.current = new Date();
    setElapsed(0);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
  }

  function stop() {
    endRef.current = new Date();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setShowForm(true);
  }

  if (showForm && startRef.current && endRef.current) {
    return (
      <div className="mt-3 p-3 bg-indigo-50 rounded-xl">
        <p className="text-sm font-medium text-indigo-800 mb-2">
          Log session for <span className="font-semibold">{habitTitle}</span>
        </p>
        <SessionForm
          habitId={habitId}
          initialStartTime={toLocalDatetimeValue(startRef.current)}
          initialEndTime={toLocalDatetimeValue(endRef.current)}
          onClose={() => {
            setShowForm(false);
            setElapsed(0);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mt-2">
      {running ? (
        <>
          <span className="text-lg font-mono font-semibold text-indigo-600 tabular-nums">
            {formatTime(elapsed)}
          </span>
          <button
            onClick={stop}
            className="px-4 py-1.5 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Stop
          </button>
        </>
      ) : (
        <button
          onClick={start}
          className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Start
        </button>
      )}
    </div>
  );
}
