import { useEffect, useReducer, useRef } from "react";
import Intro from "./components/Intro";
import TalentTree from "./components/TalentTree";
import AvatarPanel from "./components/AvatarPanel";
import { skills as legacySkills } from "./data/skills";
import {
  canAddPoints,
  canRemovePoints,
  currentRankDescription,
  depsFulfilled,
  helpMessage,
  nextRankDescription,
} from "./domain/rules";
import {
  applyDecodedBuild,
  decodeHash,
  encodeHash,
} from "./domain/hash";
import {
  computeLevel,
  computeStats,
  computeTalentSummary,
  computeTotalPoints,
} from "./domain/stats";
import { loadState, saveState } from "./domain/storage";

const creatorLinks = {
  threeFiveTwo: "https://www.threefivetwo.com/",
  react: "https://react.dev/",
  vite: "https://vite.dev/",
  tachyons: "https://tachyons.io/",
  starkWhiteStudios: "https://www.jasonluper.com/",
};

const skills = legacySkills.map((skill) => ({
  ...skill,
  maxPoints: skill.maxPoints ?? 1,
  stats: skill.stats ?? [],
  talents: skill.talents ?? [],
  links: skill.links ?? [],
  rankDescriptions: skill.rankDescriptions ?? [],
}));

const initialState = {
  isOpen: false,
  avatarName: "Your Name",
  portrait: 1,
  pointsBySkillId: {},
};

const HASH_DEBOUNCE_MS = 50;

function getHydratedStateFromHash(hash) {
  const decoded = decodeHash(hash);
  const applied = applyDecodedBuild(decoded, skills);

  return {
    ...initialState,
    ...applied,
    isOpen: true,
    portrait: applied.portrait ?? initialState.portrait,
    avatarName: applied.avatarName || initialState.avatarName,
  };
}

function getHydratedState() {
  if (typeof window === "undefined") {
    return { state: initialState, source: "default" };
  }

  const currentHash = window.location.hash;
  if (currentHash) {
    return {
      state: getHydratedStateFromHash(currentHash),
      source: "hash",
    };
  }

  const storedState = loadState();
  if (storedState) {
    return {
      state: {
        ...initialState,
        ...storedState,
        portrait: storedState.portrait ?? initialState.portrait,
        avatarName: storedState.avatarName || initialState.avatarName,
        pointsBySkillId: storedState.pointsBySkillId ?? {},
      },
      source: "storage",
    };
  }

  return { state: initialState, source: "default" };
}

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "toggleOpen":
      return { ...state, isOpen: !state.isOpen };
    case "open":
      return state.isOpen ? state : { ...state, isOpen: true };
    case "setAvatarName":
      return { ...state, avatarName: action.value };
    case "nextPortrait":
      return {
        ...state,
        portrait: state.portrait >= 22 ? 1 : state.portrait + 1,
      };
    case "prevPortrait":
      return {
        ...state,
        portrait: state.portrait <= 1 ? 22 : state.portrait - 1,
      };
    case "addPoint": {
      const skill = skills.find((item) => item.id === action.skillId);
      if (!skill || !canAddPoints(state.pointsBySkillId, skill)) {
        return state;
      }

      const nextPoints = (state.pointsBySkillId[skill.id] || 0) + 1;
      return {
        ...state,
        pointsBySkillId: {
          ...state.pointsBySkillId,
          [skill.id]: nextPoints,
        },
      };
    }
    case "removePoint": {
      const skill = skills.find((item) => item.id === action.skillId);
      if (!skill || !canRemovePoints(state.pointsBySkillId, skill, skills)) {
        return state;
      }

      const nextPoints = (state.pointsBySkillId[skill.id] || 0) - 1;
      const pointsBySkillId = { ...state.pointsBySkillId };

      if (nextPoints > 0) {
        pointsBySkillId[skill.id] = nextPoints;
      } else {
        delete pointsBySkillId[skill.id];
      }

      return {
        ...state,
        pointsBySkillId,
      };
    }
    default:
      return state;
  }
}

