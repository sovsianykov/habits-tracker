export type { User, Habit, HabitSession } from "@/generated/prisma";

export interface HabitWithSessionCount {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  userId: string;
  _count: { sessions: number };
}

export interface SessionWithHabit {
  id: string;
  habitId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  notes: string | null;
  createdAt: Date;
  habit: { id: string; title: string };
}

export interface HabitStats {
  habitId: string;
  habitTitle: string;
  totalMinutes: number;
}

export interface DailyActivity {
  date: string;
  totalMinutes: number;
}
