import SkillDependency from "./SkillDependency";
import SkillNode from "./SkillNode";

function TalentTree({ skills, totalPoints, onAddPoint, onRemovePoint, children }) {
  return (
    <div className="talent-tree">
      {children}
      <h2 className={`start-helper${totalPoints === 0 ? " active" : ""}`}>
        Start here!
      </h2>

      {skills
        .filter((skill) => skill.dependsOn && skill.dependsOn.length > 0)
        .map((skill) => (
          <SkillDependency key={`dependency-${skill.id}`} skill={skill} />
        ))}

      {skills.map((skill) => (
        <SkillNode
          key={skill.id}
          skill={skill}
          onAddPoint={onAddPoint}
          onRemovePoint={onRemovePoint}
        />
      ))}
    </div>
  );
}

export default TalentTree;
