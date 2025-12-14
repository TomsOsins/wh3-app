export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  description?: string;
  options: Option[];
}

export interface UserAnswer {
  questionId: number;
  selectedOptionId: string;
  questionText: string;
  selectedText: string;
}

export interface PlaystyleScores {
  aggression: number; // 1-10
  defense: number;    // 1-10
  magic: number;      // 1-10
  range: number;      // 1-10
  complexity: number; // 1-10
}

export interface UnitSpotlight {
  name: string;
  description: string;
}

export interface NemesisResult {
  faction: string;
  reason: string;
}

export interface RecommendationResult {
  primary: {
    faction: string;
    lord: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
  };
  roleplayIntro: string; // New: 2nd person narrative
  nemesis: NemesisResult; // New: The counter-faction
  keyUnits: UnitSpotlight[]; // New: 3 key units
  runnerUps: Array<{
    faction: string;
    lord: string;
    reason: string;
  }>;
  scores: PlaystyleScores;
  playstyleSummary: string;
}

export interface StrategyGuide {
  title: string;
  earlyGameTips: string[];
  firstResearch: string;
  firstConquest: string;
}