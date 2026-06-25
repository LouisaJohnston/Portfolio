import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GitHubContributions from "./GitHubContributions";

const sampleContributions = {
  total: 1234,
  weeks: [
    { days: [{ date: "2026-01-01", count: 0 }, { date: "2026-01-02", count: 5 }] },
    { days: [{ date: "2026-01-03", count: 20 }] },
  ],
};

const singleDay = {
  total: 1,
  weeks: [{ days: [{ date: "2026-01-01", count: 1 }] }],
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

  it("gives each cell an accessible label with its date and pluralized count", () => {
    render(<GitHubContributions loading={false} contributions={sampleContributions} />);
    expect(screen.getByLabelText("2026-01-02: 5 contributions")).toBeInTheDocument();
    render(<GitHubContributions loading={false} contributions={singleDay} />);
    expect(screen.getByLabelText("2026-01-01: 1 contribution")).toBeInTheDocument();
  });

  describe("hover tooltip", () => {
    it("shows no tooltip until a cell is hovered", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("shows the date and count for the hovered cell", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      fireEvent.mouseEnter(screen.getByLabelText("2026-01-02: 5 contributions"));

      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveTextContent("5 contributions");
      expect(tooltip).toHaveTextContent("Friday, January 2, 2026");
    });

    it("uses the singular form for a single contribution", () => {
      render(<GitHubContributions loading={false} contributions={singleDay} />);
      fireEvent.mouseEnter(screen.getByLabelText("2026-01-01: 1 contribution"));
      expect(screen.getByRole("tooltip")).toHaveTextContent("1 contribution");
      expect(screen.getByRole("tooltip")).not.toHaveTextContent("1 contributions");
    });

    it("reports zero contributions for an empty day", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      fireEvent.mouseEnter(screen.getByLabelText("2026-01-01: 0 contributions"));
      expect(screen.getByRole("tooltip")).toHaveTextContent("0 contributions");
    });

    it("hides the tooltip when the pointer leaves the cell", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      const cell = screen.getByLabelText("2026-01-02: 5 contributions");
      fireEvent.mouseEnter(cell);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      fireEvent.mouseLeave(cell);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("also reveals the tooltip on keyboard focus", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      fireEvent.focus(screen.getByLabelText("2026-01-03: 20 contributions"));
      expect(screen.getByRole("tooltip")).toHaveTextContent("20 contributions");
    });

    it("switches the tooltip content when moving to another cell", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      fireEvent.mouseEnter(screen.getByLabelText("2026-01-02: 5 contributions"));
      fireEvent.mouseEnter(screen.getByLabelText("2026-01-03: 20 contributions"));
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveTextContent("20 contributions");
      expect(tooltip).not.toHaveTextContent("5 contributions");
    });
  });
});
