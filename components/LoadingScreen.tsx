import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const LOADING_TEXTS = [
  "Consulting the Great Plan...",
  "Summoning the Elector Counts...",
  "Consulting the Book of Grudges...",
  "Scrying the Winds of Magic...",
  "Sacrificing to the Dark Gods...",
  "Calculating Warpstone trajectories...",
  "Awakening the Slann...",
  "Mustering the Throng..."
];

const LoadingScreen: React.FC = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 rounded-full"></div>
        <Loader2 className="w-16 h-16 text-amber-500 animate-spin relative z-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-200 cinzel animate-pulse">
        {LOADING_TEXTS[textIndex]}
      </h2>
      <p className="text-slate-500 mt-4 text-sm">Analyzing your strategic profile...</p>
    </div>
  );
};

export default LoadingScreen;