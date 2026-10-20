export interface RankTier {
  min: number;
  max: number;
  title: string;
  icon: string;
  description: string;
}

export const RANKS: RankTier[] = [
  { min: 0, max: 300, title: 'Bronze', icon: '🥉', description: 'New classmate joining the hub.' },
  { min: 301, max: 1000, title: 'Silver', icon: '🥈', description: 'Active contributor sharing regular class notes.' },
  { min: 1001, max: 2500, title: 'Gold', icon: '🥇', description: 'Dedicated student helping peers consistently.' },
  { min: 2501, max: 5000, title: 'Diamond', icon: '💎', description: 'High-achieving star student & prolific contributor.' },
  { min: 5001, max: 99999, title: 'Platinum', icon: '👑', description: 'The ultimate Grade 8 study legend (Crowned Champion)!' },
];

export function calculateRank(xp: number): RankTier {
  return RANKS.find((r) => xp >= r.min && xp <= r.max) || RANKS[0];
}

export function getNextRank(currentRank: RankTier): RankTier {
  const index = RANKS.findIndex((r) => r.title === currentRank.title);
  return RANKS[index + 1] || currentRank;
}
