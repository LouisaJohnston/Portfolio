import {
  MOTE_COUNT,
  moteDrift,
  sunSprite,
  SUN_GRID,
  groundSpot,
  GROUND_COUNT,
} from '../lib/seasons';

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

// What drifts, five pixels apiece on a 3x3 grid — small things seen at a
// distance, against birds that are far bigger. A bloom for spring, a flake for
// winter, and a blade lying on the diagonal for autumn. `core` is the pixel at
// the middle that takes its own colour: a flower's centre against its petals.
// Colours live in the season's CSS.
export const MOTE_GRID = 3;
export const MOTE_PIXELS = 5;

const MOTE_SPRITES = {
  spring: {
    body: [[1, 0], [0, 1], [2, 1], [1, 2]],
    core: [[1, 1]],
  },
  fall: {
    body: [[2, 0], [1, 1], [2, 1], [0, 2], [1, 2]],
  },
  winter: {
    body: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
  },
};

// The five-pixel sprite itself, shared by what falls through the air and what
// lies in the grass — a fallen petal is the same petal.
function MoteSprite({ season }) {
  const { body, core } = MOTE_SPRITES[season];
  return (
    <svg
      viewBox={`0 0 ${MOTE_GRID} ${MOTE_GRID}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <g className="season-mote-body">{pixels(body)}</g>
      {core && <g className="season-mote-core">{pixels(core)}</g>}
    </svg>
  );
}

// One drifting speck, handed its own column, pace and sway (see .season-mote in
// globals.css). The season decides what it looks like, not how it moves.
function Mote({ index, season }) {
  const { left, duration, delay, sway } = moteDrift(index);
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
      <MoteSprite season={season} />
    </span>
  );
}

// The ground the flock is flying over: grass for the green half of the year,
// snow for winter. Spring strews flowers through it and autumn fallen leaves —
// the same sprites that drift through the air above.
function Ground({ season }) {
  const strewn = season === 'spring' || season === 'fall' ? season : null;
  return (
    <div className="season-ground">
      {strewn &&
        Array.from({ length: GROUND_COUNT }, (_, i) => (
          <span key={i} className="season-ground-item" style={{ left: `${groundSpot(i)}%` }}>
            <MoteSprite season={strewn} />
          </span>
        ))}
    </div>
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
      <Ground season={season} />
    </div>
  );
}
