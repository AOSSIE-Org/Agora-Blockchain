export const ballotTypeMap: Record<number, string> = {
  1: "General",
  2: "Ranked",
  3: "IRV",
  4: "Schulze",
  5: "Quadratic",
  6: "Score",
  7: "KemenyYoung",
};

export const VotingInfo = (_ballotType: number): string => {
  return ballotTypeMap[_ballotType] || "General";
};
