"use client";

import { useState } from "react";

interface Session {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  notes: string | null;
  habit: { id: string; title: string };
}

interface Props {
  sessions: Session[];
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function DashboardCalendar({ sessions }: Props) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const sessionDates = sessions.map((s) => new Date(s.startTime));

  const selectedSessions = sessions.filter((s) => isSameDay(new Date(s.startTime), selected));
  const totalMinutes = selectedSessions.reduce((sum, s) => sum + s.duration, 0);

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          ‹
        </button>
        <span className="font-semibold text-gray-800">{MONTH_NAMES[month]} {year}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(year, month, day);
          const hasSessions = sessionDates.some((sd) => isSameDay(sd, date));
          const isSelected = isSameDay(date, selected);
          const isToday = isSameDay(date, today);

          return (
            <button
              key={i}
              onClick={() => setSelected(date)}
              className={`relative mx-auto w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors
                ${isSelected ? "bg-indigo-600 text-white font-semibold" : isToday ? "border-2 border-indigo-400 text-indigo-600 font-semibold" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {day}
              {hasSessions && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day sessions */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-semibold text-gray-800">
            {isSameDay(selected, today) ? "Today" : selected.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
          </h3>
          {totalMinutes > 0 && (
            <span className="text-sm text-indigo-600 font-medium">
              {Math.floor(totalMinutes / 60) > 0 ? `${Math.floor(totalMinutes / 60)}h ` : ""}{totalMinutes % 60}m total
            </span>
          )}
        </div>

        {selectedSessions.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No sessions on this day</p>
        ) : (
          <ul className="space-y-2">
            {selectedSessions.map((s) => (
              <li key={s.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-1.5 h-10 bg-indigo-400 rounded-full shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 text-sm truncate">{s.habit.title}</p>
                  <p className="text-xs text-gray-500">
                    {formatTime(new Date(s.startTime))} – {formatTime(new Date(s.endTime))} · {s.duration} min
                  </p>
                  {s.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{s.notes}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
