import { readFileSync } from "node:fs";
import vm from "node:vm";

function normalizeArchiveUrls(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeArchiveUrls);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [
        key,
        normalizeArchiveUrls(entryValue),
      ])
    );
  }

  if (typeof value === "string") {
    return value.replace(
      /^https:\/\/web\.archive\.org\/web\/\d+\/(https?:\/\/)/,
      "$1"
    );
  }

  return value;
}

export function loadLegacySkills() {
  const code = readFileSync("legacy/tft.dnd.data.js", "utf8");
  const sandbox = {
    self: {},
    window: {},
    document: {},
    location: {},
    top: {},
    parent: {},
    frames: {},
    opens: {},
  };

  sandbox.self = sandbox;
  sandbox.namespace = (name) =>
    name.split(".").reduce((value, key) => {
      value[key] ||= {};
      return value[key];
    }, sandbox);

  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  return normalizeArchiveUrls(sandbox.tft.dnd.data.skills);
}
