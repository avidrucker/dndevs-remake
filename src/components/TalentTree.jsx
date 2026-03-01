import SkillDependency from "./SkillDependency";
import SkillNode from "./SkillNode";

function TalentTree({ skills }) {
  return (
    <div className="talent-tree">
      <h2 className="start-helper active">Start here!</h2>

      {skills
        .filter((skill) => skill.dependsOn && skill.dependsOn.length > 0)
        .map((skill) => (
          <SkillDependency key={`dependency-${skill.id}`} skillId={skill.id} />
        ))}

      {skills.map((skill) => (
        <SkillNode
          key={skill.id}
          skillId={skill.id}
          title={skill.title}
          description={skill.description}
          points={skill.points}
          maxPoints={skill.maxPoints}
          stats={skill.stats}
          talents={skill.talents}
          links={skill.links}
        />
      ))}
    </div>
  );
}

export default TalentTree;
