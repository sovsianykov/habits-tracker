"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  startTime: z.string().min(1, "Required"),
  endTime: z.string().min(1, "Required"),
  notes: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  habitId: string;
  initialStartTime?: string;
  initialEndTime?: string;
  onClose?: () => void;
}

function toLocalDatetimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function SessionForm({ habitId, initialStartTime, initialEndTime, onClose }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: initialStartTime ?? toLocalDatetimeValue(new Date()),
      endTime: initialEndTime ?? toLocalDatetimeValue(new Date()),
    },
  });

  const startVal = watch("startTime");
  const endVal = watch("endTime");

  const durationMinutes =
    startVal && endVal
      ? Math.max(0, Math.round((new Date(endVal).getTime() - new Date(startVal).getTime()) / 60000))
      : 0;

  async function onSubmit(data: FormValues) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const duration = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));

    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        habitId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        duration,
        notes: data.notes || undefined,
      }),
    });

    if (res.ok) {
      router.refresh();
      onClose?.();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Start time</label>
          <input
            {...register("startTime")}
            type="datetime-local"
            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">End time</label>
          <input
            {...register("endTime")}
            type="datetime-local"
            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime.message}</p>}
        </div>
      </div>

      {durationMinutes > 0 && (
        <p className="text-sm text-indigo-600 font-medium">Duration: {durationMinutes} min</p>
      )}

      <div>
        <textarea
          {...register("notes")}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Notes (optional)"
        />
      </div>

      <div className="flex gap-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || durationMinutes <= 0}
          className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving…" : "Log session"}
        </button>
      </div>
    </form>
  );
}
