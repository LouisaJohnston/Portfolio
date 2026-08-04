// Turns a month's contribution data into an ordered flock of birds arranged in
// a V. Kept free of React/DOM so the ordering and formation can be unit-tested
// in isolation; the component maps each bird's { side, depth } slot to pixels.

// Slot of the i-th bird in the V (0 = apex/leader):
//   side   -1 left arm, 0 apex, +1 right arm
//   depth   0 apex, then 1, 1, 2, 2, ... stepping back down the arms
// Birds fan out apex-first, alternating onto the left then the right arm.
export function vSlot(i) {
  if (i === 0) return { side: 0, depth: 0 };
  return { side: (i - 1) % 2 === 0 ? -1 : 1, depth: Math.floor((i - 1) / 2) + 1 };
}

// Turn a rendered month (from monthlyGrids, whose `weeks` is a grid of
// day-or-null slots) into the flock. Only days with contributions become birds
// — zero-count and upcoming placeholder days are dropped — and the earliest day
// leads at the apex.
export function flockFromMonth(month) {
  return month.weeks
    .flat()
    .filter((day) => day && !day.upcoming && day.count > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day, i) => ({ ...day, ...vSlot(i) }));
}

// How far back the deepest bird sits — the length of each arm of the V.
export function flockDepth(birds) {
  return birds.reduce((deepest, bird) => Math.max(deepest, bird.depth), 0);
}

// Where a bird sits relative to the centre of the sky, measured in *steps*
// rather than pixels or percentages: the component multiplies these by a fixed
// step size, so the gap between birds stays the same whatever the flock size —
// a quiet month makes a small tidy V, a busy one a longer V, both centred.
//
// Shifting x by half the depth puts the formation's midpoint on the centre, so
// the leader sits as far right of centre as the tail sits left. The arms mirror
// through y, centring the V vertically too.
export function birdOffset({ side, depth }, maxDepth) {
  return { x: maxDepth / 2 - depth, y: side * depth };
}
