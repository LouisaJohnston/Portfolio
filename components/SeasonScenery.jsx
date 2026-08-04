import { MOTE_COUNT, moteDrift, sunSprite, SUN_GRID } from '../lib/seasons';

// Weather for the month's sky, drawn behind the flock: a sun in summer, and
// something drifting through the air the rest of the year — petals in spring,
// leaves in autumn, snow in winter. Decorative, so it stays out of the
// accessibility tree; the birds carry the section's meaning.

function pixels(points) {
  return points.map(([x, y]) => (
    <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
  ));
}

// A disc with eight rays around it — the four sides and the four diagonals,
// pulsing in two alternating sets so the sun flickers rather than throbbing as
// one. Laid out by lib/seasons so its pixels come out the size of a bird's.
function Sun() {
  const { body, raysStraight, raysDiagonal } = sunSprite();
  return (
    <svg
      className="season-sun"
      viewBox={`0 0 ${SUN_GRID} ${SUN_GRID}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <g className="season-sun-body">{pixels(body)}</g>
      <g className="season-sun-ray season-sun-ray-a">{pixels(raysStraight)}</g>
      <g className="season-sun-ray season-sun-ray-b">{pixels(raysDiagonal)}</g>
    </svg>
  );
}

// What drifts, drawn on a 5x5 grid so it reads as pixel art beside the birds.
// A bloom for spring, a slanted blade for autumn, and a flake for winter.
// `core` is the handful of pixels at the middle that take their own colour —
// a flower's centre against its petals. Colours live in the season's CSS.
const MOTE_SPRITES = {
  spring: {
    body: [
      [2, 0],
      [1, 1], [2, 1], [3, 1],
      [0, 2], [1, 2], [3, 2], [4, 2],
      [1, 3], [2, 3], [3, 3],
      [2, 4],
    ],
    core: [[2, 2]],
  },
  fall: {
    body: [
      [3, 0], [4, 0],
      [2, 1], [3, 1], [4, 1],
      [1, 2], [2, 2], [3, 2],
      [0, 3], [1, 3], [2, 3],
      [0, 4], [1, 4],
    ],
  },
  winter: {
    body: [
      [2, 0],
      [1, 1], [2, 1], [3, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
      [1, 3], [2, 3], [3, 3],
      [2, 4],
    ],
  },
};

// One drifting speck, handed its own column, pace and sway (see .season-mote in
// globals.css). The season decides what it looks like, not how it moves.
function Mote({ index, season }) {
  const { left, duration, delay, sway } = moteDrift(index);
  const { body, core } = MOTE_SPRITES[season];
  return (
    <span
      className="season-mote"
      style={{
        left: `${left}%`,
        '--mote-duration': `${duration}s`,
        '--mote-delay': `${delay}s`,
        '--mote-sway': `${sway}px`,
      }}
    >
      <svg viewBox="0 0 5 5" shapeRendering="crispEdges" aria-hidden="true">
        <g className="season-mote-body">{pixels(body)}</g>
        {core && <g className="season-mote-core">{pixels(core)}</g>}
      </svg>
    </span>
  );
}

export default function SeasonScenery({ season }) {
  if (!season) return null;

  return (
    <div className={`season season-${season}`} aria-hidden="true">
      {season === 'summer' ? (
        <Sun />
      ) : (
        Array.from({ length: MOTE_COUNT }, (_, i) => (
          <Mote key={i} index={i} season={season} />
        ))
      )}
    </div>
  );
}
