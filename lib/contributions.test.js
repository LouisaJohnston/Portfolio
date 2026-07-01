import { describe, it, expect } from "vitest";
import { shapeCalendar, mergeCalendars, monthlyGrids, WEEKDAY_LABELS, MAX_WEEK_ROWS } from "./contributions";

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

describe("monthlyGrids", () => {
  // Days spanning the May/June 2026 boundary. 2026-06-01 is a Monday.
  const shaped = {
    total: 0,
    weeks: [
      {
        days: [
          { date: "2026-05-30", count: 1 },
          { date: "2026-05-31", count: 2 },
          { date: "2026-06-01", count: 3 },
          { date: "2026-06-02", count: 4 },
        ],
      },
      { days: [{ date: "2026-06-03", count: 5 }] },
    ],
  };

  it("groups days into one entry per calendar month, oldest first", () => {
    expect(monthlyGrids(shaped).map((m) => m.label)).toEqual([
      "May, 2026",
      "June, 2026",
    ]);
  });

  it("keys each month as YYYY-MM", () => {
    expect(monthlyGrids(shaped).map((m) => m.key)).toEqual(["2026-05", "2026-06"]);
  });

  it("totals only the days within each month", () => {
    const [may, june] = monthlyGrids(shaped);
    expect(may.total).toBe(3); // 1 + 2
    expect(june.total).toBe(12); // 3 + 4 + 5
  });

  it("aligns each day under its weekday column, starting a new row on Sunday", () => {
    const june = monthlyGrids(shaped)[1];
    const [firstRow] = june.weeks;

    expect(firstRow[0]).toBeNull(); // Sunday, no data
    expect(firstRow[1].date).toBe("2026-06-01"); // Monday
    expect(firstRow[2].date).toBe("2026-06-02"); // Tuesday
    expect(firstRow[3].date).toBe("2026-06-03"); // Wednesday
  });

  it("exposes seven single-letter weekday labels starting on Sunday", () => {
    expect(WEEKDAY_LABELS).toEqual(["S", "M", "T", "W", "T", "F", "S"]);
  });

  it("pads every month to a constant MAX_WEEK_ROWS so the grid is a fixed size", () => {
    // The shaped fixture's shortest month (June) naturally spans a single week
    // row; it should still be padded up to the maximum any month can occupy.
    expect(MAX_WEEK_ROWS).toBe(6);
    for (const month of monthlyGrids(shaped)) {
      expect(month.weeks).toHaveLength(MAX_WEEK_ROWS);
    }
  });

  it("fills padding rows with seven null slots", () => {
    const june = monthlyGrids(shaped)[1];
    const lastRow = june.weeks[MAX_WEEK_ROWS - 1];
    expect(lastRow).toEqual(Array(7).fill(null));
  });
});
