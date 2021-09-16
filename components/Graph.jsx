import Line from "./Line";
import BarTextContent from "./BarTextContent";
import Bar from "./Bar";

export default function Graph({ mostUsed }) {
  console.log(mostUsed);
  const renderLines = () => {
    return Array(10)
      .fill(null)
      .map((tech, i) => <Line left={i * 11.1} key={i} />);
  };

  const renderBars = () => {
      return mostUsed.map((tech) => {
        const percent = (tech.count / mostUsed[0].count) * 100;
        return (
            <Bar 
                key={tech.tech}
                percent={percent}
            />
        )
      });
    }
  };

  return (
    <div className="graph-wrapper">
      <div className="graph">
        <BarTextContent />
        <div className="bar-lines-container">
          {renderLines()}
          {renderBars()}

          {/* <Bar percent={50} />
          <Bar percent={25} />
          <Bar percent={25} /> */}
        </div>
      </div>
    </div>
  );
}
