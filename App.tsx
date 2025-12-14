import React, { useState } from 'react';
import { QUESTIONS } from './constants';
import { UserAnswer, Option, RecommendationResult } from './types';
import { getRecommendation } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import BlacklistScreen from './components/BlacklistScreen';
import QuestionCard from './components/QuestionCard';
import LoadingScreen from './components/LoadingScreen';
import ResultsView from './components/ResultsView';
import EmberEffect from './components/EmberEffect';

enum AppState {
  WELCOME,
  BLACKLIST,
  QUESTIONS,
  LOADING,
  RESULTS,
  ERROR
}

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [blacklistedFactions, setBlacklistedFactions] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  const handleStart = () => {
    setAppState(AppState.BLACKLIST);
  };

  const handleBlacklistComplete = (blocked: string[]) => {
    setBlacklistedFactions(blocked);
    setAppState(AppState.QUESTIONS);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleAnswer = async (option: Option) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: option.id,
      questionText: currentQuestion.text,
      selectedText: option.text,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      // Small delay for UX transition feel
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 200);
    } else {
      // Quiz finished
      setAppState(AppState.LOADING);
      try {
        const result = await getRecommendation(updatedAnswers, blacklistedFactions);
        setRecommendation(result);
        setAppState(AppState.RESULTS);
      } catch (error) {
        console.error(error);
        setAppState(AppState.ERROR);
      }
    }
  };

  const handleReset = () => {
    setAppState(AppState.WELCOME);
    setAnswers([]);
    setBlacklistedFactions([]);
    setRecommendation(null);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 selection:bg-orange-900/50 relative overflow-hidden">
      
      {/* Global Particle Effect */}
      <EmberEffect />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        
        {appState === AppState.WELCOME && (
          <WelcomeScreen onStart={handleStart} />
        )}

        {appState === AppState.BLACKLIST && (
          <BlacklistScreen onNext={handleBlacklistComplete} />
        )}

        {appState === AppState.QUESTIONS && (
          <div className="w-full">
            <QuestionCard 
              question={QUESTIONS[currentQuestionIndex]}
              currentStep={currentQuestionIndex + 1}
              totalSteps={QUESTIONS.length}
              onAnswer={handleAnswer}
            />
          </div>
        )}

        {appState === AppState.LOADING && (
          <LoadingScreen />
        )}

        {appState === AppState.RESULTS && recommendation && (
          <ResultsView result={recommendation} onReset={handleReset} />
        )}

        {appState === AppState.ERROR && (
          <div className="text-center p-8 bg-stone-900 border border-red-900/50 rounded-lg max-w-md">
            <h2 className="text-2xl text-red-500 font-bold mb-4 cinzel">Chaos Corruption Detected</h2>
            <p className="text-stone-400 mb-6">Something went wrong while consulting the oracles. Please try again.</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-stone-800 hover:bg-stone-700 rounded-md transition-colors"
            >
              Return to Menu
            </button>
          </div>
        )}

      </main>

      <footer className="relative z-10 text-center py-6 text-stone-700 text-xs">
        <p>Unofficial Fan App. Not affiliated with Creative Assembly or Games Workshop.</p>
      </footer>
    </div>
  );
}