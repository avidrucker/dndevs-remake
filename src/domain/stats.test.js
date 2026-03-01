import { describe, expect, it } from "vitest";
import { skills } from "../data/skills";
import {
  computeLevel,
  computeStats,
  computeTalentSummary,
  computeTotalPoints,
} from "./stats";

describe("stats", () => {
  it("computes total points and level from the allocated build", () => {
    const pointsBySkillId = { 1: 2, 2: 1, 8: 1 };

    expect(computeTotalPoints(pointsBySkillId)).toBe(4);
    expect(computeLevel(pointsBySkillId)).toBe(5);
  });

  it("starts all primary stats at 9 and adds bonuses per point spent", () => {
    const pointsBySkillId = { 1: 2, 2: 1, 8: 1, 26: 1 };

    expect(computeStats(pointsBySkillId, skills)).toEqual([
      { title: "Charisma", value: 17 },
      { title: "Dexterity", value: 15 },
      { title: "Fortitude", value: 12 },
      { title: "Intellect", value: 14 },
      { title: "Strength", value: 14 },
      { title: "Wisdom", value: 12 },
    ]);
  });

  it("concatenates granted talents in skill order", () => {
    const pointsBySkillId = { 2: 1, 5: 2, 7: 1, 26: 1 };

    expect(computeTalentSummary(pointsBySkillId, skills)).toBe(
      "Stylish, Sizzlin, Crafty, Demigod"
    );
  });
});
