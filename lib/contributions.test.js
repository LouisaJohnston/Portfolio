import { describe, it, expect } from "vitest";
import { combineCalendars, yearWindows, monthlyGrids, WEEKDAY_LABELS, MAX_WEEK_ROWS } from "./contributions";

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

describe("combineCalendars", () => {
  // combineCalendars takes one entry per user, each an array of that user's
  // per-year-window calendars, and unions them into the app's shaped calendar.
  it("shapes a single user's windows into { total, weeks: [{ days }] } sorted by date", () => {
    const windowA = buildCalendar([[5]], 2); // 2026-01-02: 5
    const windowB = buildCalendar([[3]], 1); // 2026-01-01: 3
    const result = combineCalendars([[windowA, windowB]]);

    expect(result.total).toBe(8);
    expect(result.weeks[0].days).toEqual([
      { date: "2026-01-01", count: 3 },
      { date: "2026-01-02", count: 5 },
    ]);
  });

  it("dedupes a date repeated across one user's windows (boundary overlap)", () => {
    const w = buildCalendar([[4]]); // 2026-01-01: 4
    const result = combineCalendars([[w, w]]);
    expect(result.total).toBe(4);
    expect(result.weeks[0].days).toEqual([{ date: "2026-01-01", count: 4 }]);
  });

  it("sums counts for the same date across two users", () => {
    const u1 = buildCalendar([[4]]); // 2026-01-01: 4
    const u2 = buildCalendar([[6]]); // 2026-01-01: 6
    const result = combineCalendars([[u1], [u2]]);
    expect(result.total).toBe(10);
    expect(result.weeks[0].days[0].count).toBe(10);
  });

  it("keeps a date present in only one of the users", () => {
    const u1 = buildCalendar([[2]], 5); // 2026-01-05: 2
    const u2 = buildCalendar([[6]], 1); // 2026-01-01: 6
    const dates = combineCalendars([[u1], [u2]]).weeks[0].days.map((d) => d.date);
    expect(dates).toEqual(["2026-01-01", "2026-01-05"]);
  });
});

describe("yearWindows", () => {
  const now = new Date("2026-07-01T00:00:00Z");

  it("produces one calendar-year window per year from account creation to now", () => {
    expect(yearWindows("2024-03-15T00:00:00Z", now)).toEqual([
      { from: "2024-01-01T00:00:00Z", to: "2024-12-31T23:59:59Z" },
      { from: "2025-01-01T00:00:00Z", to: "2025-12-31T23:59:59Z" },
      { from: "2026-01-01T00:00:00Z", to: now.toISOString() },
    ]);
  });

  it("caps the final (current-year) window at the present moment", () => {
    expect(yearWindows("2026-02-01T00:00:00Z", now)).toEqual([
      { from: "2026-01-01T00:00:00Z", to: now.toISOString() },
    ]);
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

  it("fills the in-progress (most recent) month's remaining days with upcoming placeholders", () => {
    // June's data stops at the 3rd; the rest of the month should be filled in.
    const june = monthlyGrids(shaped)[1];
    expect(june.weeks[0][4]).toEqual({ date: "2026-06-04", upcoming: true }); // Thursday
    expect(june.weeks[4][2]).toEqual({ date: "2026-06-30", upcoming: true }); // last day, a Tuesday
  });

  it("does not fill earlier, already-complete months", () => {
    const may = monthlyGrids(shaped)[0];
    expect(may.weeks.flat().filter((d) => d && d.upcoming)).toEqual([]);
  });

  it("excludes filled placeholder days from the month total", () => {
    const june = monthlyGrids(shaped)[1];
    expect(june.total).toBe(12); // only the real counts 3 + 4 + 5
  });
});
