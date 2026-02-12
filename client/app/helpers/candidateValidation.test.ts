import { describe, it, expect } from "vitest";
import {
  findDuplicateIds,
  findEmptyFields,
  Candidate,
  generateCandidateId,
} from "./candidateValidation";

describe("generateCandidateId", () => {
  it("generates unique IDs", () => {
    const id1 = generateCandidateId();
    const id2 = generateCandidateId();
    expect(id1).not.toBe(id2);
  });

  it("generates IDs starting with 'candidate-'", () => {
    const id = generateCandidateId();
    expect(id.startsWith("candidate-")).toBe(true);
  });
});

describe("findDuplicateIds", () => {
  it("returns empty set when all names are unique", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice", description: "Candidate A" },
      { id: "2", name: "Bob", description: "Candidate B" },
      { id: "3", name: "Charlie", description: "Candidate C" },
    ];

    const result = findDuplicateIds(candidates);
    expect(result.size).toBe(0);
  });

  it("returns IDs of candidates with duplicate names", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice", description: "Candidate A" },
      { id: "2", name: "Bob", description: "Candidate B" },
      { id: "3", name: "Alice", description: "Candidate C" },
    ];

    const result = findDuplicateIds(candidates);
    expect(result.has("1")).toBe(true);
    expect(result.has("3")).toBe(true);
    expect(result.has("2")).toBe(false);
  });

  it("performs case-insensitive duplicate detection", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice", description: "Candidate A" },
      { id: "2", name: "ALICE", description: "Candidate B" },
      { id: "3", name: "alice", description: "Candidate C" },
    ];

    const result = findDuplicateIds(candidates);
    expect(result.size).toBe(3);
    expect(result.has("1")).toBe(true);
    expect(result.has("2")).toBe(true);
    expect(result.has("3")).toBe(true);
  });

  it("ignores empty names when checking duplicates", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "", description: "Candidate A" },
      { id: "2", name: "", description: "Candidate B" },
    ];

    const result = findDuplicateIds(candidates);
    expect(result.size).toBe(0);
  });

  it("trims whitespace when comparing names", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice ", description: "Candidate A" },
      { id: "2", name: " Alice", description: "Candidate B" },
    ];

    const result = findDuplicateIds(candidates);
    expect(result.size).toBe(2);
  });
});

describe("findEmptyFields", () => {
  it("returns empty map when all fields are filled", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice", description: "Candidate A" },
      { id: "2", name: "Bob", description: "Candidate B" },
    ];

    const result = findEmptyFields(candidates);
    expect(result.size).toBe(0);
  });

  it("identifies candidates with empty name", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "", description: "Candidate A" },
      { id: "2", name: "Bob", description: "Candidate B" },
    ];

    const result = findEmptyFields(candidates);
    expect(result.size).toBe(1);
    expect(result.get("1")?.has("name")).toBe(true);
    expect(result.get("1")?.has("description")).toBe(false);
  });

  it("identifies candidates with empty description", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "Alice", description: "" },
      { id: "2", name: "Bob", description: "Candidate B" },
    ];

    const result = findEmptyFields(candidates);
    expect(result.size).toBe(1);
    expect(result.get("1")?.has("description")).toBe(true);
    expect(result.get("1")?.has("name")).toBe(false);
  });

  it("identifies candidates with both fields empty", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "", description: "" },
      { id: "2", name: "Bob", description: "Candidate B" },
    ];

    const result = findEmptyFields(candidates);
    expect(result.size).toBe(1);
    expect(result.get("1")?.has("name")).toBe(true);
    expect(result.get("1")?.has("description")).toBe(true);
  });

  it("treats whitespace-only fields as empty", () => {
    const candidates: Candidate[] = [
      { id: "1", name: "   ", description: "  " },
    ];

    const result = findEmptyFields(candidates);
    expect(result.size).toBe(1);
    expect(result.get("1")?.has("name")).toBe(true);
    expect(result.get("1")?.has("description")).toBe(true);
  });
});
