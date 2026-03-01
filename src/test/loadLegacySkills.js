import { readFileSync } from "node:fs";
import vm from "node:vm";

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

  return sandbox.tft.dnd.data.skills;
}
