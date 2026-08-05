import { describe, it, expect } from "vitest";
import {
  seasonFor,
  MOTE_COUNT,
  moteDrift,
  sunSprite,
  SUN_GRID,
  groundSpot,
  GROUND_COUNT,
} from "./seasons";

describe("seasonFor", () => {
  // Meteorological seasons, northern hemisphere — the site's author is in
  // San Francisco, so March is spring rather than autumn.
  const cases = [
    ["2026-01", "winter"],
    ["2026-02", "winter"],
    ["2026-03", "spring"],
    ["2026-04", "spring"],
    ["2026-05", "spring"],
    ["2026-06", "summer"],
    ["2026-07", "summer"],
    ["2026-08", "summer"],
    ["2026-09", "fall"],
    ["2026-10", "fall"],
    ["2026-11", "fall"],
    ["2026-12", "winter"],
  ];

  it.each(cases)("puts %s in %s", (key, season) => {
    expect(seasonFor(key)).toBe(season);
  });

  it("covers every month of the year", () => {
    const seasons = cases.map(([key]) => seasonFor(key));
    expect(seasons.filter(Boolean)).toHaveLength(12);
    expect(new Set(seasons)).toEqual(new Set(["winter", "spring", "summer", "fall"]));
  });

  it("reads the month out of a full 'YYYY-MM' key, whatever the year", () => {
    expect(seasonFor("2019-07")).toBe("summer");
    expect(seasonFor("2031-07")).toBe("summer");
  });
});

// The flowers, leaves and snow that drift across the sky. Their timings are
// derived from the mote's index rather than randomised, so a re-render doesn't
// make the whole sky jump.
describe("moteDrift", () => {
  it("gives the same mote the same drift every time", () => {
    expect(moteDrift(3)).toEqual(moteDrift(3));
  });

  it("gives neighbouring motes different drifts", () => {
    for (let i = 0; i < MOTE_COUNT - 1; i++) {
      expect(moteDrift(i)).not.toEqual(moteDrift(i + 1));
    }
  });

  it("spreads the motes across the whole width of the sky", () => {
    const lefts = Array.from({ length: MOTE_COUNT }, (_, i) => moteDrift(i).left);
    expect(Math.min(...lefts)).toBeLessThan(20);
    expect(Math.max(...lefts)).toBeGreaterThan(80);
    expect(new Set(lefts).size).toBe(MOTE_COUNT); // no two stacked in a column
  });

  it("starts each mote part-way through its fall", () => {
    // Negative delays mean the sky is already full on the first frame, rather
    // than every mote setting off from the top together.
    for (let i = 0; i < MOTE_COUNT; i++) {
      const { delay, duration } = moteDrift(i);
      expect(delay).toBeLessThanOrEqual(0);
      expect(Math.abs(delay)).toBeLessThan(duration);
    }
  });

  it("leaves the motes all one size, so every pixel matches the birds'", () => {
    // A per-mote scale would shrink or stretch the pixels themselves.
    for (let i = 0; i < MOTE_COUNT; i++) {
      expect(moteDrift(i)).not.toHaveProperty("scale");
    }
  });

  it("keeps every mote slow enough to drift rather than rain", () => {
    for (let i = 0; i < MOTE_COUNT; i++) {
      const { duration, sway } = moteDrift(i);
      expect(duration).toBeGreaterThanOrEqual(6);
      expect(duration).toBeLessThanOrEqual(16);
      expect(Math.abs(sway)).toBeLessThanOrEqual(30);
    }
  });
});

// The sun is laid out rather than hand-listed, because at one bird-pixel per
// cell a sun worth looking at runs to a few hundred of them.
describe("sunSprite", () => {
  const { body, raysStraight, raysDiagonal } = sunSprite();
  const all = [...body, ...raysStraight, ...raysDiagonal];

  it("keeps every pixel on the grid", () => {
    for (const [x, y] of all) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(SUN_GRID);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThan(SUN_GRID);
    }
  });

  it("draws a disc, not a square — the corners stay empty", () => {
    const has = (x, y) => body.some(([bx, by]) => bx === x && by === y);
    const mid = (SUN_GRID - 1) / 2;
    expect(has(mid, mid)).toBe(true); // solid through the middle
    expect(has(0, 0)).toBe(false);
    expect(has(SUN_GRID - 1, SUN_GRID - 1)).toBe(false);
  });

  it("is symmetric about its middle", () => {
    const mid = (SUN_GRID - 1) / 2;
    const key = (x, y) => `${x},${y}`;
    const seen = new Set(all.map(([x, y]) => key(x, y)));
    for (const [x, y] of all) {
      expect(seen.has(key(2 * mid - x, y))).toBe(true); // mirrored left to right
      expect(seen.has(key(x, 2 * mid - y))).toBe(true); // and top to bottom
    }
  });

  it("holds the rays clear of the disc, and each set apart from the other", () => {
    const bodyKeys = new Set(body.map(([x, y]) => `${x},${y}`));
    const straightKeys = new Set(raysStraight.map(([x, y]) => `${x},${y}`));
    for (const [x, y] of [...raysStraight, ...raysDiagonal]) {
      expect(bodyKeys.has(`${x},${y}`)).toBe(false);
    }
    for (const [x, y] of raysDiagonal) {
      expect(straightKeys.has(`${x},${y}`)).toBe(false);
    }
  });

  it("gives all eight rays the same length", () => {
    expect(raysStraight).toHaveLength(raysDiagonal.length);
    expect(raysStraight.length % 4).toBe(0);
  });
});

describe("groundSpot", () => {
  it("gives the same spot the same place every time", () => {
    expect(groundSpot(2)).toBe(groundSpot(2));
  });

  it("strews them across the ground without stacking any up", () => {
    const spots = Array.from({ length: GROUND_COUNT }, (_, i) => groundSpot(i));
    expect(new Set(spots).size).toBe(GROUND_COUNT);
    expect(Math.min(...spots)).toBeLessThan(20);
    expect(Math.max(...spots)).toBeGreaterThan(80);
    expect(Math.max(...spots)).toBeLessThan(100);
  });

  it("does not lay them out left to right, so they don't look ranked", () => {
    const spots = Array.from({ length: GROUND_COUNT }, (_, i) => groundSpot(i));
    const sorted = [...spots].sort((a, b) => a - b);
    expect(spots).not.toEqual(sorted);
  });
});
