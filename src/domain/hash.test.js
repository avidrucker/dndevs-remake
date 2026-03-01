import { describe, expect, it } from "vitest";
import { skills } from "../data/skills";
import { applyDecodedBuild, decodeHash, encodeHash } from "./hash";

describe("hash", () => {
  it("encodes the legacy skill, portrait, and avatar segments", () => {
    expect(
      encodeHash({
        pointsBySkillId: { 1: 2, 2: 1, 8: 1, 26: 1 },
        portrait: 7,
        avatarName: "Avi",
      })
    ).toBe("_a2bhz_7_Avi");
  });

  it("decodes the legacy hash segments without applying dependency rules yet", () => {
    expect(decodeHash("_a2bhz_7_Avi")).toEqual({
      allocations: [
        { skillId: 1, points: 2 },
        { skillId: 2, points: 1 },
        { skillId: 8, points: 1 },
        { skillId: 26, points: 1 },
      ],
      portrait: 7,
      avatarName: "Avi",
    });
  });

  it("allocates decoded points in dependency passes until the build stabilizes", () => {
    const decoded = decodeHash("_zoa2bc2e_11_Builder");

    expect(applyDecodedBuild(decoded, skills)).toEqual({
      pointsBySkillId: {
        1: 2,
        2: 1,
        3: 2,
      },
      portrait: 11,
      avatarName: "Builder",
    });
  });

  it("ignores unknown skill letters and clamps values to each skill max", () => {
    const decoded = decodeHash("_a9!c5_3_Test");

    expect(applyDecodedBuild(decoded, skills)).toEqual({
      pointsBySkillId: {
        1: 2,
      },
      portrait: 3,
      avatarName: "Test",
    });
  });
});
