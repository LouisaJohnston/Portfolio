export default function Bar({ percent, tech, techProjectsArr }) {
  console.log(techProjectsArr);

  
  return (
      <div style={{ width: `${percent}%` }} className="bar">
        <span className="graphLabel">{tech.tech} | </span>
        {tech.count} Apps
      </div>
  );
}
