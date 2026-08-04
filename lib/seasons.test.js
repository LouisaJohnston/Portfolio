import { describe, it, expect } from "vitest";
import { seasonFor, MOTE_COUNT, moteDrift } from "./seasons";

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

  it("keeps every mote slow enough to drift rather than rain", () => {
    for (let i = 0; i < MOTE_COUNT; i++) {
      const { duration, sway } = moteDrift(i);
      expect(duration).toBeGreaterThanOrEqual(6);
      expect(duration).toBeLessThanOrEqual(16);
      expect(Math.abs(sway)).toBeLessThanOrEqual(30);
    }
  });
});
