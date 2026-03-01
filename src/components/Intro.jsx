function Intro({ isOpen, onOpen }) {
  return (
    <div className={`intro${isOpen ? " hide" : ""}`}>
      <img
        src="/dndevs-remake/img/brought-to-you-by-352.png"
        className="brought-to-you"
        alt="Brought to you by 352"
      />
      <img
        src="/dndevs-remake/img/screenshot.png"
        alt="Dungeons and Developers preview"
        onClick={onOpen}
      />
      <div className="content">
        <h2>
          An RPG-style talent tree
          <br />
          for web developers
        </h2>
        <p>
          As professional nerds, we love role-playing games. And we love web
          development. Naturally, we wondered what a character talent tree for a
          web developer might look like.
        </p>
        <h3>So, we decided to build one.</h3>
        <button type="button" onClick={onOpen}>
          Open the talent tree &raquo;
        </button>
      </div>
    </div>
  );
}

export default Intro;
