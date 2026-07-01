import { useLayoutEffect, useRef, useState } from 'react';
import { levelColor } from '../lib/levelColor';
import { formatDate } from '../lib/formatDate';
import { recentGrid, WEEKDAY_LABELS } from '../lib/contributions';
import ContribSpinner from './ContribSpinner';

function formatCount(count) {
  return `${count} contribution${count !== 1 ? 's' : ''}`;
}

export default function GitHubContributions({ contributions, loading }) {
  // The day the pointer/focus is currently on, plus where to anchor the tooltip.
  const [active, setActive] = useState(null);
  const tipRef = useRef(null);

  // Keep the tooltip inside the grid area horizontally. Without this an edge
  // cell (e.g. the Sunday column) pushes the tooltip past the viewport, which
  // on mobile spawned a horizontal-scroll jump when a dot was tapped.
  useLayoutEffect(() => {
    const tip = tipRef.current;
    if (!active || !tip) return;
    const area = tip.parentElement;
    const half = tip.offsetWidth / 2;
    const clamped = Math.max(half, Math.min(active.x, area.clientWidth - half));
    tip.style.left = `${clamped}px`;
  }, [active]);

  if (loading) return (
    <div className="graph-wrapper contrib-wrapper">
      <ContribSpinner />
    </div>
  );
  if (!contributions) return null;

  const grid = recentGrid(contributions);

  const anchor = (day, el) => ({
    ...day,
    x: el.offsetLeft + el.offsetWidth / 2,
    y: el.offsetTop,
  });
  const show = (day, el) => setActive(anchor(day, el));
  const hide = () => setActive(null);
  // Touch devices have no hover, so a tap toggles the tooltip for that cell.
  const toggle = (day, el) =>
    setActive((cur) => (cur && cur.date === day.date ? null : anchor(day, el)));

  return (
    <div className="graph-wrapper contrib-wrapper">
      <div className="contrib-block">
        <p className="contrib-meta">
          <span className="contrib-count">{grid.total.toLocaleString()}</span>
          {' '}contributions in the last month
        </p>
        <div className="contrib-grid-area">
        <div className="contrib-grid">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={`head-${i}`} className="contrib-head" aria-hidden="true">
              {label}
            </div>
          ))}
          {grid.weeks.map((week, wi) =>
            week.map((day, di) =>
              day ? (
                <div
                  key={`${wi}-${di}`}
                  className="contrib-day"
                  tabIndex={0}
                  aria-label={`${day.date}: ${formatCount(day.count)}`}
                  style={{ backgroundColor: levelColor(day.count) }}
                  onPointerEnter={(e) => e.pointerType !== 'touch' && show(day, e.currentTarget)}
                  onPointerLeave={(e) => e.pointerType !== 'touch' && hide()}
                  onFocus={(e) => show(day, e.currentTarget)}
                  onBlur={hide}
                  onClick={(e) => toggle(day, e.currentTarget)}
                />
              ) : (
                <div key={`${wi}-${di}`} className="contrib-empty" aria-hidden="true" />
              )
            )
          )}
        </div>
        {active && (
          <div ref={tipRef} className="contrib-tooltip" role="tooltip" style={{ left: active.x, top: active.y }}>
            <strong>{formatCount(active.count)}</strong>
            <span className="contrib-tooltip-date">{formatDate(active.date)}</span>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
