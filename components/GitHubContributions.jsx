import { useLayoutEffect, useRef, useState } from 'react';
import { levelColor } from '../lib/levelColor';
import { formatDate } from '../lib/formatDate';
import { monthlyGrids, WEEKDAY_LABELS } from '../lib/contributions';
import ContribSpinner from './ContribSpinner';

function formatCount(count) {
  return `${count} contribution${count !== 1 ? 's' : ''}`;
}

export default function GitHubContributions({ contributions, loading }) {
  // The day the pointer/focus is currently on, plus where to anchor the tooltip.
  const [active, setActive] = useState(null);
  // Months back from the most recent (0 = current month). Kept as an offset so
  // it survives the data loading in without needing to know the month count.
  const [monthsBack, setMonthsBack] = useState(0);
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
    <div className="graph-wrapper contrib-wrapper contrib-loading">
      <ContribSpinner />
    </div>
  );
  if (!contributions) return null;

  const months = monthlyGrids(contributions);
  if (months.length === 0) return null;

  // Clamp so an offset from a wider dataset can't fall off a narrower one.
  const maxBack = months.length - 1;
  const offset = Math.min(monthsBack, maxBack);
  const month = months[maxBack - offset];

  const goOlder = () => { setMonthsBack(Math.min(offset + 1, maxBack)); setActive(null); };
  const goNewer = () => { setMonthsBack(Math.max(offset - 1, 0)); setActive(null); };

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
        <div className="contrib-nav">
          <p className="contrib-meta">
            <span className="contrib-count">{month.total.toLocaleString()}</span>
            {' '}contributions in{' '}
            <span className="contrib-month">{month.label}</span>
          </p>
          <div className="contrib-arrows">
            <button
              type="button"
              className="contrib-arrow"
              onClick={goOlder}
              disabled={offset >= maxBack}
              aria-label="Previous month"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              className="contrib-arrow"
              onClick={goNewer}
              disabled={offset <= 0}
              aria-label="Next month"
            >
              &rsaquo;
            </button>
          </div>
        </div>
        <div className="contrib-grid-area">
          <div className="contrib-grid">
            {WEEKDAY_LABELS.map((label, i) => (
              <div key={`head-${i}`} className="contrib-head" aria-hidden="true">
                {label}
              </div>
            ))}
            {month.weeks.map((week, wi) =>
              week.map((day, di) =>
                day && !day.upcoming ? (
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
                ) : day ? (
                  // Upcoming days of the in-progress month: empty squares that
                  // complete the month. Kept out of the tab order, but a hover
                  // or tap reveals a date-only tooltip (no contribution count).
                  <div
                    key={`${wi}-${di}`}
                    className="contrib-upcoming"
                    aria-hidden="true"
                    style={{ backgroundColor: levelColor(0) }}
                    onPointerEnter={(e) => e.pointerType !== 'touch' && show(day, e.currentTarget)}
                    onPointerLeave={(e) => e.pointerType !== 'touch' && hide()}
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
              {active.upcoming ? (
                formatDate(active.date)
              ) : (
                <>
                  <strong>{formatCount(active.count)}</strong>
                  <span className="contrib-tooltip-date">{formatDate(active.date)}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
