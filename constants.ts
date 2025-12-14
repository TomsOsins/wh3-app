import { Question } from './types';

export const FACTIONS_LIST = [
  "The Empire", "Dwarfs", "Greenskins", "Vampire Counts",
  "High Elves", "Dark Elves", "Lizardmen", "Skaven",
  "Tomb Kings", "Vampire Coast", "Bretonnia", "Wood Elves",
  "Beastmen", "Norsca", "Warriors of Chaos", "Daemons of Chaos",
  "Khorne", "Nurgle", "Tzeentch", "Slaanesh",
  "Grand Cathay", "Kislev", "Ogre Kingdoms", "Chaos Dwarfs"
];

interface FactionTheme {
  primary: string; // Background/Border Dark
  accent: string;  // Text/Icon Bright
  glow: string;    // Box Shadow
  gradient: string; // CSS Gradient
}

const DEFAULT_THEME: FactionTheme = {
  primary: "#1c1917", // Stone-900
  accent: "#f97316",  // Orange-500
  glow: "rgba(249, 115, 22, 0.3)",
  gradient: "from-stone-800 to-stone-950"
};

// Keys are simplified to match substrings easier
export const FACTION_THEMES: Record<string, FactionTheme> = {
  "Empire": { primary: "#7f1d1d", accent: "#fcd34d", glow: "rgba(252, 211, 77, 0.4)", gradient: "from-red-950 to-stone-900" },
  "Khorne": { primary: "#450a0a", accent: "#ef4444", glow: "rgba(239, 68, 68, 0.5)", gradient: "from-red-950 via-red-900 to-black" },
  "Nurgle": { primary: "#365314", accent: "#bef264", glow: "rgba(190, 242, 100, 0.4)", gradient: "from-green-950 via-lime-950 to-black" },
  "Tzeentch": { primary: "#172554", accent: "#22d3ee", glow: "rgba(34, 211, 238, 0.4)", gradient: "from-blue-950 via-cyan-900 to-black" },
  "Slaanesh": { primary: "#4a044e", accent: "#f0abfc", glow: "rgba(240, 171, 252, 0.4)", gradient: "from-fuchsia-950 via-purple-900 to-black" },
  "High Elves": { primary: "#1e3a8a", accent: "#38bdf8", glow: "rgba(56, 189, 248, 0.5)", gradient: "from-slate-800 via-blue-950 to-slate-900" },
  "Dark Elves": { primary: "#312e81", accent: "#a78bfa", glow: "rgba(167, 139, 250, 0.4)", gradient: "from-indigo-950 via-purple-950 to-black" },
  "Greenskins": { primary: "#14532d", accent: "#a3e635", glow: "rgba(163, 230, 53, 0.4)", gradient: "from-green-950 to-stone-950" },
  "Orc": { primary: "#14532d", accent: "#a3e635", glow: "rgba(163, 230, 53, 0.4)", gradient: "from-green-950 to-stone-950" },
  "Goblin": { primary: "#14532d", accent: "#a3e635", glow: "rgba(163, 230, 53, 0.4)", gradient: "from-green-950 to-stone-950" },
  "Dwarfs": { primary: "#1e3a8a", accent: "#fbbf24", glow: "rgba(251, 191, 36, 0.4)", gradient: "from-blue-950 to-stone-900" },
  "Skaven": { primary: "#064e3b", accent: "#4ade80", glow: "rgba(74, 222, 128, 0.4)", gradient: "from-stone-900 via-emerald-950 to-black" },
  "Vampire": { primary: "#3b0764", accent: "#f87171", glow: "rgba(248, 113, 113, 0.4)", gradient: "from-stone-950 via-purple-950 to-black" },
  "Cathay": { primary: "#022c22", accent: "#fbbf24", glow: "rgba(251, 191, 36, 0.4)", gradient: "from-stone-900 via-emerald-950 to-black" },
  "Kislev": { primary: "#0c4a6e", accent: "#bae6fd", glow: "rgba(186, 230, 253, 0.4)", gradient: "from-stone-900 via-sky-950 to-black" },
  "Lizardmen": { primary: "#134e4a", accent: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", gradient: "from-cyan-950 to-stone-900" },
  "Tomb Kings": { primary: "#451a03", accent: "#fcd34d", glow: "rgba(252, 211, 77, 0.4)", gradient: "from-amber-950 to-black" },
  "Coast": { primary: "#3b0764", accent: "#38bdf8", glow: "rgba(56, 189, 248, 0.4)", gradient: "from-stone-950 via-cyan-950 to-black" }, // Vampire Coast
  "Chaos Dwarf": { primary: "#450a0a", accent: "#f97316", glow: "rgba(249, 115, 22, 0.5)", gradient: "from-red-950 via-orange-950 to-black" },
  "Bretonnia": { primary: "#1e3a8a", accent: "#facc15", glow: "rgba(250, 204, 21, 0.4)", gradient: "from-blue-900 to-stone-900" },
  "Wood Elv": { primary: "#14532d", accent: "#4ade80", glow: "rgba(74, 222, 128, 0.4)", gradient: "from-green-950 to-stone-900" },
  "Beastmen": { primary: "#3f2c22", accent: "#b91c1c", glow: "rgba(185, 28, 28, 0.5)", gradient: "from-amber-950 to-stone-950" },
  "Norsca": { primary: "#1f2937", accent: "#9ca3af", glow: "rgba(156, 163, 175, 0.4)", gradient: "from-gray-900 via-slate-900 to-black" },
  "Chaos": { primary: "#1c1917", accent: "#f87171", glow: "rgba(248, 113, 113, 0.5)", gradient: "from-stone-900 via-red-950 to-black" },
  "Ogre": { primary: "#451a03", accent: "#a3a3a3", glow: "rgba(163, 163, 163, 0.4)", gradient: "from-stone-800 via-amber-950 to-black" },
};

export const getFactionTheme = (faction: string): FactionTheme => {
  if (!faction) return DEFAULT_THEME;
  const normalizedFaction = faction.toLowerCase();
  
  // Try to find a match by checking if the faction name contains the key OR the key contains the faction name
  for (const key in FACTION_THEMES) {
    const normalizedKey = key.toLowerCase();
    if (normalizedFaction.includes(normalizedKey)) return FACTION_THEMES[key];
  }
  return DEFAULT_THEME;
};

const UNSURE_OPTION = { id: "unsure", text: "I'm not sure / No strong preference / Flexible" };

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How do you prefer to win your battles?",
    options: [
      { id: "ranged", text: "Overwhelming firepower and artillery supremacy from afar." },
      { id: "melee_rush", text: "Aggressive, fast-moving melee rush. Close the gap immediately." },
      { id: "grind", text: "A slow, defensive grind. Let them break against my immovable shield wall." },
      { id: "balanced", text: "A balanced 'Hammer and Anvil' approach with varied tools." },
      { id: "monsters", text: "Send in the giant monsters to trample everything." },
      UNSURE_OPTION
    ]
  },
  {
    id: 2,
    text: "What is your stance on Magic?",
    options: [
      { id: "dominant", text: "Magic is my primary weapon. I want to delete units with spells." },
      { id: "support", text: "I use magic to buff my troops or heal my characters." },
      { id: "none", text: "I prefer steel and gunpowder. I don't rely on magic at all (or hate it)." },
      UNSURE_OPTION
    ]
  },
  {
    id: 3,
    text: "How complex do you want your Campaign Mechanics to be?",
    options: [
      { id: "simple", text: "Simple and straightforward. I just want to conquer settlements." },
      { id: "moderate", text: "Some unique mechanics to spice things up, but nothing overwhelming." },
      { id: "complex", text: "I want complex systems, unique resources, and distinct playstyles (e.g., Undercities, Caravans, changing of ways)." },
      UNSURE_OPTION
    ]
  },
  {
    id: 4,
    text: "Unit Count and Quality preference?",
    options: [
      { id: "elite", text: "Few, but extremely powerful elite units. Every loss hurts." },
      { id: "swarm", text: "Endless tides of disposable fodder. Quantity has a quality all its own." },
      { id: "balanced_quality", text: "A standard mix of reliable infantry and specialized elites." },
      UNSURE_OPTION
    ]
  },
  {
    id: 5,
    text: "What is your preferred Economic Style?",
    options: [
      { id: "builder", text: "Building tall, developing safe provinces, and generating passive income." },
      { id: "raider", text: "Aggressive raiding, sacking, and looting. My economy is war." },
      { id: "trade", text: "Diplomacy and trade agreements are key to my treasury." },
      UNSURE_OPTION
    ]
  },
  {
    id: 6,
    text: "How do you handle Diplomacy?",
    options: [
      { id: "order", text: "I want allies. The Order tide stands together." },
      { id: "war", text: "Total War. Everyone is an enemy eventually." },
      { id: "manipulative", text: "I like to manipulate factions against each other." },
      { id: "neutral", text: "I stick to myself and defend my borders." },
      UNSURE_OPTION
    ]
  },
  {
    id: 7,
    text: "Which aesthetic theme appeals to you most?",
    options: [
      { id: "human", text: "Disciplined Humans (Empire, Cathay, Kislev, Bretonnia)." },
      { id: "monstrous", text: "Monsters and Beasts (Lizardmen, Ogres, Beastmen)." },
      { id: "edgy", text: "Dark and Edgy (Dark Elves, Vampire Counts, Chaos)." },
      { id: "sturdy", text: "Short and Sturdy (Dwarfs, Chaos Dwarfs)." },
      { id: "bizarre", text: "Bizarre or Gross (Skaven, Nurgle, Tzeentch)." },
      UNSURE_OPTION
    ]
  },
  {
    id: 8,
    text: "How much Micro-management do you want in battle?",
    options: [
      { id: "low", text: "Low. I want to set up my formation and watch the fireworks." },
      { id: "high", text: "High. I want to be constantly clicking, flanking, and casting." },
      { id: "medium", text: "Moderate. I can handle some cavalry or chariots." },
      UNSURE_OPTION
    ]
  },
  {
    id: 9,
    text: "Do you prefer fast or durable units?",
    options: [
      { id: "fast", text: "Speed is life. Glass cannons that hit hard and fade away." },
      { id: "durable", text: "Armor and Health. I want to be unkillable." },
      { id: "mix", text: "A mix of both." },
      UNSURE_OPTION
    ]
  },
  {
    id: 10,
    text: "What is your ideal Starting Location?",
    options: [
      { id: "center", text: "The Old World (Empire, Sylvania, Mountains) - Surrounded by enemies." },
      { id: "isolated", text: "Isolated corner (Cathay, Ulthuan, Lustria) - Safe borders to expand from." },
      { id: "chaos", text: "The Chaos Wastes - Desolate and hostile." },
      UNSURE_OPTION
    ]
  },
  {
    id: 11,
    text: "How do you feel about Ranged Infantry specifically?",
    options: [
      { id: "love", text: "Archers and Gunners are the core of my army." },
      { id: "hate", text: "I barely use them, I prefer melee or monsters." },
      { id: "hybrid", text: "I like hybrid units that can shoot and fight (e.g., Sea Guard, Ice Guard)." },
      UNSURE_OPTION
    ]
  },
  {
    id: 12,
    text: "Refining: Legendary Lord Power Level (Herohammer)",
    options: [
      { id: "one_man_army", text: "I want my Lord to be a One-Man-Army who can solo thousands." },
      { id: "commander", text: "My Lord is a commander/buffer. The army does the work." },
      { id: "assassin", text: "I want a duelist who hunts enemy characters specifically." },
      UNSURE_OPTION
    ]
  },
  {
    id: 13,
    text: "Refining: Dealing with Corruption",
    options: [
      { id: "spread", text: "I want to spread corruption to weaken my enemies before I attack." },
      { id: "cleanse", text: "I want to cleanse the land (Untainted) and bring order." },
      { id: "ignore", text: "I don't want to worry about corruption mechanics much." },
      UNSURE_OPTION
    ]
  },
  {
    id: 14,
    text: "Final Check: What is an absolute Dealbreaker?",
    options: [
      { id: "no_arty", text: "Must have good Artillery. I cannot play without big guns." },
      { id: "no_magic", text: "Must have powerful Magic. I refuse to play Dwarfs or Khorne." },
      { id: "no_monsters", text: "Must have Monsters. I didn't come here to play historical TW." },
      { id: "flexible", text: "No hard dealbreakers, I'm flexible." },
    ]
  }
];