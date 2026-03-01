function SkillNode({
  skillId,
  title,
  description,
  points,
  maxPoints,
  stats,
  talents,
  links,
}) {
  const talentSummary = talents.join(", ");

  return (
    <div className="skill can-add-points" data-skill-id={skillId}>
      <div className="icon-container">
        <div className="icon"></div>
      </div>
      <div className="frame">
        <div className="tool-tip">
          <h3 className="skill-name">{title}</h3>
          <div className="skill-description">{description}</div>
          <ul className="skill-links">
            {links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <hr />
          <div className="current-rank-description">
            Current rank: Placeholder rank text
          </div>
          <div className="next-rank-description">
            Next rank: Detailed rank text arrives in step 2
          </div>
          <hr />
          <ul className="stats">
            {stats.length === 0 ? <li>No stat bonuses yet.</li> : null}
            {stats.map((stat) => (
              <li key={stat.title}>
                <span className="value">+{stat.value}</span>{" "}
                <span className="title">{stat.title}</span>
              </li>
            ))}
          </ul>
          {talentSummary ? (
            <div className="talent-summary">Grants {talentSummary}</div>
          ) : null}
          <div className="help-message positive">
            Placeholder node ready for legacy rules.
          </div>
        </div>
        <div className="skill-points">
          <span className="points">{points}</span>/<span className="max-points">{maxPoints}</span>
        </div>
        <div
          className="hit-area"
          onClick={(event) => event.preventDefault()}
          onContextMenu={(event) => event.preventDefault()}
        ></div>
      </div>
    </div>
  );
}

export default SkillNode;
