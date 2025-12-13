import React from "react";

interface CandidateCounterProps {
  count: number;
  minimum: number;
}

/**
 * Displays the current candidate count with visual feedback.
 * Shows warning color (amber) when below minimum, success color (green) when at/above minimum.
 */
const CandidateCounter: React.FC<CandidateCounterProps> = ({ count, minimum }) => {
  const isBelowMinimum = count < minimum;

  return (
    <span
      className={`text-sm font-medium px-2 py-1 rounded-full ${
        isBelowMinimum
          ? "bg-amber-100 text-amber-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {count}/{minimum} minimum
    </span>
  );
};

export default CandidateCounter;
