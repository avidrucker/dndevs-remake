function SkillDependency({ skill }) {
  const classes = [
    "skill",
    skill.canAddPoints ? "can-add-points" : "",
    skill.hasPoints ? "has-points" : "",
    skill.hasMaxPoints ? "has-max-points" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} data-skill-id={skill.id}>
      <div
        className={`skill-dependency${skill.dependenciesFulfilled ? " active" : ""}`}
      ></div>
    </div>
  );
}

export default SkillDependency;
