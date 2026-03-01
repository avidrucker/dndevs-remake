function getPoints(pointsBySkillId, skillId) {
  return Number(pointsBySkillId?.[skillId] || 0);
}

function hasPoints(pointsBySkillId, skillId) {
  return getPoints(pointsBySkillId, skillId) > 0;
}

function hasMaxPoints(pointsBySkillId, skill) {
  return getPoints(pointsBySkillId, skill.id) >= (skill.maxPoints ?? 1);
}

function prettyJoin(items) {
  if (items.length > 2) {
    return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
  }

  return items.join(" and ");
}

export function depsFulfilled(pointsBySkillId, skill) {
  const dependsOn = skill.dependsOn ?? [];
  return dependsOn.every((dependencyId) => hasPoints(pointsBySkillId, dependencyId));
}

export function dependentsUsed(pointsBySkillId, skill, skills = []) {
  return skills.some(
    (candidate) =>
      (candidate.dependsOn ?? []).includes(skill.id) &&
      hasPoints(pointsBySkillId, candidate.id)
  );
}

export function canAddPoints(pointsBySkillId, skill) {
  return depsFulfilled(pointsBySkillId, skill) && !hasMaxPoints(pointsBySkillId, skill);
}

export function canRemovePoints(pointsBySkillId, skill, skills = []) {
  const points = getPoints(pointsBySkillId, skill.id);
  const usedByDependents = dependentsUsed(pointsBySkillId, skill, skills);

  return (usedByDependents && points > 1) || (!usedByDependents && points > 0);
}

export function helpMessage(pointsBySkillId, skill, skills = []) {
  if (!depsFulfilled(pointsBySkillId, skill)) {
    const blockedBy = (skill.dependsOn ?? [])
      .map((dependencyId) => skills.find((candidate) => candidate.id === dependencyId))
      .filter(Boolean)
      .filter((dependency) => getPoints(pointsBySkillId, dependency.id) < (dependency.maxPoints ?? 1))
      .map((dependency) => dependency.title);

    return `Learn ${prettyJoin(blockedBy)} to unlock.`;
  }

  if (canAddPoints(pointsBySkillId, skill)) {
    return "Click to add a point!";
  }

  return "";
}

export function currentRankDescription(skill, points) {
  return (skill.rankDescriptions ?? [])[points - 1];
}

export function nextRankDescription(skill, points) {
  return (skill.rankDescriptions ?? [])[points];
}
