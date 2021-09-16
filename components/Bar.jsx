export default function Bar({ percent, tech }) {
  return (
    <div className="bar" style={{ width: `${percent}%`}}>
      <span className="graphLabel">{tech.tech}</span> ({tech.count} Apps)
    </div>
  );
}
