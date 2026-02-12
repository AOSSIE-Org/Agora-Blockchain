import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCandidateValidation } from "./useCandidateValidation";
import { Candidate, VALIDATION_MESSAGES } from "../helpers/candidateValidation";

describe("useCandidateValidation", () => {
  it("returns valid when 2+ candidates with unique names and filled fields", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice", description: "Candidate A" },
      { id: "2", name: "Bob", description: "Candidate B" },
    ];

    const { result } = renderHook(() => useCandidateValidation(candidates));

    expect(result.current.isValid).toBe(true);
    expect(result.current.errorMessages).toHaveLength(0);
    expect(result.current.errors.duplicateIds.size).toBe(0);
    expect(result.current.errors.emptyFields.size).toBe(0);
  });

  it("returns invalid when fewer than 2 candidates", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice", description: "Candidate A" },
    ];

    const { result } = renderHook(() => useCandidateValidation(candidates));

    expect(result.current.isValid).toBe(false);
    expect(result.current.errorMessages).toContain(VALIDATION_MESSAGES.MIN_CANDIDATES);
  });

  it("returns invalid with empty candidates array", () => {
    const candidates: Candidate[] = [];

    const { result } = renderHook(() => useCandidateValidation(candidates));

    expect(result.current.isValid).toBe(false);
    expect(result.current.errorMessages).toContain(VALIDATION_MESSAGES.MIN_CANDIDATES);
  });

  it("returns duplicateIds for matching names (case-insensitive)", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice", description: "Candidate A" },
      { id: "2", name: "ALICE", description: "Candidate B" },
    ];

    const { result } = renderHook(() => useCandidateValidation(candidates));

    expect(result.current.isValid).toBe(false);
    expect(result.current.errors.duplicateIds.has("1")).toBe(true);
    expect(result.current.errors.duplicateIds.has("2")).toBe(true);
    expect(result.current.errorMessages).toContain(VALIDATION_MESSAGES.DUPLICATE_NAMES);
  });

  it("returns emptyFields for empty name or description", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "", description: "Candidate A" },
      { id: "2", name: "Bob", description: "" },
    ];

    const { result } = renderHook(() => useCandidateValidation(candidates));

    expect(result.current.isValid).toBe(false);
    expect(result.current.errors.emptyFields.get("1")?.has("name")).toBe(true);
    expect(result.current.errors.emptyFields.get("2")?.has("description")).toBe(true);
    expect(result.current.errorMessages).toContain(VALIDATION_MESSAGES.EMPTY_FIELDS);
  });

  it("returns correct error messages array with multiple errors", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "", description: "" },
    ];

    const { result } = renderHook(() => useCandidateValidation(candidates));

    expect(result.current.isValid).toBe(false);
    expect(result.current.errorMessages).toContain(VALIDATION_MESSAGES.MIN_CANDIDATES);
    expect(result.current.errorMessages).toContain(VALIDATION_MESSAGES.EMPTY_FIELDS);
  });

  it("returns valid with exactly 2 valid candidates", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice", description: "First candidate" },
      { id: "2", name: "Bob", description: "Second candidate" },
    ];

    const { result } = renderHook(() => useCandidateValidation(candidates));

    expect(result.current.isValid).toBe(true);
    expect(result.current.errorMessages).toHaveLength(0);
  });

  it("returns valid with more than 2 valid candidates", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice", description: "First candidate" },
      { id: "2", name: "Bob", description: "Second candidate" },
      { id: "3", name: "Charlie", description: "Third candidate" },
    ];

    const { result } = renderHook(() => useCandidateValidation(candidates));

    expect(result.current.isValid).toBe(true);
    expect(result.current.errorMessages).toHaveLength(0);
  });
});
