import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GitHubContributions from "./GitHubContributions";

const sampleContributions = {
  total: 1234,
  weeks: [
    { days: [{ date: "2026-01-01", count: 0 }, { date: "2026-01-02", count: 5 }] },
    { days: [{ date: "2026-01-03", count: 20 }] },
  ],
};

describe("GitHubContributions", () => {
  it("shows a loading message while loading", () => {
    render(<GitHubContributions loading={true} contributions={null} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders nothing when not loading and no data is available", () => {
    const { container } = render(
      <GitHubContributions loading={false} contributions={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the formatted contribution total", () => {
    render(<GitHubContributions loading={false} contributions={sampleContributions} />);
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText(/contributions in the last year/i)).toBeInTheDocument();
  });

  it("renders one cell per day across all weeks", () => {
    const { container } = render(
      <GitHubContributions loading={false} contributions={sampleContributions} />
    );
    expect(container.querySelectorAll(".contrib-day")).toHaveLength(3);
  });

  it("labels each cell with its date and pluralized count", () => {
    render(<GitHubContributions loading={false} contributions={sampleContributions} />);
    expect(screen.getByTitle("2026-01-02: 5 contributions")).toBeInTheDocument();
  });

  it("uses the singular form for a single contribution", () => {
    render(
      <GitHubContributions
        loading={false}
        contributions={{ total: 1, weeks: [{ days: [{ date: "2026-01-01", count: 1 }] }] }}
      />
    );
    expect(screen.getByTitle("2026-01-01: 1 contribution")).toBeInTheDocument();
  });
});
