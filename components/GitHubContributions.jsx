function levelColor(count) {
  if (count === 0) return '#ede9ed';
  if (count <= 3) return '#b3d1d1';
  if (count <= 7) return '#669999';
  if (count <= 14) return '#4a7a7a';
  return '#4d2b43';
}

export default function GitHubContributions({ contributions, loading }) {
  if (loading) return (
    <div className="graph-wrapper" style={{ marginLeft: "20%", marginRight: "20%", maxWidth: "none" }}>
      <p className="loading-state">Loading…</p>
    </div>
  );
  if (!contributions) return null;

  return (
    <div className="graph-wrapper" style={{ marginLeft: "20%", marginRight: "20%", maxWidth: "none" }}>
      <p className="contrib-meta">
        <span className="contrib-count">{contributions.total.toLocaleString()}</span>
        {' '}contributions in the last year
      </p>
      <div className="contrib-grid">
        {contributions.weeks.map((week, wi) => (
          <div key={wi} className="contrib-week">
            {week.days.map((day, di) => (
              <div
                key={di}
                className="contrib-day"
                title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                style={{ backgroundColor: levelColor(day.count) }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
