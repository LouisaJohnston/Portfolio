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

// Full month names, indexed 0 = January .. 11 = December. Hardcoded (rather than
// toLocaleDateString) so labels stay deterministic regardless of the runtime's
// locale/ICU data.
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Weekday index (0 = Sunday .. 6 = Saturday) for a "YYYY-MM-DD" string, parsed
// in local time to stay consistent with formatDate and avoid a UTC off-by-one.
function weekdayIndex(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

// The most week-rows any calendar month can span (a 31-day month whose 1st
// falls on a Friday or Saturday). Every month is padded to this many rows so
// the rendered grid is a fixed size and paging between months doesn't shift
// the layout.
export const MAX_WEEK_ROWS = 6;

// Lay a single month's days out as a weekday-aligned grid: rows are weeks
// (a new row begins each Sunday) and each row has 7 weekday slots, with null
// where a day falls outside the month, so the columns line up under their
// labels. Padded to MAX_WEEK_ROWS with all-null rows so every month renders at
// the same fixed height.
function monthWeeks(days) {
  const rows = [];
  days.forEach((day) => {
    const wd = weekdayIndex(day.date);
    if (wd === 0 || rows.length === 0) rows.push(Array(7).fill(null));
    rows[rows.length - 1][wd] = day;
  });
  while (rows.length < MAX_WEEK_ROWS) rows.push(Array(7).fill(null));
  return rows;
}

// The in-progress month's data stops at today, leaving the rest of the month
// absent. Extend it with placeholder days (flagged `upcoming`, no count) from
// the day after its last data day through the end of the month, so those days
// render as empty squares and the current month shows its full shape.
function fillCurrentMonth(days, year, month) {
  if (days.length === 0) return days;
  const lastDay = Number(days[days.length - 1].date.slice(8, 10));
  const daysInMonth = new Date(year, month, 0).getDate(); // month is 1-12
  const filled = [...days];
  for (let d = lastDay + 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    filled.push({ date, upcoming: true });
  }
  return filled;
}

// Group a shaped calendar ({ total, weeks: [{ days }] }) into one entry per
// calendar month, oldest first, each ready to render:
//   { key: "YYYY-MM", label: "Month, Year", total, weeks: [[dayOrNull x7]] }
// `total` counts only the days within that month.
export function monthlyGrids(shaped) {
  const byMonth = new Map();
  shaped.weeks.forEach((week) => {
    week.days.forEach((day) => {
      const key = day.date.slice(0, 7); // "YYYY-MM"
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key).push(day);
    });
  });

  const entries = [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b));

  return entries.map(([key, days], index) => {
    const [year, month] = key.split("-").map(Number); // month is 1-12
    // Only the most recent (last) month is still in progress; older months
    // already carry a real entry for every day.
    const isCurrent = index === entries.length - 1;
    const grid = isCurrent ? fillCurrentMonth(days, year, month) : days;
    return {
      key,
      label: `${MONTH_NAMES[month - 1]}, ${year}`,
      total: days.reduce((sum, d) => sum + d.count, 0),
      weeks: monthWeeks(grid),
    };
  });
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
