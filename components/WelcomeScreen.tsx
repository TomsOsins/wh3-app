import React from 'react';
import { Sword, Scroll, Skull } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in duration-1000">
      
      {/* Decorative Title Block */}
      <div className="relative mb-12 p-8 border-y-2 border-orange-900/50 bg-gradient-to-r from-transparent via-stone-900/80 to-transparent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <Skull className="w-8 h-8 text-orange-700" />
        </div>
        
        <div className="relative z-10">
          <Sword className="w-16 h-16 text-orange-600 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(234,88,12,0.4)]" />
          <h1 className="text-4xl md:text-7xl font-bold text-stone-100 mb-2 cinzel tracking-widest drop-shadow-lg uppercase">
            Warhammer III
          </h1>
          <h2 className="text-xl md:text-3xl text-orange-500 cinzel font-bold tracking-[0.3em] uppercase border-t border-orange-800/30 pt-4 mt-2 inline-block px-12">
            Faction Picker
          </h2>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto mb-16 relative">
        <div className="absolute -inset-4 bg-orange-900/5 blur-xl rounded-full"></div>
        <p className="relative text-lg md:text-xl text-stone-400 leading-relaxed font-light italic border-l-2 border-orange-800/50 pl-6">
          "The Old World is forged in war. Chaos gathers in the north, and empires crumble in the south. 
          Consult the Great Plan, General, and discover which banner you are destined to raise."
        </p>
      </div>
      
      <button
        onClick={onStart}
        className="group relative px-10 py-5 bg-stone-900 border border-orange-700 text-orange-500 font-bold text-xl uppercase tracking-widest hover:text-orange-100 transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(234,88,12,0.15)] hover:shadow-[0_0_40px_rgba(234,88,12,0.3)]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <span className="relative z-10 flex items-center gap-3">
          <Scroll className="w-6 h-6" />
          Begin the Ritual
          <Sword className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:translate-x-0 group-hover:ml-0" />
        </span>
        
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-orange-600"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-orange-600"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-orange-600"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-orange-600"></div>
      </button>
      
      <p className="mt-12 text-xs text-stone-600 font-serif tracking-wide uppercase opacity-60">
        Compatible with Immortal Empires
      </p>
    </div>
  );
};

export default WelcomeScreen;