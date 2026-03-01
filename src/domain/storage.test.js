import { beforeEach, describe, expect, it } from "vitest";
import { loadState, saveState } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when no saved state exists", () => {
    expect(loadState()).toBeNull();
  });

  it("saves and restores state with the required storage key", () => {
    const state = {
      isOpen: true,
      avatarName: "Avi",
      portrait: 6,
      pointsBySkillId: { 1: 2, 2: 1 },
    };

    saveState(state);

    expect(window.localStorage.getItem("dndevs_state_v1")).toBe(
      JSON.stringify(state)
    );
    expect(loadState()).toEqual(state);
  });

  it("returns null for invalid saved JSON", () => {
    window.localStorage.setItem("dndevs_state_v1", "{bad json");

    expect(loadState()).toBeNull();
  });
});
