// Pure data-shaping helpers for the GitHub contribution heatmap.
// Kept free of network/env concerns so they can be unit-tested in isolation.

// Reshape a single GitHub contributionCalendar into the app's internal shape:
//   { total, weeks: [{ days: [{ date, count }] }] }
export function shapeCalendar(calendar) {
  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((week) => ({
      days: week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    })),
  };
}

// Single-letter column headers for the weekday grid, Sunday-first to match
// GitHub's calendar (weeks start on Sunday).
export const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

// Weekday index (0 = Sunday .. 6 = Saturday) for a "YYYY-MM-DD" string, parsed
// in local time to stay consistent with formatDate and avoid a UTC off-by-one.
function weekdayIndex(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

// Reduce a shaped calendar ({ total, weeks: [{ days }] }) to just the most
// recent `weeks` weeks, laid out as a weekday-aligned grid for rendering with
// day-of-week columns: { total, weeks: [[dayOrNull x7]] }. Missing weekday
// slots (e.g. the trailing days of the current, partial week) are null so the
// columns stay aligned under their labels. `total` reflects only this window.
export function recentGrid(shaped, weeks = 5) {
  const recent = shaped.weeks.slice(-weeks);
  const total = recent.reduce(
    (sum, week) => sum + week.days.reduce((s, d) => s + d.count, 0),
    0
  );
  const grid = recent.map((week) => {
    const row = Array(7).fill(null);
    week.days.forEach((day) => {
      row[weekdayIndex(day.date)] = day;
    });
    return row;
  });
  return { total, weeks: grid };
}

// Merge two GitHub contributionCalendars, summing counts per calendar date.
// The first calendar defines the week/day grid; counts from both are added.
export function mergeCalendars(cal1, cal2) {
  const dayMap = {};
  [cal1, cal2].forEach((cal) => {
    cal.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        dayMap[day.date] = (dayMap[day.date] || 0) + day.contributionCount;
      });
    });
  });

  return {
    total: Object.values(dayMap).reduce((s, c) => s + c, 0),
    weeks: cal1.weeks.map((week) => ({
      days: week.contributionDays.map((day) => ({
        date: day.date,
        count: dayMap[day.date] || 0,
      })),
    })),
  };
}
