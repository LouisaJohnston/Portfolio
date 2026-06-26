import { useState } from 'react';
import { levelColor } from '../lib/levelColor';
import { formatDate } from '../lib/formatDate';
import ContribSpinner from './ContribSpinner';

function formatCount(count) {
  return `${count} contribution${count !== 1 ? 's' : ''}`;
}

export default function GitHubContributions({ contributions, loading }) {
  // The day the pointer/focus is currently on, plus where to anchor the tooltip.
  const [active, setActive] = useState(null);

  if (loading) return (
    <div className="graph-wrapper contrib-wrapper">
      <ContribSpinner />
    </div>
  );
  if (!contributions) return null;

  const show = (day, el) => setActive({ ...day, x: el.offsetLeft, y: el.offsetTop });
  const hide = () => setActive(null);

  return (
    <div className="graph-wrapper contrib-wrapper">
      <p className="contrib-meta">
        <span className="contrib-count">{contributions.total.toLocaleString()}</span>
        {' '}contributions in the last year
      </p>
      <div className="contrib-grid-area">
        <div className="contrib-grid">
          {contributions.weeks.map((week, wi) => (
            <div key={wi} className="contrib-week">
              {week.days.map((day, di) => (
                <div
                  key={di}
                  className="contrib-day"
                  tabIndex={0}
                  aria-label={`${day.date}: ${formatCount(day.count)}`}
                  style={{ backgroundColor: levelColor(day.count) }}
                  onMouseEnter={(e) => show(day, e.currentTarget)}
                  onMouseLeave={hide}
                  onFocus={(e) => show(day, e.currentTarget)}
                  onBlur={hide}
                />
              ))}
            </div>
          ))}
        </div>
        {active && (
          <div className="contrib-tooltip" role="tooltip" style={{ left: active.x, top: active.y }}>
            <strong>{formatCount(active.count)}</strong>
            <span className="contrib-tooltip-date">{formatDate(active.date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
