import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats an ISO date as 'Weekday, Month D, YYYY'", () => {
    expect(formatDate("2026-06-22")).toBe("Monday, June 22, 2026");
  });

  it("does not zero-pad the day of month", () => {
    expect(formatDate("2026-01-02")).toBe("Friday, January 2, 2026");
  });

  it("parses the date in local time so the day does not shift", () => {
    // Constructed from Y/M/D parts rather than Date(string) UTC parsing.
    expect(formatDate("2026-01-01")).toBe("Thursday, January 1, 2026");
  });
});
