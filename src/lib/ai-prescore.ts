interface PresscoreParams {
  liquidity: number;
  team: number;
}

export function computeAiPrescore({ liquidity, team }: PresscoreParams): number {
  return Math.floor(
    (Math.min(100, liquidity * 1.3) + (liquidity >= 60 ? 95 : 70) - (team > 15 ? 20 : 0) + 85) / 3,
  );
}
