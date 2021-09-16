export default function Bar({ percent, tech }) {
  return (
    <div style={{width: `${percent}%`}} className="bar">
      <span className="graphLabel">{tech.tech} | </span>
      {tech.count} Apps
    </div>
  );
}
