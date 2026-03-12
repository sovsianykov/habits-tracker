interface Props {
  title: string;
  minutes: number;
  maxMinutes: number;
  color?: string;
}

export default function HabitProgressBar({ title, minutes, maxMinutes, color = "bg-indigo-500" }: Props) {
  const pct = maxMinutes > 0 ? Math.min(100, Math.round((minutes / maxMinutes) * 100)) : 0;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const label = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-800 truncate">{title}</span>
        <span className="text-gray-500 ml-2 shrink-0">{label}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
