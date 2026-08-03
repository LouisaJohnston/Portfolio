import { useLayoutEffect, useRef, useState } from 'react';
import { formatDate } from '../lib/formatDate';
import { monthlyGrids } from '../lib/contributions';
import { flockFromMonth } from '../lib/flock';
import Bird from './Bird';
import ContribSpinner from './ContribSpinner';

function formatCount(count) {
  return `${count} contribution${count !== 1 ? 's' : ''}`;
}

// The flock flies rightward, like a real skein of geese: the leader sits at the
// right, the two arms trail back to the left — one rising, one falling — as a
// wide, open V lying on its side. The V scales to fill the sky whatever the
// flock size, so a 3-bird month is a small tidy V and a 31-bird month a big
// sweeping one.
const ARM_REACH = 88; // % of sky width the arms trail back from the leader (wide V)
const ARM_SPREAD = 26; // % of sky height each arm rises/falls from center (short V)
const APEX_RIGHT = 5; // % from the right edge where the leader flies

// Place a bird's V slot ({ side, depth }) as a percentage point in the sky.
function birdPosition({ side, depth }, maxDepth) {
  const steps = Math.max(maxDepth, 1);
  return {
    left: `${100 - APEX_RIGHT - depth * (ARM_REACH / steps)}%`,
    top: `${50 + side * depth * (ARM_SPREAD / steps)}%`,
  };
}

export default function GitHubContributions({ contributions, loading }) {
  // The day the pointer/focus is currently on, plus where to anchor the tooltip.
  const [active, setActive] = useState(null);
  // Months back from the most recent (0 = current month). Kept as an offset so
  // it survives the data loading in without needing to know the month count.
  const [monthsBack, setMonthsBack] = useState(0);
  const tipRef = useRef(null);

  // Keep the tooltip inside the sky horizontally so an edge bird can't push it
  // past the viewport (which on mobile spawns a horizontal-scroll jump).
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
  const birds = flockFromMonth(month);
  const maxDepth = birds.reduce((m, b) => Math.max(m, b.depth), 0);

  const goOlder = () => { setMonthsBack(Math.min(offset + 1, maxBack)); setActive(null); };
  const goNewer = () => { setMonthsBack(Math.max(offset - 1, 0)); setActive(null); };

  // Anchor the tooltip to the bird's center within the sky, using bounding
  // rects so the flock's drift/bob transforms are accounted for.
  const anchor = (day, el) => {
    const sky = el.closest('.contrib-sky');
    const r = el.getBoundingClientRect();
    const s = sky.getBoundingClientRect();
    return { ...day, x: r.left - s.left + r.width / 2, y: r.top - s.top };
  };
  const show = (day, el) => setActive(anchor(day, el));
  const hide = () => setActive(null);
  // Touch devices have no hover, so a tap toggles the tooltip for that bird.
  const toggle = (day, el) =>
    setActive((cur) => (cur && cur.date === day.date ? null : anchor(day, el)));

  return (
    <div className="graph-wrapper contrib-wrapper">
      <div className="contrib-block">
        <div className="contrib-nav">
          <p className="contrib-meta">
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
        <div className="contrib-sky">
          {birds.length === 0 ? (
            <p className="contrib-empty-msg">No contributions this month</p>
          ) : (
            <div className="flock">
              {birds.map((day, i) => (
                <div
                  key={day.date}
                  className="bird-slot"
                  style={birdPosition(day, maxDepth)}
                  tabIndex={0}
                  role="img"
                  aria-label={`${day.date}: ${formatCount(day.count)}`}
                  onPointerEnter={(e) => e.pointerType !== 'touch' && show(day, e.currentTarget)}
                  onPointerLeave={(e) => e.pointerType !== 'touch' && hide()}
                  onFocus={(e) => show(day, e.currentTarget)}
                  onBlur={hide}
                  onClick={(e) => toggle(day, e.currentTarget)}
                >
                  {/* Stagger the flap over a 6-bird cycle so wings aren't synced. */}
                  <Bird count={day.count} delay={-(i % 6) * 0.12} />
                </div>
              ))}
            </div>
          )}
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
