interface Props {
  percent: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function CircularProgress({ percent, size = 28, strokeWidth = 3, className = "" }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.15s ease-out" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{ fontSize: size * 0.32 }}
      >
        {clamped}%
      </span>
    </div>
  );
}
