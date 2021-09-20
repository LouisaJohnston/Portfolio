import Bar from "./Bar";
import { useState, useEffect } from "react";

export default function Graph({ projects, mostUsed }) {

  const renderBars = () => {
    return mostUsed.map((tech, techIdx) => {
      let techProjectsArr = [];
      projects.forEach((project) => {
        if (project.tech.includes(tech.tech)) {
          techProjectsArr.push(project.name);
        }
      });
      const percent = (tech.count / mostUsed[0].count) * 100;
      return ( 
        <div key={`${techIdx}`} className="bar-holder">
          <Bar key={tech.tech} percent={percent} tech={tech} />
          <div className="tech-projects">
            <div>
              <ul>
                {techProjectsArr.map((projectName, projectIdx) => {
                  return <li key={`${projectIdx}`}>{projectName}</li>;
                })}
              </ul> 
            </div>
            <p className="project-glyph"> &#9002; </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="graph-wrapper">
      <div className="graph">
        <div className="bar-lines-container">{renderBars()}</div>
      </div>
    </div>
  );
}
