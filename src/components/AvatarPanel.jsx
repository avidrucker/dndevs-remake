function AvatarPanel({
  avatarName,
  portrait,
  level,
  stats,
  talentSummary,
  onPrevPortrait,
  onNextPortrait,
  onNameChange,
}) {
  return (
    <div className="avatar">
      <div className="portrait">
        <img
          src={`/dndevs-remake/img/portrait-${portrait}.jpg`}
          alt={`Portrait ${portrait}`}
        />
      </div>
      <div className="portrait-controls">
        <button type="button" onClick={onPrevPortrait}>
          &laquo;
        </button>
        <button type="button" onClick={onNextPortrait}>
          &raquo;
        </button>
      </div>
      <div className="details">
        <input
          value={avatarName}
          onChange={(event) => onNameChange(event.target.value)}
          className="h2"
        />
        <div className="level">
          Level <span className="value">{level}</span> Web Developer
        </div>
        <div className="talent-summary">{talentSummary}</div>
        <ul className="stats">
          {stats.map((stat) => (
            <li key={stat.title}>
              <span className="title">{stat.title}</span>:{" "}
              <span className="value">{stat.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AvatarPanel;
