import { useState, useEffect } from 'react';

function levelColor(count) {
  if (count === 0) return '#ede9ed';
  if (count <= 3) return '#b3d1d1';
  if (count <= 7) return '#669999';
  if (count <= 14) return '#4a7a7a';
  return '#4d2b43';
}

export default function GitHubContributions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/github-contributions')
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="contrib-status">Loading activity…</p>;
  if (!data) return null;

  const { contributions, languages } = data;
  const totalBytes = languages.reduce((s, l) => s + l.size, 0);
  const maxBytes = languages[0]?.size || 1;

  return (
    <div className="contrib-wrapper">
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

      <h3 className="less-flush">Languages</h3>
      <div className="graph-wrapper">
        <div className="graph">
          <div className="bar-lines-container">
            {languages.map((lang, i) => {
              const pct = (lang.size / maxBytes) * 100;
              const share = ((lang.size / totalBytes) * 100).toFixed(1);
              return (
                <div key={i} className="bar-holder lang-bar-holder">
                  <div
                    style={{ width: `${pct}%`, background: lang.color || '#669999' }}
                    className="bar"
                  >
                    <span className="graphLabel">{lang.name} | </span>
                    {share}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
