import Bar from "./Bar";

export default function Graph({ mostUsed }) {
  const renderBars = () => {
    return mostUsed.map((tech) => {
      const percent = (tech.count / mostUsed[0].count) * 100;
      return <Bar key={tech.tech} percent={percent} tech={tech}/>;
    });
  };

  return (
    <div className="graph-wrapper">
      <div className="graph">
        <div className="bar-lines-container">
          {renderBars()}
        </div>
      </div>
    </div>
  );
}
