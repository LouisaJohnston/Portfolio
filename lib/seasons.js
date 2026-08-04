// Which season a month belongs to, and the timings for the flowers, leaves and
// snow that drift through the sky behind the flock. Kept free of React/DOM so
// both can be unit-tested on their own.

// Meteorological seasons, northern hemisphere — the site's author is in San
// Francisco, so March is spring rather than autumn. Indexed by month number.
const SEASON_BY_MONTH = [
  undefined, // no month 0
  "winter", "winter", // Jan, Feb
  "spring", "spring", "spring", // Mar, Apr, May
  "summer", "summer", "summer", // Jun, Jul, Aug
  "fall", "fall", "fall", // Sep, Oct, Nov
  "winter", // Dec
];

// Season of a "YYYY-MM" month key, as monthlyGrids produces.
export function seasonFor(monthKey) {
  return SEASON_BY_MONTH[Number(monthKey.slice(5, 7))];
}

// Every sprite in the sky is drawn on the same pixel grid, so a pixel of sun is
// the same size as a pixel of bird (see --pixel in globals.css). A bigger sun
// therefore means more pixels rather than larger ones, which is why it's laid
// out here rather than hand-listed: at this size that's a few hundred cells.
export const SUN_GRID = 29; // cells across; odd, so there's a middle one
const SUN_CENTRE = (SUN_GRID - 1) / 2;
const SUN_RADIUS = 7.5; // to the edge of the disc
const RAY_LENGTH = 4; // cells in each ray
// Where each set of rays begins, counted in cells rather than distance, so
// every ray lands on exact cells and the eight of them stay symmetric. The
// diagonals start nearer in because each of their steps covers more ground.
const STRAIGHT_START = 9;
const DIAGONAL_START = 7;

// The disc: every cell whose centre falls inside the radius. Rounding to the
// grid is what gives it stepped, pixelled edges rather than a smooth circle.
function disc() {
  const cells = [];
  for (let y = 0; y < SUN_GRID; y++) {
    for (let x = 0; x < SUN_GRID; x++) {
      const dx = x - SUN_CENTRE;
      const dy = y - SUN_CENTRE;
      if (Math.hypot(dx, dy) <= SUN_RADIUS) cells.push([x, y]);
    }
  }
  return cells;
}

// A spoke of cells stepping outward from the disc along one direction.
function ray([dx, dy], start) {
  const cells = [];
  for (let k = start; k < start + RAY_LENGTH; k++) {
    cells.push([SUN_CENTRE + dx * k, SUN_CENTRE + dy * k]);
  }
  return cells;
}

// The sun, in three parts so the two sets of rays can flicker out of step.
export function sunSprite() {
  return {
    body: disc(),
    raysStraight: [[0, -1], [0, 1], [-1, 0], [1, 0]]
      .flatMap((dir) => ray(dir, STRAIGHT_START)),
    raysDiagonal: [[-1, -1], [1, -1], [-1, 1], [1, 1]]
      .flatMap((dir) => ray(dir, DIAGONAL_START)),
  };
}

// How many motes drift through the sky at once. Enough to read as weather,
// few enough to stay behind the birds rather than crowd them.
export const MOTE_COUNT = 14;

// Timing tables at co-prime lengths, so a mote's combination of the three
// doesn't recur across the whole field and the drift reads as unpatterned.
const MOTE_FALLS = [11, 8, 14, 9.5, 12.5, 7]; // seconds top to bottom
const MOTE_SWAYS = [18, -12, 26, -22, 9]; // px of sideways wander on the way

// Drift for the i-th mote: where it falls, how long it takes and how far it
// wanders. Derived from the index rather than randomised so a re-render can't
// make the sky jump.
export function moteDrift(i) {
  const duration = MOTE_FALLS[i % MOTE_FALLS.length];
  return {
    // Spread across the sky in a stride rather than left to right, so
    // neighbouring motes aren't neighbours on screen. 5 and 14 share no
    // factor, so the stride visits every column exactly once.
    left: Number((((i * 5) % MOTE_COUNT) * (100 / MOTE_COUNT) + 1).toFixed(2)),
    duration,
    // Negative, so the sky is already full on the first frame rather than
    // every mote setting off from the top together.
    delay: -Number(((i * 1.7) % duration).toFixed(2)),
    sway: MOTE_SWAYS[i % MOTE_SWAYS.length],
  };
}
