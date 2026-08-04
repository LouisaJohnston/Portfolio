import { useLayoutEffect, useRef, useState } from 'react';
import { formatDate } from '../lib/formatDate';
import { monthlyGrids } from '../lib/contributions';
import { flockFromMonth, flockDepth, birdOffset, birdDrift } from '../lib/flock';
import Bird from './Bird';
import ContribSpinner from './ContribSpinner';

function formatCount(count) {
  return `${count} contribution${count !== 1 ? 's' : ''}`;
}

// The flock flies rightward, like a real skein of geese: the leader out front on
// the right, the two arms trailing back to the left — one rising, one falling —
// as a wide, open V lying on its side.
//
// Birds sit a fixed step apart (--flock-step-x / --flock-step-y, set per
// breakpoint in globals.css) rather than stretching to fill the sky, so spacing
// looks the same in a quiet month as a busy one. Offsets come from the centre,
// which keeps the formation centred at any size — including a lone bird, which
// lands dead centre instead of pinned to an edge.
function birdPosition(bird, maxDepth) {
  const { x, y } = birdOffset(bird, maxDepth);
  return {
    left: `calc(50% + (${x} * var(--flock-step-x)))`,
    top: `calc(50% + (${y} * var(--flock-step-y)))`,
  };
}

// Hand the i-th bird's own wander to CSS (see .bird-drift in globals.css).
function driftStyle(i) {
  const { duration, delay, x, y } = birdDrift(i);
  return {
    '--drift-duration': `${duration}s`,
    '--drift-delay': `${delay}s`,
    '--drift-x': `${x}px`,
    '--drift-y': `${y}px`,
  };
}

export default function GitHubContributions({ contributions, loading, heading, caption }) {
  // The day the pointer/focus is currently on, plus where to anchor the tooltip.
  const [active, setActive] = useState(null);
  // Months back from the most recent (0 = current month). Kept as an offset so
  // it survives the data loading in without needing to know the month count.
  const [monthsBack, setMonthsBack] = useState(0);
  const tipRef = useRef(null);
  // Whether the focus about to land was caused by a pointer rather than the
  // keyboard. A tap focuses the bird before its click arrives, so without this
  // the focus would open the tooltip and the click would immediately toggle it
  // shut — leaving a touch device with no way to see a bird's details.
  const focusFromPointer = useRef(false);

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

  // The month label shares its line with the heading and the arrows share
  // theirs with the caption, so the section's copy is rendered here rather than
  // by the page. Passing it through on every branch keeps the heading and
  // caption in place while the data loads, or if it never arrives.
  const rows = (monthLabel = null, arrows = null) => (
    <>
      <div className="contrib-title-row">
        <h2>{heading}</h2>
        {monthLabel}
      </div>
      <div className="contrib-caption-row">
        <p className="github-caption">{caption}</p>
        {arrows}
      </div>
    </>
  );

  if (loading) return (
    <>
      {rows()}
      <div className="graph-wrapper contrib-wrapper contrib-loading">
        <ContribSpinner />
      </div>
    </>
  );
  if (!contributions) return rows();

  const months = monthlyGrids(contributions);
  if (months.length === 0) return rows();

  // Clamp so an offset from a wider dataset can't fall off a narrower one.
  const maxBack = months.length - 1;
  const offset = Math.min(monthsBack, maxBack);
  const month = months[maxBack - offset];
  const birds = flockFromMonth(month);
  const maxDepth = flockDepth(birds);

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
    <>
      {rows(
        <p className="contrib-meta">
          <span className="contrib-month">{month.label}</span>
        </p>,
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
      )}
      <div className="graph-wrapper contrib-wrapper">
        <div className="contrib-block">
        {/* --flock-depth is how deep this flock reaches. Only the mobile step
            reads it (to tighten an unusually full month so it still fits), but
            it belongs on the sky, where --flock-step-x is declared and so where
            it gets resolved — on the inner .flock it would be ignored. */}
        <div className="contrib-sky" style={{ '--flock-depth': maxDepth }}>
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
                  onPointerDown={() => { focusFromPointer.current = true; }}
                  onFocus={(e) => !focusFromPointer.current && show(day, e.currentTarget)}
                  onBlur={() => { focusFromPointer.current = false; hide(); }}
                  onClick={(e) => { toggle(day, e.currentTarget); focusFromPointer.current = false; }}
                >
                  {/* Its own wander, on its own timing, so the flock breathes
                      rather than sliding about as one rigid block. Kept on a
                      wrapper so this transform and the sprite's hover scale
                      don't fight over the same property. */}
                  <span className="bird-drift" style={driftStyle(i)}>
                    {/* Stagger the flap over a 6-bird cycle so wings aren't synced. */}
                    <Bird count={day.count} delay={-(i % 6) * 0.12} />
                  </span>
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
    </>
  );
}
