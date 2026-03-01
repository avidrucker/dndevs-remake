import { describe, expect, it } from "vitest";
import { skills } from "./skills";
import { loadLegacySkills } from "../test/loadLegacySkills";

describe("skills data port", () => {
  it("matches the legacy skill definitions exactly", () => {
    expect(skills).toEqual(loadLegacySkills());
  });

  it("keeps all 26 legacy skill ids in ascending order", () => {
    expect(skills).toHaveLength(26);
    expect(skills.map((skill) => skill.id)).toEqual(
      Array.from({ length: 26 }, (_, index) => index + 1)
    );
  });
});
