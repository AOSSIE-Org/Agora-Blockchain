/**
 * Candidate validation utilities for the election creation form.
 * Provides validation constants, interfaces, and utility functions.
 */

export interface Candidate {
  name: string;
  description: string;
}

export interface CandidateValidationErrors {
  duplicateIndices: Set<number>;
  emptyFields: Map<number, Set<keyof Candidate>>;
}

export const VALIDATION_MESSAGES = {
  MIN_CANDIDATES: "Minimum 2 candidates required",
  EMPTY_FIELDS: "All candidates need name & description",
  DUPLICATE_NAMES: "Candidate names must be unique",
} as const;

export const MIN_CANDIDATES = 2;

/**
 * Finds indices of candidates with duplicate names (case-insensitive).
 * Returns a Set containing all indices that have duplicates.
 */
export function findDuplicateIndices(candidates: Candidate[]): Set<number> {
  const duplicateIndices = new Set<number>();
  const nameToIndices = new Map<string, number[]>();

  candidates.forEach((candidate, index) => {
    const normalizedName = candidate.name.trim().toLowerCase();
    if (normalizedName) {
      const indices = nameToIndices.get(normalizedName) || [];
      indices.push(index);
      nameToIndices.set(normalizedName, indices);
    }
  });

  nameToIndices.forEach((indices) => {
    if (indices.length > 1) {
      indices.forEach((index) => duplicateIndices.add(index));
    }
  });

  return duplicateIndices;
}

/**
 * Finds empty fields for each candidate.
 * Returns a Map where keys are candidate indices and values are Sets of empty field names.
 */
export function findEmptyFields(
  candidates: Candidate[]
): Map<number, Set<keyof Candidate>> {
  const emptyFields = new Map<number, Set<keyof Candidate>>();

  candidates.forEach((candidate, index) => {
    const empty = new Set<keyof Candidate>();

    if (!candidate.name.trim()) {
      empty.add("name");
    }
    if (!candidate.description.trim()) {
      empty.add("description");
    }

    if (empty.size > 0) {
      emptyFields.set(index, empty);
    }
  });

  return emptyFields;
}
