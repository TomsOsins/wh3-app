import React from 'react';
import { Question, Option } from '../types';
import { Diamond } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentStep: number;
  totalSteps: number;
  onAnswer: (option: Option) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, currentStep, totalSteps, onAnswer }) => {
  return (
    <div className="w-full max-w-3xl mx-auto animate-in slide-in-from-right duration-500 fade-in">
      
      {/* Decorative Header with Progress */}
      <div className="mb-8 flex items-end justify-between border-b border-stone-800 pb-2 relative">
        <div className="absolute bottom-[-1px] left-0 w-1/3 h-[1px] bg-orange-800"></div>
        <div>
            <span className="text-orange-700 font-bold cinzel text-sm uppercase tracking-widest block mb-1">Query {currentStep} / {totalSteps}</span>
            <div className="flex gap-1">
                {Array.from({length: totalSteps}).map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1 w-6 rounded-sm transition-colors duration-300 ${idx < currentStep ? 'bg-orange-700' : 'bg-stone-800'}`} 
                    />
                ))}
            </div>
        </div>
      </div>

      <div className="bg-stone-900/60 border border-stone-800 p-8 relative overflow-hidden group-card shadow-2xl backdrop-blur-md">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-900 to-transparent pointer-events-none"></div>
        
        <h2 className="text-2xl md:text-4xl font-bold text-stone-100 mb-10 leading-tight cinzel relative z-10 drop-shadow-md">
          {question.text}
        </h2>

        <div className="space-y-3 relative z-10">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswer(option)}
              className="w-full text-left px-6 py-5 bg-stone-950/80 border border-stone-800 hover:border-orange-700 hover:bg-stone-900 transition-all duration-200 group flex items-center justify-between relative overflow-hidden"
            >
              {/* Hover Highlight */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200"></div>
              
              <span className={`text-lg transition-colors group-hover:text-orange-50 ${option.id === 'unsure' ? 'text-stone-500 italic text-base' : 'text-stone-300'}`}>
                {option.text}
              </span>
              
              {option.id !== 'unsure' ? (
                 <Diamond className="w-3 h-3 text-orange-800 group-hover:text-orange-500 opacity-50 group-hover:opacity-100 rotate-45 transition-all" />
              ) : (
                 <span className="text-xs text-stone-600 uppercase tracking-widest group-hover:text-stone-400">Skip</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;