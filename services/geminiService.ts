import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { UserAnswer, RecommendationResult, StrategyGuide } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    primary: {
      type: Type.OBJECT,
      properties: {
        faction: { type: Type.STRING },
        lord: { type: Type.STRING },
        description: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["faction", "lord", "description", "strengths", "weaknesses"],
    },
    roleplayIntro: { 
      type: Type.STRING, 
      description: "A dramatic, second-person narrative introduction (approx 50 words) welcoming the player to their role." 
    },
    nemesis: {
      type: Type.OBJECT,
      properties: {
        faction: { type: Type.STRING },
        reason: { type: Type.STRING, description: "Why this faction is the natural enemy/counter to the user's playstyle." },
      },
      required: ["faction", "reason"],
    },
    keyUnits: {
      type: Type.ARRAY,
      description: "3 iconic units for this specific lord/faction",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING, description: "A gritty, flavorful description of the unit." },
        },
        required: ["name", "description"]
      }
    },
    runnerUps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          faction: { type: Type.STRING },
          lord: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["faction", "lord", "reason"],
      },
    },
    scores: {
      type: Type.OBJECT,
      properties: {
        aggression: { type: Type.INTEGER, description: "Score from 1-10" },
        defense: { type: Type.INTEGER, description: "Score from 1-10" },
        magic: { type: Type.INTEGER, description: "Score from 1-10" },
        range: { type: Type.INTEGER, description: "Score from 1-10" },
        complexity: { type: Type.INTEGER, description: "Score from 1-10" },
      },
      required: ["aggression", "defense", "magic", "range", "complexity"],
    },
    playstyleSummary: { type: Type.STRING },
  },
  required: ["primary", "roleplayIntro", "nemesis", "keyUnits", "runnerUps", "playstyleSummary", "scores"],
};

const STRATEGY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    earlyGameTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    firstResearch: { type: Type.STRING },
    firstConquest: { type: Type.STRING },
  },
  required: ["title", "earlyGameTips", "firstResearch", "firstConquest"]
};

export const getRecommendation = async (answers: UserAnswer[], blacklistedFactions: string[]): Promise<RecommendationResult> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Act as a Warhammer Total War 3 expert. 
    Analyze the following user preferences to recommend the perfect Legendary Lord.
    
    CRITICAL: BANNED FACTIONS: ${blacklistedFactions.length > 0 ? blacklistedFactions.join(', ') : "None"}. Do not recommend these.

    User Preferences:
    ${answers.map(a => `- ${a.questionText}: ${a.selectedText}`).join('\n')}

    Requirements:
    1. Primary Recommendation: Best fit.
    2. Roleplay Intro: Write a dramatic, immersive 2nd-person intro (e.g., "The Elector Counts are squabbling... Only you can unite them.").
    3. Nemesis: Identify the faction that is the hardest counter or thematic rival to the user's playstyle.
    4. Key Units: List 3 iconic units with gritty descriptions.
    5. Scores: Analyze Aggression, Defense, Magic, Range, Complexity (1-10).
  `;

  try {
    const result = await genAI.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        systemInstruction: "You are a battle-hardened tactician of the Old World.",
      },
    });

    const text = result.text;
    if (!text) throw new Error("No response text from Gemini");
    return JSON.parse(text) as RecommendationResult;

  } catch (error) {
    console.error("Error fetching recommendation:", error);
    throw error;
  }
};

export const getStrategyGuide = async (lord: string, faction: string): Promise<StrategyGuide> => {
  const prompt = `
    Provide a concise "First 10 Turns" strategy guide for ${lord} (${faction}) in Warhammer 3 Immortal Empires.
    Include:
    1. 3-4 Bullet points for early moves.
    2. The absolute first technology to research.
    3. The first settlement/enemy to attack.
  `;

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: STRATEGY_SCHEMA,
    }
  });

  if (!result.text) throw new Error("No strategy generated");
  return JSON.parse(result.text) as StrategyGuide;
};

export const generateAdvisorSpeech = async (text: string, faction: string): Promise<string> => {
  // Always use 'Fenrir' for that grizzled, Deckard Cain-esque storyteller vibe
  const voiceName = 'Fenrir';

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: { parts: [{ text: text }] },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");
  return base64Audio;
};