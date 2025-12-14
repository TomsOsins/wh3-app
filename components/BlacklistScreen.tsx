import React, { useState } from 'react';
import { FACTIONS_LIST } from '../constants';
import { Ban, ShieldCheck, Skull } from 'lucide-react';

interface BlacklistScreenProps {
  onNext: (blacklisted: string[]) => void;
}

const BlacklistScreen: React.FC<BlacklistScreenProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleFaction = (faction: string) => {
    setSelected(prev => 
      prev.includes(faction) 
        ? prev.filter(f => f !== faction)
        : [...prev, faction]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-700 px-4">
      <div className="text-center mb-10 relative">
        <div className="inline-block border-b-2 border-red-900/50 pb-4 px-8">
            <h2 className="text-3xl md:text-5xl font-bold text-stone-200 mb-2 cinzel tracking-wide flex items-center justify-center gap-3">
            <Skull className="w-8 h-8 text-red-700" />
            The Book of Grudges
            <Skull className="w-8 h-8 text-red-700" />
            </h2>
            <p className="text-stone-500 uppercase tracking-widest text-sm font-bold">Exclusion Phase</p>
        </div>
        
        <p className="text-stone-400 max-w-2xl mx-auto mt-6 italic">
          "Strike out the names of those you refuse to command. The oracles will <span className="text-red-500 font-bold">never</span> suggest these factions."
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-12">
        {FACTIONS_LIST.map((faction) => {
          const isSelected = selected.includes(faction);
          return (
            <button
              key={faction}
              onClick={() => toggleFaction(faction)}
              className={`
                relative p-4 border transition-all duration-300 flex items-center justify-between group overflow-hidden
                ${isSelected 
                  ? 'bg-red-950/40 border-red-600 text-red-200 shadow-[inset_0_0_20px_rgba(220,38,38,0.2)]' 
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-orange-900 hover:text-orange-100 hover:bg-stone-900'}
              `}
            >
              {/* Scratch effect line when selected */}
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                    <div className="w-[120%] h-0.5 bg-red-600 transform -rotate-12 shadow-[0_0_5px_rgba(220,38,38,0.8)]"></div>
                </div>
              )}

              <span className={`font-cinzel font-bold text-xs md:text-sm relative z-10 transition-all ${isSelected ? 'opacity-50' : ''}`}>{faction}</span>
              {isSelected ? (
                <Ban className="w-4 h-4 text-red-500 relative z-10" />
              ) : (
                <div className="w-1.5 h-1.5 bg-stone-700 rotate-45 group-hover:bg-orange-600 transition-colors" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center pb-8">
        <button
          onClick={() => onNext(selected)}
          className={`
            group relative px-8 py-4 font-bold text-lg uppercase tracking-widest transition-all duration-300 flex items-center gap-3
            ${selected.length > 0 ? 'bg-red-900/20 border border-red-600 text-red-100 hover:bg-red-900/40' : 'bg-stone-900 border border-orange-700 text-orange-500 hover:bg-stone-800 hover:text-orange-200 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]'}
          `}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-50"></div>
          <ShieldCheck className={`w-5 h-5 ${selected.length > 0 ? 'text-red-500' : 'text-orange-500 group-hover:text-orange-200'}`} />
          <span className="relative z-10">
             {selected.length === 0 ? "I Fear No Enemy (Next)" : `Ban ${selected.length} Factions & Continue`}
          </span>
        </button>
      </div>
    </div>
  );
};

export default BlacklistScreen;