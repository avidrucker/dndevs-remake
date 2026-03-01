import { canAddPoints } from "./rules";

const ASCII_OFFSET = 96;

function isDigit(value) {
  return /^\d$/.test(value);
}

function getSkillHash(pointsBySkillId) {
  return Object.entries(pointsBySkillId ?? {})
    .map(([skillId, points]) => ({
      skillId: Number(skillId),
      points: Number(points || 0),
    }))
    .filter((entry) => entry.points > 0)
    .sort((left, right) => left.skillId - right.skillId)
    .flatMap((entry) => {
      const encoded = [String.fromCharCode(entry.skillId + ASCII_OFFSET)];
      if (entry.points > 1) {
        encoded.push(String(entry.points));
      }
      return encoded;
    })
    .join("");
}

export function encodeHash(state) {
  return [
    "",
    getSkillHash(state.pointsBySkillId),
    state.portrait ?? "",
    state.avatarName ?? "",
  ].join("_");
}

export function decodeHash(hash) {
  const normalizedHash = String(hash || "").replace(/^#/, "");
  const [, skillSegment = "", portraitSegment = "", avatarName = ""] =
    normalizedHash.split("_");

  const allocations = [];
  const hashCharacters = skillSegment.split("");

  for (let index = 0; index < hashCharacters.length; index += 1) {
    const current = hashCharacters[index];

    if (!isDigit(current)) {
      const skillId = current.charCodeAt(0) - ASCII_OFFSET;
      const next = hashCharacters[index + 1];
      const points = Number(next) || 1;

      allocations.push({ skillId, points });
    }
  }

  return {
    allocations,
    portrait: portraitSegment ? Number(portraitSegment) : undefined,
    avatarName: avatarName ? decodeURIComponent(avatarName) : "",
  };
}

export function applyDecodedBuild(decoded, skills) {
  const pointsBySkillId = {};
  const allocationState = decoded.allocations
    .map((allocation) => ({
      ...allocation,
      skill: skills.find((skill) => skill.id === allocation.skillId),
      wasAllocated: false,
    }))
    .filter((allocation) => allocation.skill);

  let pointsWereAllocated = true;

  while (pointsWereAllocated) {
    pointsWereAllocated = false;

    allocationState.forEach((allocation) => {
      if (!allocation.wasAllocated && canAddPoints(pointsBySkillId, allocation.skill)) {
        pointsBySkillId[allocation.skill.id] = Math.min(
          allocation.skill.maxPoints ?? 1,
          allocation.points
        );
        allocation.wasAllocated = true;
        pointsWereAllocated = true;
      }
    });
  }

  return {
    pointsBySkillId,
    portrait: decoded.portrait,
    avatarName: decoded.avatarName,
  };
}
