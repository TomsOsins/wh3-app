import React, { useMemo, useState, useRef, useEffect } from 'react';
import { RecommendationResult, StrategyGuide } from '../types';
import { RefreshCcw, Trophy, Target, Crown, Skull, ScrollText, Volume2, BookOpen, User, Play, Pause, Square, Loader2 } from 'lucide-react';
import RadarChart from './RadarChart';
import { getFactionTheme } from '../constants';
import { getStrategyGuide, generateAdvisorSpeech } from '../services/geminiService';

interface ResultsViewProps {
  result: RecommendationResult;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const theme = useMemo(() => getFactionTheme(result.primary.faction), [result.primary.faction]);
  
  // Strategy State
  const [strategy, setStrategy] = useState<StrategyGuide | null>(null);
  const [loadingStrategy, setLoadingStrategy] = useState(false);
  const strategyRef = useRef<HTMLDivElement>(null);

  // Audio State
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused'>('loading'); // Start loading immediately
  
  // Audio Refs for Web Audio API logic
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startedAtRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const hasAutoFetchedAudio = useRef(false);

  // --- Audio Logic ---

  // Helper: Decode Base64
  const decodeBase64 = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Helper: PCM to AudioBuffer
  const pcmToAudioBuffer = (data: Uint8Array, ctx: AudioContext) => {
    const numChannels = 1; 
    const sampleRate = 24000; // Gemini default
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  // 1. Pre-fetch audio on mount
  useEffect(() => {
    const fetchAudio = async () => {
      if (hasAutoFetchedAudio.current) return;
      hasAutoFetchedAudio.current = true;
      setAudioState('loading');

      try {
        // Initialize Context
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }

        const base64Audio = await generateAdvisorSpeech(result.roleplayIntro, result.primary.faction);
        const pcmBytes = decodeBase64(base64Audio);
        audioBufferRef.current = pcmToAudioBuffer(pcmBytes, audioContextRef.current);
        
        // Ready to play
        setAudioState('idle');
      } catch (e) {
        console.error("Audio pre-fetch failed", e);
        setAudioState('idle'); // Just revert to idle so user can try again manually if needed
      }
    };

    fetchAudio();

    // Cleanup on unmount
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [result]);

  const handlePlay = () => {
    const ctx = audioContextRef.current;
    if (!ctx || !audioBufferRef.current) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(ctx.destination);
    
    // Start from where we left off
    const offset = pausedAtRef.current;
    source.start(0, offset);
    
    // Track start time to calculate pause later
    startedAtRef.current = ctx.currentTime - offset;
    sourceNodeRef.current = source;
    
    setAudioState('playing');

    source.onended = () => {
        // Only reset if we reached the end naturally (not stopped manually)
        // We can check this by comparing currentTime, but for simplicity:
        // If we manually stop, we usually set state first.
        // We'll trust the state setters in the other functions to handle UI.
        // But natural end needs to reset.
        if (Math.abs(ctx.currentTime - startedAtRef.current - audioBufferRef.current!.duration) < 0.1) {
             handleStop();
        }
    };
  };

  const handlePause = () => {
    const ctx = audioContextRef.current;
    if (!ctx || !sourceNodeRef.current) return;

    const elapsed = ctx.currentTime - startedAtRef.current;
    sourceNodeRef.current.stop();
    sourceNodeRef.current = null;
    pausedAtRef.current = elapsed;
    
    setAudioState('paused');
  };

  const handleStop = () => {
    if (sourceNodeRef.current) {
      try {
          sourceNodeRef.current.stop();
      } catch(e) { 
          // ignore error if already stopped
      }
      sourceNodeRef.current = null;
    }
    pausedAtRef.current = 0;
    setAudioState('idle');
  };

  // --- Strategy Logic ---

  const fetchStrategy = async () => {
    if (strategy) {
        // If already exists, just scroll
        setTimeout(() => strategyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        return;
    }
    setLoadingStrategy(true);
    try {
      const guide = await getStrategyGuide(result.primary.lord, result.primary.faction);
      setStrategy(guide);
      // Auto-scroll after render
    } catch (e) {
      console.error(e);
    }
    setLoadingStrategy(false);
  };

  // Effect to auto-scroll when strategy is populated
  useEffect(() => {
    if (strategy && strategyRef.current) {
      // Small timeout to allow render
      setTimeout(() => {
        strategyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [strategy]);

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-1000 pb-20 relative">
      
      {/* 1. Lore Intro Section */}
      <div className="mb-12 text-center px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 opacity-20">
            <ScrollText className="w-32 h-32 text-stone-600" />
        </div>
        <h2 className="text-xs text-stone-500 uppercase tracking-[0.3em] mb-4 font-bold relative z-10">The Advisor Speaks</h2>
        <div className="max-w-4xl mx-auto p-4 md:p-6 relative z-10">
             <p className="text-lg md:text-xl text-stone-300 cinzel leading-relaxed italic">
            "{result.roleplayIntro}"
            </p>
            
            {/* Audio Controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
                {audioState === 'loading' ? (
                   <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" /> Preparing Voice...
                   </div>
                ) : (
                    <>
                        {audioState === 'playing' ? (
                            <button 
                                onClick={handlePause}
                                className="w-10 h-10 rounded-full border border-orange-700 bg-stone-900 text-orange-500 hover:bg-stone-800 flex items-center justify-center transition-all hover:scale-110"
                            >
                                <Pause className="w-4 h-4 fill-current" />
                            </button>
                        ) : (
                            <button 
                                onClick={handlePlay}
                                className="w-10 h-10 rounded-full border border-orange-700 bg-stone-900 text-orange-500 hover:bg-stone-800 flex items-center justify-center transition-all hover:scale-110"
                            >
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                            </button>
                        )}

                        <button 
                            onClick={handleStop}
                            disabled={audioState === 'idle'}
                            className="w-10 h-10 rounded-full border border-stone-700 bg-stone-900 text-stone-500 hover:text-red-500 hover:border-red-500 hover:bg-stone-800 flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:scale-100 disabled:hover:text-stone-500 disabled:hover:border-stone-700"
                        >
                            <Square className="w-3 h-3 fill-current" />
                        </button>

                        <div className="flex items-center gap-2 text-stone-600 text-[10px] uppercase tracking-widest font-bold ml-2">
                             <Volume2 className={`w-3 h-3 ${audioState === 'playing' ? 'text-orange-500 animate-pulse' : ''}`} />
                             {audioState === 'playing' ? "Speaking..." : audioState === 'paused' ? "Paused" : "Listen"}
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 mb-16 px-4">
        
        {/* LEFT COL: Stats & Nemesis */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
             {/* Radar Chart */}
            <div 
                className="bg-stone-900/80 border p-4 flex flex-col items-center justify-center relative overflow-hidden"
                style={{ borderColor: theme.accent }}
            >
                <RadarChart scores={result.scores} themeColor={theme.accent} />
            </div>

            {/* Nemesis Card */}
            <div className="bg-red-950/20 border border-red-900/50 p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs tracking-widest mb-3">
                        <Skull className="w-4 h-4" /> Natural Enemy
                    </div>
                    <h3 className="text-xl cinzel font-bold text-red-200 mb-2">{result.nemesis.faction}</h3>
                    <p className="text-sm text-red-300/80 leading-relaxed italic border-l-2 border-red-800 pl-3">
                        {result.nemesis.reason}
                    </p>
                </div>
            </div>
        </div>

        {/* CENTER COL: Main Recommendation */}
        <div className="lg:col-span-6 order-1 lg:order-2">
            <div 
                className={`relative rounded-sm border p-1 overflow-hidden shadow-2xl transition-all duration-1000 h-full`}
                style={{ 
                    borderColor: theme.accent, 
                    boxShadow: `0 0 50px -20px ${theme.glow}`
                }}
            >
                <div className={`relative h-full bg-gradient-to-b ${theme.gradient} p-8 md:p-10 flex flex-col`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none mix-blend-overlay">
                        <Crown className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 flex-grow">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest border bg-stone-950" style={{ borderColor: theme.accent, color: theme.accent }}>
                            Command Recommendation
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 cinzel tracking-tight drop-shadow-xl">
                            {result.primary.lord}
                        </h1>
                        <h3 className="text-xl md:text-2xl mb-6 cinzel font-bold tracking-wide uppercase flex items-center gap-3" style={{ color: theme.accent }}>
                        <Trophy className="w-6 h-6" /> {result.primary.faction}
                        </h3>
                        
                        <p className="text-stone-200 leading-relaxed mb-8 text-lg">
                            {result.primary.description}
                        </p>

                        {/* Unit Spotlight */}
                        <div className="mb-6">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" /> Key Units
                            </h4>
                            <div className="space-y-3">
                                {result.keyUnits.map((unit, idx) => (
                                    <div key={idx} className="bg-stone-950/40 border-l-2 p-3" style={{ borderColor: theme.accent }}>
                                        <h5 className="font-bold text-stone-200 text-sm mb-1">{unit.name}</h5>
                                        <p className="text-xs text-stone-400 italic">{unit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COL: Runner Ups & Strategy Trigger */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-3">
            <div className="bg-stone-900/40 border border-stone-800 p-4">
                <h3 className="text-stone-500 uppercase tracking-widest text-xs font-bold text-center mb-6">
                Alternative Commanders
                </h3>
                <div className="space-y-3">
                    {result.runnerUps.map((runner, idx) => (
                    <div key={idx} className="bg-stone-950 border border-stone-800 p-4 hover:border-stone-600 transition-colors group">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-stone-200 cinzel group-hover:text-orange-500 transition-colors text-sm">{runner.lord}</h4>
                        </div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-2">{runner.faction}</p>
                        <p className="text-xs text-stone-400 line-clamp-3 leading-relaxed border-t border-stone-900 pt-2 mt-2">{runner.reason}</p>
                    </div>
                    ))}
                </div>
            </div>

            {/* Strategy Guide Button */}
            <button 
                onClick={fetchStrategy}
                disabled={loadingStrategy}
                className="w-full py-6 bg-stone-900 border border-stone-700 hover:border-orange-500 hover:bg-stone-800 transition-all group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-orange-900/10 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <BookOpen className="w-6 h-6 text-stone-400 group-hover:text-orange-500" />
                    <span className="text-sm font-bold uppercase tracking-widest text-stone-300 group-hover:text-white">
                        {loadingStrategy ? "Drafting Plans..." : strategy ? "Review Orders" : "Summon War Council"}
                    </span>
                    {!strategy && !loadingStrategy && <span className="text-[10px] text-stone-600">Get Turns 1-10 Guide</span>}
                </div>
            </button>
        </div>
      </div>

      {/* Strategy Guide Overlay (Redesigned to Match App) */}
      {strategy && (
        <div ref={strategyRef} className="mx-4 mb-20 animate-in fade-in duration-1000">
            <div 
                className="max-w-4xl mx-auto relative bg-stone-900/95 border p-1 shadow-2xl backdrop-blur-sm"
                style={{ borderColor: theme.accent, boxShadow: `0 0 30px -10px ${theme.glow}` }}
            >
                {/* Background Noise */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 pointer-events-none"></div>

                <div className="relative z-10 p-8 md:p-12">
                    <div className="flex items-center justify-center gap-4 mb-8">
                         <div className="h-[1px] w-12 bg-stone-600"></div>
                         <h2 className="text-3xl cinzel font-black text-center text-stone-100 tracking-tight flex items-center gap-3">
                             <ScrollText className="w-6 h-6" style={{color: theme.accent}}/>
                            War Council
                        </h2>
                        <div className="h-[1px] w-12 bg-stone-600"></div>
                    </div>
                    
                    <h3 className="text-center text-stone-500 uppercase tracking-[0.2em] text-sm font-bold mb-10">{strategy.title}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Objectives */}
                        <div className="bg-stone-950/50 p-6 border border-stone-800">
                            <h3 className="font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-stone-400 border-b border-stone-800 pb-2">
                                <Target className="w-4 h-4 text-stone-500" /> Initial Objectives
                            </h3>
                            <ul className="space-y-4">
                                {strategy.earlyGameTips.map((tip, i) => (
                                    <li key={i} className="flex gap-3 text-sm font-sans leading-relaxed text-stone-300">
                                        <span className="font-bold font-cinzel text-lg" style={{ color: theme.accent }}>{i+1}.</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Research & Conquest */}
                        <div className="space-y-6">
                            <div className="bg-stone-950/50 p-6 border border-stone-800">
                                <h4 className="font-bold uppercase text-[10px] mb-3 text-stone-500 tracking-widest">Priority Research</h4>
                                <p className="font-cinzel text-lg font-bold text-stone-200" style={{ color: theme.accent }}>{strategy.firstResearch}</p>
                            </div>
                            <div className="bg-stone-900/30 p-6 border border-stone-800">
                                <h4 className="font-bold uppercase text-[10px] mb-3 text-stone-500 tracking-widest">First Conquest target</h4>
                                <div className="flex items-center gap-3">
                                    <Skull className="w-5 h-5 text-red-900" />
                                    <p className="font-cinzel text-lg font-bold text-stone-200">{strategy.firstConquest}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onReset}
          className="group relative px-8 py-3 bg-transparent border border-stone-700 text-stone-400 hover:text-white transition-all uppercase tracking-widest text-sm font-bold overflow-hidden"
          style={{ borderColor: theme.accent !== '#f97316' ? theme.accent : undefined }}
        >
          <div className="absolute inset-0 bg-stone-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 -z-10"></div>
          <span className="flex items-center gap-3">
             <RefreshCcw className="w-4 h-4" /> Start New Campaign
          </span>
        </button>
      </div>
    </div>
  );
};

export default ResultsView;