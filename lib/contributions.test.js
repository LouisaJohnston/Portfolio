import { describe, it, expect } from "vitest";
import { shapeCalendar, mergeCalendars, recentGrid, WEEKDAY_LABELS } from "./contributions";

// Helper to build a GitHub-shaped contributionCalendar from
// [[count, count, ...], ...] grouped by week, with sequential dates.
function buildCalendar(weeks, startDay = 1) {
  let day = startDay;
  return {
    totalContributions: weeks.flat().reduce((s, c) => s + c, 0),
    weeks: weeks.map((week) => ({
      contributionDays: week.map((contributionCount) => ({
        contributionCount,
        date: `2026-01-${String(day++).padStart(2, "0")}`,
      })),
    })),
  };
}

describe("shapeCalendar", () => {
  it("reshapes a calendar into { total, weeks: [{ days: [{ date, count }] }] }", () => {
    const result = shapeCalendar(buildCalendar([[1, 2], [3, 0]]));

    expect(result.total).toBe(6);
    expect(result.weeks).toEqual([
      { days: [{ date: "2026-01-01", count: 1 }, { date: "2026-01-02", count: 2 }] },
      { days: [{ date: "2026-01-03", count: 3 }, { date: "2026-01-04", count: 0 }] },
    ]);
  });

  it("uses GitHub's totalContributions, not a recomputed sum", () => {
    const cal = buildCalendar([[5, 5]]);
    cal.totalContributions = 99; // GitHub may report private-inclusive totals
    expect(shapeCalendar(cal).total).toBe(99);
  });
});

describe("mergeCalendars", () => {
  it("sums counts per date across both calendars", () => {
    const a = buildCalendar([[1, 2], [3, 4]]);
    const b = buildCalendar([[10, 20], [30, 40]]);

    const result = mergeCalendars(a, b);

    expect(result.weeks[0].days[0]).toEqual({ date: "2026-01-01", count: 11 });
    expect(result.weeks[1].days[1]).toEqual({ date: "2026-01-04", count: 44 });
  });

  it("computes total as the sum of all merged day counts", () => {
    const a = buildCalendar([[1, 2]]);
    const b = buildCalendar([[3, 4]]);
    expect(mergeCalendars(a, b).total).toBe(10);
  });

  it("uses the first calendar's grid for the output shape", () => {
    const a = buildCalendar([[1, 1, 1]]);
    const b = buildCalendar([[5, 5, 5]]);
    expect(mergeCalendars(a, b).weeks[0].days).toHaveLength(3);
  });

  it("treats a date present in only one calendar as that calendar's count", () => {
    const a = buildCalendar([[7]]); // 2026-01-01
    const b = buildCalendar([[2]], 1); // also 2026-01-01
    // Same date overlaps -> summed
    expect(mergeCalendars(a, b).weeks[0].days[0].count).toBe(9);
  });
});

describe("recentGrid", () => {
  // A weekday-aligned week: Sun 2026-06-07 .. Sat 2026-06-13.
  const fullWeek = (start, counts) => ({
    days: counts.map((count, i) => ({
      date: `2026-06-${String(start + i).padStart(2, "0")}`,
      count,
    })),
  });

  it("keeps only the last `weeks` weeks and sums their total", () => {
    const shaped = {
      total: 999, // full-year total, should be ignored
      weeks: [
        fullWeek(1, [1, 1, 1, 1, 1, 1, 1]), // dropped
        fullWeek(7, [0, 1, 2, 3, 4, 5, 6]), // kept
        fullWeek(14, [1, 0, 0, 0, 0, 0, 1]), // kept
      ],
    };

    const grid = recentGrid(shaped, 2);

    expect(grid.weeks).toHaveLength(2);
    expect(grid.total).toBe(21 + 2); // second + third week
  });

  it("aligns each day under its weekday column (Sun..Sat)", () => {
    // 2026-06-07 is a Sunday; the row should read left-to-right by weekday.
    const shaped = { total: 0, weeks: [fullWeek(7, [10, 11, 12, 13, 14, 15, 16])] };
    const [row] = recentGrid(shaped, 1).weeks;

    expect(row.map((d) => d && d.count)).toEqual([10, 11, 12, 13, 14, 15, 16]);
  });

  it("pads a partial (current) week with nulls in the empty weekday slots", () => {
    // Only Sun..Tue present; Wed..Sat should be null placeholders.
    const shaped = { total: 0, weeks: [fullWeek(7, [3, 4, 5])] };
    const [row] = recentGrid(shaped, 1).weeks;

    expect(row).toHaveLength(7);
    expect(row.map((d) => (d ? d.count : null))).toEqual([3, 4, 5, null, null, null, null]);
  });

  it("exposes seven single-letter weekday labels starting on Sunday", () => {
    expect(WEEKDAY_LABELS).toEqual(["S", "M", "T", "W", "T", "F", "S"]);
  });
});
