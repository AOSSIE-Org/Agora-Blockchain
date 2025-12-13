"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Candidate, CandidateValidationErrors, MIN_CANDIDATES } from "../../helpers/candidateValidation";
import CandidateCounter from "./CandidateCounter";
import CandidateCard from "./CandidateCard";

interface CandidateSectionProps {
  candidates: Candidate[];
  validationErrors: CandidateValidationErrors;
  onAddCandidate: () => void;
  onRemoveCandidate: (id: string) => void;
  onUpdateCandidate: (id: string, field: "name" | "description", value: string) => void;
  onFieldBlur: (id: string, field: "name" | "description") => void;
}

/**
 * Main component for managing candidates in the election creation form.
 * Includes counter, add button, and list of candidate cards with animations.
 */
const CandidateSection: React.FC<CandidateSectionProps> = ({
  candidates,
  validationErrors,
  onAddCandidate,
  onRemoveCandidate,
  onUpdateCandidate,
  onFieldBlur,
}) => {
  const isBelowMinimum = candidates.length < MIN_CANDIDATES;

  return (
    <div className="space-y-4">
      {/* Header with title, counter, and add button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-gray-900">Candidates</h3>
          <CandidateCounter count={candidates.length} minimum={MIN_CANDIDATES} />
        </div>
        <motion.button
          type="button"
          onClick={onAddCandidate}
          className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 min-h-[44px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Candidate
        </motion.button>
      </div>

      {/* Warning indicator when below minimum */}
      {isBelowMinimum && candidates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-md"
        >
          <ExclamationTriangleIcon className="h-5 w-5" />
          <span className="text-sm">Add at least {MIN_CANDIDATES} candidates to create an election</span>
        </motion.div>
      )}

      {/* Candidate list or placeholder */}
      {candidates.length === 0 ? (
        <p className="text-gray-500 text-sm italic text-center py-4">
          No candidates added yet. Click &quot;Add Candidate&quot; to begin adding candidates.
        </p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {candidates.map((candidate, index) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                index={index}
                isDuplicate={validationErrors.duplicateIds.has(candidate.id)}
                emptyFields={validationErrors.emptyFields.get(candidate.id)}
                onRemove={() => onRemoveCandidate(candidate.id)}
                onUpdate={(field, value) => onUpdateCandidate(candidate.id, field, value)}
                onBlur={(field) => onFieldBlur(candidate.id, field)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CandidateSection;
