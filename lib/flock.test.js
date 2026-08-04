import { describe, it, expect } from "vitest";
import { flockFromMonth, vSlot, birdOffset, flockDepth, birdDrift } from "./flock";

describe("vSlot", () => {
  it("puts the first bird at the apex", () => {
    expect(vSlot(0)).toEqual({ side: 0, depth: 0 });
  });

  it("alternates the following birds onto the left then right arm, stepping back", () => {
    // 1 -> left/1, 2 -> right/1, 3 -> left/2, 4 -> right/2, ...
    expect(vSlot(1)).toEqual({ side: -1, depth: 1 });
    expect(vSlot(2)).toEqual({ side: 1, depth: 1 });
    expect(vSlot(3)).toEqual({ side: -1, depth: 2 });
    expect(vSlot(4)).toEqual({ side: 1, depth: 2 });
    expect(vSlot(5)).toEqual({ side: -1, depth: 3 });
  });
});

describe("flockFromMonth", () => {
  // A month as produced by monthlyGrids: `weeks` is a grid of day-or-null slots.
  const month = (days) => ({
    weeks: [
      [null, null, days[0] ?? null, days[1] ?? null, null, null, null],
      [days[2] ?? null, null, null, null, null, null, null],
    ],
  });

  it("makes one bird per day that has contributions, ordered by date", () => {
    const flock = flockFromMonth(
      month([
        { date: "2026-01-08", count: 5 },
        { date: "2026-01-02", count: 2 },
        { date: "2026-01-05", count: 9 },
      ])
    );
    expect(flock.map((b) => b.date)).toEqual([
      "2026-01-02",
      "2026-01-05",
      "2026-01-08",
    ]);
    expect(flock[0]).toMatchObject({ count: 2, side: 0, depth: 0 });
    expect(flock[1]).toMatchObject({ count: 9, side: -1, depth: 1 });
    expect(flock[2]).toMatchObject({ count: 5, side: 1, depth: 1 });
  });

  it("excludes days with zero contributions", () => {
    const flock = flockFromMonth(
      month([
        { date: "2026-01-01", count: 0 },
        { date: "2026-01-02", count: 4 },
      ])
    );
    expect(flock).toHaveLength(1);
    expect(flock[0].date).toBe("2026-01-02");
  });

  it("excludes upcoming placeholder days of the in-progress month", () => {
    const flock = flockFromMonth(
      month([
        { date: "2026-01-02", count: 4 },
        { date: "2026-01-03", upcoming: true },
      ])
    );
    expect(flock).toHaveLength(1);
    expect(flock[0].date).toBe("2026-01-02");
  });

  it("returns an empty flock for a month with no contributions", () => {
    const flock = flockFromMonth(month([{ date: "2026-01-01", count: 0 }]));
    expect(flock).toEqual([]);
  });
});

describe("flockDepth", () => {
  it("is the deepest slot in the flock", () => {
    expect(flockDepth([{ depth: 0 }, { depth: 1 }, { depth: 1 }, { depth: 2 }])).toBe(2);
  });

  it("is zero for a lone bird or an empty flock", () => {
    expect(flockDepth([{ depth: 0 }])).toBe(0);
    expect(flockDepth([])).toBe(0);
  });

  // globals.css sizes --flock-step-x so this longest-possible flock exactly
  // spans the sky. If the arm ever reaches deeper, that step must shrink to
  // match or the widest months will overflow.
  it("reaches 15 steps per arm for the fullest possible month (31 days)", () => {
    const everyDay = Array.from({ length: 31 }, (_, i) => vSlot(i));
    expect(flockDepth(everyDay)).toBe(15);
  });
});

// Offsets are in *steps* from the sky's centre — the component multiplies them
// by a fixed step size, so spacing between birds never depends on the count.
describe("birdOffset", () => {
  it("puts a lone bird dead centre", () => {
    expect(birdOffset({ side: 0, depth: 0 }, 0)).toEqual({ x: 0, y: 0 });
  });

  it("keeps one step between consecutive depths regardless of flock size", () => {
    const stepFor = (maxDepth) =>
      birdOffset({ side: 0, depth: 0 }, maxDepth).x -
      birdOffset({ side: -1, depth: 1 }, maxDepth).x;
    // A small flock and a large one space their birds identically.
    expect(stepFor(2)).toBe(1);
    expect(stepFor(15)).toBe(1);
  });

  it("centres the formation horizontally: the leader and the tail sit opposite the centre", () => {
    const maxDepth = 4;
    const leader = birdOffset({ side: 0, depth: 0 }, maxDepth);
    const tail = birdOffset({ side: -1, depth: maxDepth }, maxDepth);
    expect(leader.x).toBe(-tail.x);
    expect(leader.x).toBeGreaterThan(0); // leader flies out front, to the right
  });

  it("mirrors the two arms so the V is centred vertically", () => {
    const up = birdOffset({ side: -1, depth: 3 }, 5);
    const down = birdOffset({ side: 1, depth: 3 }, 5);
    expect(up.y).toBe(-down.y);
    expect(up.x).toBe(down.x); // same depth, same distance back
  });
});

// Each bird wanders on its own timing so the flock doesn't move as one rigid
// block — the thing that makes a formation read as living birds.
describe("birdDrift", () => {
  it("gives the same bird the same drift every time", () => {
    // Derived from the index, not random: a re-render must not make birds jump.
    expect(birdDrift(4)).toEqual(birdDrift(4));
  });

  it("gives neighbouring birds different drifts", () => {
    for (let i = 0; i < 12; i++) {
      expect(birdDrift(i)).not.toEqual(birdDrift(i + 1));
    }
  });

  it("does not repeat a bird's exact drift anywhere in the largest flock", () => {
    // 31 birds is the most a month can hold; the periods, phases and amplitudes
    // cycle at co-prime lengths so no two of them line up.
    const seen = new Set(
      Array.from({ length: 31 }, (_, i) => JSON.stringify(birdDrift(i)))
    );
    expect(seen.size).toBe(31);
  });

  it("starts each bird part-way through its own cycle", () => {
    // A negative delay means already in flight on the first frame, rather than
    // every bird setting off together.
    for (let i = 0; i < 10; i++) {
      const { delay, duration } = birdDrift(i);
      expect(delay).toBeLessThanOrEqual(0);
      expect(Math.abs(delay)).toBeLessThan(duration);
    }
  });

  it("keeps every drift gentle and slow enough to read as a bird", () => {
    // Loose enough to be plainly visible, tight enough that a bird never
    // wanders far from its place in the formation.
    for (let i = 0; i < 31; i++) {
      const { duration, x, y } = birdDrift(i);
      expect(duration).toBeGreaterThanOrEqual(2);
      expect(duration).toBeLessThanOrEqual(5);
      expect(Math.abs(x)).toBeLessThanOrEqual(8);
      expect(Math.abs(y)).toBeLessThanOrEqual(16);
    }
  });

  it("rises and falls further than it slides sideways", () => {
    // Birds ride the air up and down; a big sideways swing would read as the
    // formation coming apart rather than as flight.
    for (let i = 0; i < 31; i++) {
      const { x, y } = birdDrift(i);
      expect(Math.abs(y)).toBeGreaterThan(Math.abs(x));
    }
  });
});
