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
