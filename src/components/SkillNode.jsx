function SkillNode({ skill, onAddPoint, onRemovePoint }) {
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
      <div className="icon-container">
        <div className="icon"></div>
      </div>
      <div className="frame">
        <div className="tool-tip">
          <h3 className="skill-name">{skill.title}</h3>
          <div className="skill-description">{skill.description}</div>
          <ul className="skill-links">
            {skill.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {(skill.currentRankDescription || skill.nextRankDescription) ? <hr /> : null}
          {skill.currentRankDescription ? (
            <div className="current-rank-description">
              Current rank: {skill.currentRankDescription}
            </div>
          ) : null}
          {skill.nextRankDescription ? (
            <div className="next-rank-description">
              Next rank: {skill.nextRankDescription}
            </div>
          ) : null}
          <hr />
          <ul className="stats">
            {skill.stats.map((stat) => (
              <li key={stat.title}>
                <span className="value">+{stat.value}</span>{" "}
                <span className="title">{stat.title}</span>
              </li>
            ))}
          </ul>
          {skill.talentSummary ? (
            <div className="talent-summary">Grants {skill.talentSummary}</div>
          ) : null}
          <div
            className={`help-message${skill.dependenciesFulfilled ? " positive" : ""}`}
          >
            {skill.helpMessage}
          </div>
        </div>
        <div className="skill-points">
          <span className="points">{skill.points}</span>/
          <span className="max-points">{skill.maxPoints}</span>
        </div>
        <div
          className="hit-area"
          role="button"
          tabIndex={0}
          aria-label={`Add or remove points for ${skill.title}`}
          onClick={() => onAddPoint(skill.id)}
          onContextMenu={(event) => {
            event.preventDefault();
            onRemovePoint(skill.id);
          }}
        ></div>
      </div>
    </div>
  );
}

export default SkillNode;
