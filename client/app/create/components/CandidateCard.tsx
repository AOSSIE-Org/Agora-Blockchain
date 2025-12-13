"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Candidate } from "../../helpers/candidateValidation";

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
  isDuplicate: boolean;
  emptyFields: Set<keyof Candidate> | undefined;
  onRemove: () => void;
  onUpdate: (field: keyof Candidate, value: string) => void;
  onBlur: (field: keyof Candidate) => void;
}

const inputBaseClasses =
  "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-base min-h-[44px]";
const inputNormalClasses =
  "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500";
const inputErrorClasses =
  "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500";

/**
 * Renders an individual candidate entry with validation states.
 * Includes name input, description textarea, and delete button.
 */
const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  index,
  isDuplicate,
  emptyFields,
  onRemove,
  onUpdate,
  onBlur,
}) => {
  const hasNameError = isDuplicate || emptyFields?.has("name");
  const hasDescriptionError = emptyFields?.has("description");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className="p-4 border border-gray-200 rounded-lg space-y-3"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium text-gray-700">
          Candidate {index + 1}
        </h4>
        <motion.button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Remove candidate ${index + 1}`}
        >
          <TrashIcon className="h-5 w-5" />
        </motion.button>
      </div>

      <div className="space-y-3">
        <div>
          <input
            type="text"
            value={candidate.name}
            onChange={(e) => onUpdate("name", e.target.value)}
            onBlur={() => onBlur("name")}
            placeholder="Candidate Name"
            className={`${inputBaseClasses} ${
              hasNameError ? inputErrorClasses : inputNormalClasses
            }`}
            aria-invalid={hasNameError}
          />
          {isDuplicate && (
            <p className="mt-1 text-sm text-red-600">
              Duplicate name - must be unique
            </p>
          )}
        </div>

        <textarea
          value={candidate.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          onBlur={() => onBlur("description")}
          placeholder="Candidate Description"
          rows={2}
          className={`${inputBaseClasses} ${
            hasDescriptionError ? inputErrorClasses : inputNormalClasses
          }`}
          aria-invalid={hasDescriptionError}
        />
      </div>
    </motion.div>
  );
};

export default CandidateCard;
