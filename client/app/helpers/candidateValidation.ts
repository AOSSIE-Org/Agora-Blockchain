/**
 * Candidate validation utilities for the election creation form.
 * Provides validation constants, interfaces, and utility functions.
 */

export interface Candidate {
  id: string;
  name: string;
  description: string;
}

/**
 * Generates a unique ID for a new candidate.
 */
export function generateCandidateId(): string {
  return `candidate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface CandidateValidationErrors {
  duplicateIds: Set<string>;
  emptyFields: Map<string, Set<"name" | "description">>;
}

export const VALIDATION_MESSAGES = {
  MIN_CANDIDATES: "Minimum 2 candidates required",
  EMPTY_FIELDS: "All candidates need name & description",
  DUPLICATE_NAMES: "Candidate names must be unique",
} as const;

export const MIN_CANDIDATES = 2;

/**
 * Finds IDs of candidates with duplicate names (case-insensitive).
 * Returns a Set containing all IDs that have duplicates.
 */
export function findDuplicateIds(candidates: Candidate[]): Set<string> {
  const duplicateIds = new Set<string>();
  const nameToIds = new Map<string, string[]>();

  candidates.forEach((candidate) => {
    const normalizedName = candidate.name.trim().toLowerCase();
    if (normalizedName) {
      const ids = nameToIds.get(normalizedName) || [];
      ids.push(candidate.id);
      nameToIds.set(normalizedName, ids);
    }
  });

  nameToIds.forEach((ids) => {
    if (ids.length > 1) {
      ids.forEach((id) => duplicateIds.add(id));
    }
  });

  return duplicateIds;
}

/**
 * Finds empty fields for each candidate.
 * Returns a Map where keys are candidate IDs and values are Sets of empty field names.
 */
export function findEmptyFields(
  candidates: Candidate[]
): Map<string, Set<"name" | "description">> {
  const emptyFields = new Map<string, Set<"name" | "description">>();

  candidates.forEach((candidate) => {
    const empty = new Set<"name" | "description">();

    if (!candidate.name.trim()) {
      empty.add("name");
    }
    if (!candidate.description.trim()) {
      empty.add("description");
    }

    if (empty.size > 0) {
      emptyFields.set(candidate.id, empty);
    }
  });

  return emptyFields;
}
