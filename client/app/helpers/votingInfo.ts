export const ballotTypeMap: Record<number, string> = {
  1: "General Voting",
  2: "Ranked Voting",
  3: "IRV Voting",
  4: "Borda Voting",
  5: "Quadratic Voting",
  6: "Score Voting",
  7: "KemenyYoung Voting",
  8: "Schulze Voting",
};

export const VotingInfo = (_ballotType: number): string => {
  return ballotTypeMap[_ballotType] || "General Voting";
};
