"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HabitForm from "@/components/HabitForm";
import SessionTimer from "@/components/SessionTimer";

interface Habit {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  _count: { sessions: number };
}

interface Props {
  habits: Habit[];
}

export default function HabitsClient({ habits }: Props) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  async function deleteHabit(id: string) {
    if (!confirm("Delete this habit and all its sessions?")) return;
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Add habit toggle */}
      {showAdd ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">New habit</h3>
          <HabitForm onClose={() => setShowAdd(false)} />
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-2xl text-sm font-medium hover:bg-indigo-50 transition-colors"
        >
          + Add habit
        </button>
      )}

      {/* Habit list */}
      {habits.length === 0 && !showAdd && (
        <p className="text-sm text-gray-400 text-center py-8">No habits yet. Add one above!</p>
      )}

      {habits.map((habit) => (
        <div key={habit.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          {editId === habit.id ? (
            <HabitForm
              habit={habit}
              onClose={() => setEditId(null)}
            />
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800">{habit.title}</h3>
                  {habit.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{habit.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{habit._count.sessions} sessions</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditId(habit.id)}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <SessionTimer habitId={habit.id} habitTitle={habit.title} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
