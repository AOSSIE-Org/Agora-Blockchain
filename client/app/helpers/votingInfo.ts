type ReturnType = { name: string; description: string };
export const ballotTypeMap: Record<number, ReturnType> = {
  1: {
    name: "General",
    description: `Voters cast their votes for their preferred candidate or option. The candidate or option with the most votes wins. This system is simple and straightforward, often used in elections where each voter has one vote to cast`,
  },
  2: {
    name: "Ranked",
    description: `Voters rank candidates, and points are assigned based on the ranking (e.g., first choice gets the most points, second choice gets fewer points, and so on). The candidate with the highest total points wins.`,
  },
  3: {
    name: "IRV",
    description: `Voters rank candidates in order of preference. If no candidate receives a majority of first-preference votes, the candidate with the fewest votes is eliminated, and their votes are redistributed based on the next preference. This process continues until a candidate has a majority.`,
  },
  4: {
    name: "Schulze",
    description: `Voters rank candidates, and the system calculates pairwise comparisons to determine the strongest path of preferences, identifying the winner with the strongest overall support.`,
  },
  5: {
    name: "Quadratic",
    description: `Voters allocate credits to cast votes on multiple options. The cost of votes increases quadratically, balancing strong preferences with the need to distribute votes across options.`,
  },
  6: {
    name: "Score",
    description: `Voters rate each candidate on a scale (e.g., 0 to 5). The candidate with the highest total score wins, allowing voters to express varying levels of preference for each candidate.`,
  },
  7: {
    name: "KemenyYoung",
    description: `Voters rank candidates, and the system calculates the order of candidates that has the smallest total disagreement with the voters' rankings. The candidate ranking with the highest Kemeny score (the smallest sum of distances) is the winner.`,
  },
};

export const VotingInfo = (_ballotType: number): ReturnType => {
  if (_ballotType > 8) _ballotType = 1;
  return ballotTypeMap[_ballotType];
};
