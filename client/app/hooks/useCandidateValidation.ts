import { useMemo } from "react";
import {
  Candidate,
  CandidateValidationErrors,
  VALIDATION_MESSAGES,
  MIN_CANDIDATES,
  findDuplicateIndices,
  findEmptyFields,
} from "../helpers/candidateValidation";

export interface ValidationResult {
  isValid: boolean;
  errors: CandidateValidationErrors;
  errorMessages: string[];
}

/**
 * Custom hook for validating candidates in the election creation form.
 * Returns validation state including whether the candidates are valid,
 * specific error details, and user-facing error messages.
 */
export function useCandidateValidation(candidates: Candidate[]): ValidationResult {
  return useMemo(() => {
    const duplicateIndices = findDuplicateIndices(candidates);
    const emptyFields = findEmptyFields(candidates);
    const errorMessages: string[] = [];

    // Check minimum candidates
    if (candidates.length < MIN_CANDIDATES) {
      errorMessages.push(VALIDATION_MESSAGES.MIN_CANDIDATES);
    }

    // Check for empty fields
    if (emptyFields.size > 0) {
      errorMessages.push(VALIDATION_MESSAGES.EMPTY_FIELDS);
    }

    // Check for duplicate names
    if (duplicateIndices.size > 0) {
      errorMessages.push(VALIDATION_MESSAGES.DUPLICATE_NAMES);
    }

    const isValid = errorMessages.length === 0;

    return {
      isValid,
      errors: {
        duplicateIndices,
        emptyFields,
      },
      errorMessages,
    };
  }, [candidates]);
}
