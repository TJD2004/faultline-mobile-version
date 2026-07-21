// Shared gamification rules — used by Dashboard, Achievements, Sidebar, etc.

export const RANKS = [
  { title: "Bug Hunter", minXp: 0 },
  { title: "Debugger", minXp: 300 },
  { title: "Error Detective", minXp: 800 },
  { title: "Code Surgeon", minXp: 1600 },
  { title: "Senior Debugger", minXp: 3000 },
  { title: "Elite Engineer", minXp: 5000 },
  { title: "Debug Master", minXp: 8000 },
  { title: "Legend", minXp: 12000 },
];

export function titleForXp(xp = 0) {
  let current = RANKS[0].title;
  for (const r of RANKS) {
    if (xp >= r.minXp) current = r.title;
  }
  return current;
}

const XP_PER_LEVEL = 250;

export function levelInfo(xp = 0) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const base = (level - 1) * XP_PER_LEVEL;
  const xpIntoLevel = xp - base;
  return { level, xpIntoLevel, xpForNext: XP_PER_LEVEL };
}