function App() {
  const initialSourceRef = useRef("default");
  const skippedInitialSaveRef = useRef(false);
  const skippedInitialHashRef = useRef(false);
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const hydrated = getHydratedState();
    initialSourceRef.current = hydrated.source;
    return hydrated.state;
  });

  const totalPoints = computeTotalPoints(state.pointsBySkillId);
  const treeSkills = skills.map((skill) => {
    const points = state.pointsBySkillId[skill.id] || 0;

    return {
      ...skill,
      points,
      hasPoints: points > 0,
      hasMaxPoints: points >= skill.maxPoints,
      canAddPoints: canAddPoints(state.pointsBySkillId, skill),
      canRemovePoints: canRemovePoints(state.pointsBySkillId, skill, skills),
      dependenciesFulfilled: depsFulfilled(state.pointsBySkillId, skill),
      helpMessage: helpMessage(state.pointsBySkillId, skill, skills),
      currentRankDescription: currentRankDescription(skill, points),
      nextRankDescription: nextRankDescription(skill, points),
      talentSummary: (skill.talents ?? []).join(", "),
    };
  });

  useEffect(() => {
    if (!skippedInitialSaveRef.current) {
      skippedInitialSaveRef.current = true;
      if (initialSourceRef.current === "default") {
        return;
      }
    }

    const timeoutId = window.setTimeout(() => {
      saveState(state);
    }, HASH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [state]);

  useEffect(() => {
    if (!skippedInitialHashRef.current) {
      skippedInitialHashRef.current = true;
      if (initialSourceRef.current === "default") {
        return;
      }
    }

    const timeoutId = window.setTimeout(() => {
      const nextHash = encodeHash(state);
      if (window.location.hash !== `#${nextHash}`) {
        window.location.hash = nextHash;
      }
    }, HASH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [state]);

  return (
    <div className="ltIE9-hide">
      <div className={`page animated${state.isOpen ? " open" : ""}`}>
        <header>
          <img
            src="/dndevs-remake/img/logo.png"
            className="logo"
            alt="Dungeons and Developers"
            onClick={() => dispatch({ type: "toggleOpen" })}
          />
        </header>

        <Intro
          isOpen={state.isOpen}
          onOpen={() => dispatch({ type: "open" })}
        />
        <TalentTree
          skills={treeSkills}
          totalPoints={totalPoints}
          onAddPoint={(skillId) => dispatch({ type: "addPoint", skillId })}
          onRemovePoint={(skillId) => dispatch({ type: "removePoint", skillId })}
        >
          <div className="who-made-this">
            <h1>Who made this?</h1>
            <p>
              <a
                href={creatorLinks.threeFiveTwo}
                target="_blank"
                rel="noreferrer"
              >
                Three Five Two
              </a>{" "}
              created the original <i>Dungeons &amp; Developers</i> experience.
              This remake preserves that layout and talent tree while rebuilding
              it with a modern React stack.
            </p>
            <p>
              The current rebuild is powered by{" "}
              <a href={creatorLinks.react} target="_blank" rel="noreferrer">
                React
              </a>
              ,{" "}
              <a href={creatorLinks.vite} target="_blank" rel="noreferrer">
                Vite
              </a>
              , and{" "}
              <a href={creatorLinks.tachyons} target="_blank" rel="noreferrer">
                Tachyons
              </a>
              , with the legacy behavior being ported into plain JavaScript
              modules step by step.
            </p>
            <hr />
            <div>
              <p style={{ float: "right" }}>
                Character illustrations provided by{" "}
                <a
                  href={creatorLinks.starkWhiteStudios}
                  target="_blank"
                  rel="noreferrer"
                >
                  StarkWhite Studios
                </a>
                .
              </p>
              <p style={{ float: "left" }}>
                Original creator:{" "}
                <a
                  href={creatorLinks.threeFiveTwo}
                  target="_blank"
                  rel="noreferrer"
                >
                  Three Five Two
                </a>
                .
              </p>
            </div>
          </div>
        </TalentTree>
        <AvatarPanel
          avatarName={state.avatarName}
          portrait={state.portrait}
          level={computeLevel(state.pointsBySkillId)}
          stats={computeStats(state.pointsBySkillId, skills)}
          talentSummary={computeTalentSummary(state.pointsBySkillId, skills)}
          onPrevPortrait={() => dispatch({ type: "prevPortrait" })}
          onNextPortrait={() => dispatch({ type: "nextPortrait" })}
          onNameChange={(value) => dispatch({ type: "setAvatarName", value })}
        />

        <div className="sign-off">
          <h2>It&apos;s dangerous to go alone!</h2>
          <p>
            <a
              href="https://x.com/threefivetwoinc"
              target="_blank"
              rel="noreferrer"
            >
              Follow @threefivetwoinc
            </a>
          </p>
          <p>
            Start with the original creators and the tools powering this remake,
            then branch out into a few enduring web-development watering holes.
          </p>
          <ul>
            <li>
              <a
                href={creatorLinks.threeFiveTwo}
                target="_blank"
                rel="noreferrer"
              >
                Three Five Two
              </a>
            </li>
            <li>
              <a
                href={creatorLinks.react}
                target="_blank"
                rel="noreferrer"
              >
                React Docs
              </a>
            </li>
            <li>
              <a href={creatorLinks.vite} target="_blank" rel="noreferrer">
                Vite Docs
              </a>
            </li>
            <li>
              <a href={creatorLinks.tachyons} target="_blank" rel="noreferrer">
                Tachyons
              </a>
            </li>
            <li>
              <a href="https://alistapart.com/" target="_blank" rel="noreferrer">
                A List Apart
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
            href={creatorLinks.threeFiveTwo}
            target="_blank"
            rel="noreferrer"
            className="logo-352"
          >
            <img src="/dndevs-remake/img/logo352.png" alt="Three Five Two" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
