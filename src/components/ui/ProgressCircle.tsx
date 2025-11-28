import React from "react";

interface ProgressCircleProps {
  progress: number; // 0 - 100
  taken: number;
  total: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ progress, taken, total }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (Math.max(0, Math.min(100, progress)) / 100) * circumference;

  return (
    <div className="bg-white p-4 rounded-3xl shadow-lg flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#60a5fa"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
      </svg>

      <p className="text-3xl font-bold mt-2">
        {taken}/{total}
      </p>
      <p className="text-gray-500 text-sm">Taken today</p>
    </div>
  );
};

export default ProgressCircle;
