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

// How many motes drift through the sky at once. Enough to read as weather,
// few enough to stay behind the birds rather than crowd them.
export const MOTE_COUNT = 14;

// Timing tables at co-prime lengths, so a mote's combination of the three
// doesn't recur across the whole field and the drift reads as unpatterned.
const MOTE_FALLS = [11, 8, 14, 9.5, 12.5, 7]; // seconds top to bottom
const MOTE_SWAYS = [18, -12, 26, -22, 9]; // px of sideways wander on the way
const MOTE_SCALES = [1, 0.7, 1.3, 0.85]; // relative size, for a sense of depth

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
    scale: MOTE_SCALES[i % MOTE_SCALES.length],
  };
}
