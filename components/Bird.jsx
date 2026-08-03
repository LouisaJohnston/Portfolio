import { levelColor } from '../lib/levelColor';

// A single pixel-art bird — a wide gull silhouette drawn on an 11x5 grid so it
// stays crisp at any size. The body is a fixed 3-cell bar at the center; only
// the wings pivot, and their footed tips step one row per frame (row 4 down to
// row 0) so the flap is an even sweep with a stable centre — no wiggle. The two
// ends are traced from the reference: frame 0 is the wings-down arch and frame 4
// the wings-up V with a hanging tail. The cycle runs 0 -> 1 -> 2 -> 3 -> 4 -> 3
// -> 2 -> 1 (see .bird-frame-* in globals.css). `delay` staggers each bird so
// the flock isn't in lockstep; the silhouette is filled by contribution count.
const FRAMES = [
  // 0: wings down — arch (reference, left bird)
  [[4, 2], [5, 2], [6, 2], [3, 3], [2, 3], [1, 4], [0, 4], [7, 3], [8, 3], [9, 4], [10, 4]],
  // 1: wings swinging up
  [[4, 2], [5, 2], [6, 2], [3, 3], [2, 3], [1, 3], [0, 3], [7, 3], [8, 3], [9, 3], [10, 3]],
  // 2: wings level
  [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2]],
  // 3: wings swinging down
  [[4, 2], [5, 2], [6, 2], [3, 2], [2, 1], [1, 1], [0, 1], [7, 2], [8, 1], [9, 1], [10, 1]],
  // 4: wings up — V with tail (reference, right bird)
  [[4, 2], [5, 2], [6, 2], [3, 2], [2, 1], [1, 0], [0, 0], [7, 2], [8, 1], [9, 0], [10, 0], [5, 3]],
];

function pixels(points, color) {
  return points.map(([x, y]) => (
    <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
  ));
}

export default function Bird({ count, delay = 0 }) {
  const color = levelColor(count);
  return (
    <svg className="bird" viewBox="0 0 11 5" shapeRendering="crispEdges" aria-hidden="true">
      {FRAMES.map((frame, i) => (
        <g key={i} className={`bird-frame bird-frame-${i}`} style={{ animationDelay: `${delay}s` }}>
          {pixels(frame, color)}
        </g>
      ))}
    </svg>
  );
}
