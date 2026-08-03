import { describe, it, expect } from "vitest";
import { flockFromMonth, vSlot } from "./flock";

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
