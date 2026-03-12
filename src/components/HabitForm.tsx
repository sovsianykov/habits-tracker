"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { habitSchema, HabitInput } from "@/lib/validations";
import VoiceMicButton from "@/components/VoiceMicButton";

const HABIT_TEMPLATES = [
  { title: "Пойти за водой", description: "Принести воду" },
  { title: "Приготовить завтрак", description: "Утренний приём пищи" },
  { title: "Приготовить обед", description: "Дневной приём пищи" },
  { title: "Изучать JavaScript", description: "Практика программирования" },
  { title: "Слушать музыку", description: "Отдых под музыку" },
  { title: "Мыть посуду", description: "Уборка на кухне" },
  { title: "Убирать в комнате", description: "Поддержание порядка" },
  { title: "Учить английский", description: "Активное изучение языка" },
  { title: "Слушать английский фоном", description: "Пассивное восприятие языка" },
  { title: "Играть с детьми", description: "Время с детьми" },
  { title: "Гулять для здоровья", description: "Прогулка на свежем воздухе" },
  { title: "Работать", description: "Рабочие задачи" },
  { title: "Спать", description: "Ночной сон" },
  { title: "Дремать", description: "Дневной отдых" },
];

interface Props {
  habit?: { id: string; title: string; description: string | null };
  onClose?: () => void;
}

export default function HabitForm({ habit, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!habit;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: { title: habit?.title ?? "", description: habit?.description ?? "" },
  });

  function applyTemplate(template: { title: string; description: string }) {
    setValue("title", template.title);
    setValue("description", template.description);
  }

  async function onSubmit(data: HabitInput) {
    const url = isEdit ? `/api/habits/${habit.id}` : "/api/habits";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.refresh();
      onClose?.();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {!isEdit && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Шаблоны активностей:</p>
          <div className="flex flex-wrap gap-1.5">
            {HABIT_TEMPLATES.map((t) => (
              <button
                key={t.title}
                type="button"
                onClick={() => applyTemplate(t)}
                className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors border border-indigo-200"
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="relative">
          <input
            {...register("title")}
            className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Habit name (e.g. Reading)"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <VoiceMicButton onResult={(text) => setValue("title", text)} />
          </div>
        </div>
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <div className="relative">
          <textarea
            {...register("description")}
            rows={2}
            className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Description (optional)"
          />
          <div className="absolute right-2 top-2">
            <VoiceMicButton onResult={(text) => setValue("description", text)} />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add habit"}
        </button>
      </div>
    </form>
  );
}
