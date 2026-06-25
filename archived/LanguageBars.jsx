export default function LanguageBars({ languages, loading }) {
  const maxBytes = languages[0]?.size || 1;
  const totalBytes = languages.reduce((s, l) => s + l.size, 0);

  if (loading) return <p className="loading-state">Loading…</p>;

  return (
    <div className="graph-wrapper">
      <div className="graph">
        <div className="bar-lines-container">
          {languages.map((lang, i) => (
            <div key={i} className="bar-holder lang-bar-holder">
              <div
                style={{ width: `${(lang.size / maxBytes) * 100}%` }}
                className="bar"
              >
                <span className="graphLabel">{lang.name} | </span>
                {((lang.size / totalBytes) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
