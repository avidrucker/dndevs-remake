const BASE_STATS = {
  Charisma: 9,
  Dexterity: 9,
  Fortitude: 9,
  Intellect: 9,
  Strength: 9,
  Wisdom: 9,
};

export function computeTotalPoints(pointsBySkillId) {
  return Object.values(pointsBySkillId ?? {}).reduce(
    (total, points) => total + Number(points || 0),
    0
  );
}

export function computeLevel(pointsBySkillId) {
  return computeTotalPoints(pointsBySkillId) + 1;
}

export function computeStats(pointsBySkillId, skills) {
  const totals = { ...BASE_STATS };

  skills.forEach((skill) => {
    const points = Number(pointsBySkillId?.[skill.id] || 0);

    if (points > 0) {
      (skill.stats ?? []).forEach((stat) => {
        totals[stat.title] = (totals[stat.title] || 0) + stat.value * points;
      });
    }
  });

  return Object.entries(totals).map(([title, value]) => ({ title, value }));
}

export function computeTalentSummary(pointsBySkillId, skills) {
  return skills
    .filter((skill) => Number(pointsBySkillId?.[skill.id] || 0) > 0)
    .flatMap((skill) => skill.talents ?? [])
    .join(", ");
}
