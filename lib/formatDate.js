// Formats an ISO date string ("2026-06-22") as "Monday, June 22, 2026".
// Parsed from Y/M/D parts (local time) to avoid the UTC off-by-one that
// `new Date("2026-06-22")` causes in negative-offset timezones.
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
