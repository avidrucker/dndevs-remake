function SkillDependency({ skillId }) {
  return (
    <div className="skill" data-skill-id={skillId}>
      <div className="skill-dependency active"></div>
    </div>
  );
}

export default SkillDependency;
