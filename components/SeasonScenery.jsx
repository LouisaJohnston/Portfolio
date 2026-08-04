import { MOTE_COUNT, moteDrift } from '../lib/seasons';

// Weather for the month's sky, drawn behind the flock: a sun in summer, and
// something drifting through the air the rest of the year — petals in spring,
// leaves in autumn, snow in winter. Decorative, so it stays out of the
// accessibility tree; the birds carry the section's meaning.

// The sun's pixel body on an 11x11 grid: a blob a couple of pixels shy of the
// corners, so it reads as round at this size.
const SUN_BODY = [
  [4, 2], [5, 2], [6, 2],
  [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
  [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
  [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5],
  [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6],
  [3, 7], [4, 7], [5, 7], [6, 7], [7, 7],
  [4, 8], [5, 8], [6, 8],
];

// Eight rays around it — the four sides and the four diagonals. They pulse in
// two alternating sets so the sun flickers rather than throbbing as one.
const RAYS_STRAIGHT = [[5, 0], [5, 10], [0, 5], [10, 5]];
const RAYS_DIAGONAL = [[1, 1], [9, 1], [1, 9], [9, 9]];

function pixels(points) {
  return points.map(([x, y]) => (
    <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
  ));
}

function Sun() {
  return (
    <svg className="season-sun" viewBox="0 0 11 11" shapeRendering="crispEdges" aria-hidden="true">
      <g className="season-sun-body">{pixels(SUN_BODY)}</g>
      <g className="season-sun-ray season-sun-ray-a">{pixels(RAYS_STRAIGHT)}</g>
      <g className="season-sun-ray season-sun-ray-b">{pixels(RAYS_DIAGONAL)}</g>
    </svg>
  );
}

// What drifts, drawn on a 5x5 grid so it reads as pixel art beside the birds.
// A four-petal bloom for spring, a slanted blade for autumn, and a flake with
// arms for winter. Colour comes from the season's CSS, not from here.
const MOTE_SPRITES = {
  spring: [
    [2, 0],
    [1, 1], [2, 1], [3, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
    [1, 3], [2, 3], [3, 3],
    [2, 4],
  ],
  fall: [
    [3, 0], [4, 0],
    [2, 1], [3, 1], [4, 1],
    [1, 2], [2, 2], [3, 2],
    [0, 3], [1, 3], [2, 3],
    [0, 4], [1, 4],
  ],
  winter: [
    [2, 0],
    [1, 1], [2, 1], [3, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
    [1, 3], [2, 3], [3, 3],
    [2, 4],
  ],
};

// One drifting speck, handed its own column, pace and sway (see .season-mote in
// globals.css). The season decides what it looks like, not how it moves.
function Mote({ index, season }) {
  const { left, duration, delay, sway, scale } = moteDrift(index);
  const sprite = MOTE_SPRITES[season];
  return (
    <span
      className="season-mote"
      style={{
        left: `${left}%`,
        '--mote-duration': `${duration}s`,
        '--mote-delay': `${delay}s`,
        '--mote-sway': `${sway}px`,
        '--mote-scale': scale,
      }}
    >
      <svg viewBox="0 0 5 5" shapeRendering="crispEdges" aria-hidden="true">
        {pixels(sprite)}
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
