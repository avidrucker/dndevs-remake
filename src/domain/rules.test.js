import { describe, expect, it } from "vitest";
import { skills } from "../data/skills";
import {
  canAddPoints,
  canRemovePoints,
  currentRankDescription,
  dependentsUsed,
  depsFulfilled,
  helpMessage,
  nextRankDescription,
} from "./rules";

const getSkill = (id) => skills.find((skill) => skill.id === id);

describe("rules", () => {
  it("requires all dependencies to have points before unlocking a skill", () => {
    expect(depsFulfilled({}, getSkill(2))).toBe(false);
    expect(depsFulfilled({ 1: 1 }, getSkill(2))).toBe(true);
    expect(depsFulfilled({ 12: 1 }, getSkill(15))).toBe(false);
    expect(depsFulfilled({ 12: 1, 14: 1 }, getSkill(15))).toBe(true);
  });

  it("detects when dependents are currently using a prerequisite", () => {
    expect(dependentsUsed({}, getSkill(1), skills)).toBe(false);
    expect(dependentsUsed({ 2: 1 }, getSkill(1), skills)).toBe(true);
    expect(dependentsUsed({ 26: 1 }, getSkill(5), skills)).toBe(true);
  });

  it("matches the legacy point add and removal rules", () => {
    expect(canAddPoints({}, getSkill(1))).toBe(true);
    expect(canAddPoints({ 1: 2 }, getSkill(1))).toBe(false);
    expect(canAddPoints({}, getSkill(2))).toBe(false);
    expect(canAddPoints({ 1: 1 }, getSkill(2))).toBe(true);

    expect(canRemovePoints({ 1: 1 }, getSkill(1), skills)).toBe(true);
    expect(canRemovePoints({ 1: 1, 2: 1 }, getSkill(1), skills)).toBe(false);
    expect(canRemovePoints({ 1: 2, 2: 1 }, getSkill(1), skills)).toBe(true);
  });

  it("produces the same help messages and rank descriptions as the legacy UI", () => {
    expect(helpMessage({}, getSkill(15), skills)).toBe(
      "Learn Server-side Frameworks and Advanced DB Management to unlock."
    );
    expect(helpMessage({ 1: 1 }, getSkill(2), skills)).toBe(
      "Click to add a point!"
    );
    expect(helpMessage({ 1: 2 }, getSkill(1), skills)).toBe("");

    expect(currentRankDescription(getSkill(1), 0)).toBeUndefined();
    expect(currentRankDescription(getSkill(1), 1)).toBe(
      "You understand how to create and view a basic web page."
    );
    expect(nextRankDescription(getSkill(1), 1)).toBe(
      "You understand how to link pages together, design multi-column layouts, and work with form fields and media elements."
    );
    expect(nextRankDescription(getSkill(1), 2)).toBeUndefined();
  });
});
