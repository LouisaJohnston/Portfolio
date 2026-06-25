import { levelColor } from '../lib/levelColor';

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
