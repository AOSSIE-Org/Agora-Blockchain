export const ballotTypeMap: Record<number, string> = {
  1: "General",
  2: "Ranked",
  3: "IRV",
  4: "Borda",
  5: "Quadratic",
  6: "Score",
  7: "KemenyYoung",
  8: "Schulze",
};

export const VotingInfo = (_ballotType: number): string => {
  return ballotTypeMap[_ballotType] || "General";
};
