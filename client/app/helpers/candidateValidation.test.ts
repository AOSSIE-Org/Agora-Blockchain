import { describe, it, expect } from "vitest";
import {
  findDuplicateIndices,
  findEmptyFields,
  Candidate,
} from "./candidateValidation";

describe("findDuplicateIndices", () => {
  it("returns empty set when all names are unique", () => {
    const candidates: Candidate[] = [
      { name: "Alice", description: "Candidate A" },
      { name: "Bob", description: "Candidate B" },
      { name: "Charlie", description: "Candidate C" },
    ];

    const result = findDuplicateIndices(candidates);
    expect(result.size).toBe(0);
  });

  it("returns indices of candidates with duplicate names", () => {
    const candidates: Candidate[] = [
      { name: "Alice", description: "Candidate A" },
      { name: "Bob", description: "Candidate B" },
      { name: "Alice", description: "Candidate C" },
    ];

    const result = findDuplicateIndices(candidates);
    expect(result.has(0)).toBe(true);
    expect(result.has(2)).toBe(true);
    expect(result.has(1)).toBe(false);
  });

  it("performs case-insensitive duplicate detection", () => {
    const candidates: Candidate[] = [
      { name: "Alice", description: "Candidate A" },
      { name: "ALICE", description: "Candidate B" },
      { name: "alice", description: "Candidate C" },
    ];

    const result = findDuplicateIndices(candidates);
    expect(result.size).toBe(3);
    expect(result.has(0)).toBe(true);
    expect(result.has(1)).toBe(true);
    expect(result.has(2)).toBe(true);
  });

  it("ignores empty names when checking duplicates", () => {
    const candidates: Candidate[] = [
      { name: "", description: "Candidate A" },
      { name: "", description: "Candidate B" },
    ];

    const result = findDuplicateIndices(candidates);
    expect(result.size).toBe(0);
  });

  it("trims whitespace when comparing names", () => {
    const candidates: Candidate[] = [
      { name: "Alice ", description: "Candidate A" },
      { name: " Alice", description: "Candidate B" },
    ];

    const result = findDuplicateIndices(candidates);
    expect(result.size).toBe(2);
  });
});

describe("findEmptyFields", () => {
  it("returns empty map when all fields are filled", () => {
    const candidates: Candidate[] = [
      { name: "Alice", description: "Candidate A" },
      { name: "Bob", description: "Candidate B" },
    ];

    const result = findEmptyFields(candidates);
    expect(result.size).toBe(0);
  });

  it("identifies candidates with empty name", () => {
    const candidates: Candidate[] = [
      { name: "", description: "Candidate A" },
      { name: "Bob", description: "Candidate B" },
    ];

    const result = findEmptyFields(candidates);
    expect(result.size).toBe(1);
    expect(result.get(0)?.has("name")).toBe(true);
    expect(result.get(0)?.has("description")).toBe(false);
  });

  it("identifies candidates with empty description", () => {
    const candidates: Candidate[] = [
      { name: "Alice", description: "" },
      { name: "Bob", description: "Candidate B" },
    ];

    const result = findEmptyFields(candidates);
    expect(result.size).toBe(1);
    expect(result.get(0)?.has("description")).toBe(true);
    expect(result.get(0)?.has("name")).toBe(false);
  });

  it("identifies candidates with both fields empty", () => {
    const candidates: Candidate[] = [
      { name: "", description: "" },
      { name: "Bob", description: "Candidate B" },
    ];

    const result = findEmptyFields(candidates);
    expect(result.size).toBe(1);
    expect(result.get(0)?.has("name")).toBe(true);
    expect(result.get(0)?.has("description")).toBe(true);
  });

  it("treats whitespace-only fields as empty", () => {
    const candidates: Candidate[] = [
      { name: "   ", description: "  " },
    ];

    const result = findEmptyFields(candidates);
    expect(result.size).toBe(1);
    expect(result.get(0)?.has("name")).toBe(true);
    expect(result.get(0)?.has("description")).toBe(true);
  });
});
