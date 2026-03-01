import { useState } from "react";
import Intro from "./components/Intro";
import TalentTree from "./components/TalentTree";
import AvatarPanel from "./components/AvatarPanel";
import { skills as legacySkills } from "./data/skills";

const treeSkills = legacySkills.map((skill) => ({
  ...skill,
  points: 0,
  maxPoints: skill.maxPoints ?? 1,
  stats: skill.stats ?? [],
  talents: skill.talents ?? [],
  links: skill.links ?? [],
}));

const placeholderStats = [
  { title: "Charisma", value: 9 },
  { title: "Dexterity", value: 9 },
  { title: "Fortitude", value: 9 },
  { title: "Intellect", value: 9 },
  { title: "Strength", value: 9 },
  { title: "Wisdom", value: 9 },
];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarName, setAvatarName] = useState("Your Name");
  const [portrait, setPortrait] = useState(1);

  const openTree = () => setIsOpen(true);
  const prevPortrait = () => setPortrait((current) => (current === 1 ? 22 : current - 1));
  const nextPortrait = () => setPortrait((current) => (current === 22 ? 1 : current + 1));

  return (
    <div className="ltIE9-hide">
      <div className={`page animated${isOpen ? " open" : ""}`}>
        <header>
          <img
            src="/dndevs-remake/img/logo.png"
            className="logo"
            alt="Dungeons and Developers"
            onClick={openTree}
          />
        </header>

        <Intro isOpen={isOpen} onOpen={openTree} />
        <TalentTree skills={treeSkills} />
        <AvatarPanel
          avatarName={avatarName}
          portrait={portrait}
          level={1}
          stats={placeholderStats}
          talentSummary="Choose your path."
          onPrevPortrait={prevPortrait}
          onNextPortrait={nextPortrait}
          onNameChange={setAvatarName}
        />

        <div className="sign-off">
          <h2>It&apos;s dangerous to go alone!</h2>
          <p>
            The original footer links and sharing tools will return after the
            legacy behavior is fully ported.
          </p>
          <ul>
            <li>
              <a href="https://alistapart.com/" target="_blank" rel="noreferrer">
                A List Apart
              </a>
            </li>
            <li>
              <a
                href="https://www.smashingmagazine.com/"
                target="_blank"
                rel="noreferrer"
              >
                Smashing Magazine
              </a>
            </li>
            <li>
              <a href="https://stackoverflow.com/" target="_blank" rel="noreferrer">
                Stack Overflow
              </a>
            </li>
          </ul>
          <h3>Happy adventuring!</h3>
          <a
            href="https://www.threefivetwo.com/"
            target="_blank"
            rel="noreferrer"
            className="logo-352"
          >
            <img src="/dndevs-remake/img/logo352.png" alt="352" />
          </a>
        </div>

        <div className="who-made-this">
          <h1>Who made this?</h1>
          <p>
            This remake preserves the original Dungeons &amp; Developers layout
            and experience while replacing the legacy jQuery and Knockout stack
            with React and Vite.
          </p>
          <p>
            The content, behavior, and sharing rules will be restored in later
            steps as the legacy implementation is ported into React modules.
          </p>
          <hr />
          <div>
            <p style={{ float: "right" }}>
              Character illustrations provided by StarkWhite Studios.
            </p>
            <p style={{ float: "left" }}>
              Rebuilt with React, Vite, and Tachyons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
