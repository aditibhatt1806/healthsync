// frontend/screens/auth/SplashScreen.tsx
import React, { useEffect } from "react";

type Props = {
  onFinish?: () => void; // called after splash (optional)
};

export default function SplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const t = setTimeout(() => onFinish?.(), 1800);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
          <div className="text-pink-500 text-4xl font-bold">♥</div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">HealthSync</h1>
        <p className="text-white/90 text-lg">Your Health, Gamified</p>
      </div>
    </div>
  );
}
