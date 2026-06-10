interface ProgressRowProps {
  label: string;
  value: number;
  color?: string;
  suffix?: string;
}

export default function ProgressRow({
  label,
  value,
  color = "bg-green-500",
  suffix = "%",
}: ProgressRowProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
        {label}
      </p>

      <div className="flex w-full max-w-[140px] items-center gap-3">
        <div className="relative block h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-800">
          <div
            className={`absolute left-0 top-0 h-full rounded-sm ${color}`}
            style={{ width: `${value}%` }}
          />
        </div>

        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
          {value}{suffix}
        </p>
      </div>
    </div>
  );
}