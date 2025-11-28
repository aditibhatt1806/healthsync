import React from "react";

interface SymptomSeverityBarsProps {
  severity: number; // 0 - 10 scale
}

const SymptomSeverityBars: React.FC<SymptomSeverityBarsProps> = ({ severity }) => {
  const clamped = Math.max(0, Math.min(10, Math.round(severity)));

  return (
    <div className="flex gap-1">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-6 rounded ${i < clamped ? "bg-purple-500" : "bg-purple-200"}`}
        />
      ))}
    </div>
  );
};

export default SymptomSeverityBars;
