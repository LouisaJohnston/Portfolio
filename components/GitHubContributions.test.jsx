import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GitHubContributions from "./GitHubContributions";

// 2026-01-01 is a Thursday, so these three days land in weekday columns 4/5/6.
const sampleContributions = {
  total: 1234, // full-year total; the component shows the last-month total instead
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
  it("shows a loading spinner while loading", () => {
    render(<GitHubContributions loading={true} contributions={null} />);
    expect(screen.getByRole("status")).toHaveAccessibleName(/loading/i);
  });

  it("renders nothing when not loading and no data is available", () => {
    const { container } = render(
      <GitHubContributions loading={false} contributions={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the last-month contribution total, not the full-year figure", () => {
    render(<GitHubContributions loading={false} contributions={sampleContributions} />);
    expect(screen.getByText("25")).toBeInTheDocument(); // 0 + 5 + 20
    expect(screen.queryByText("1,234")).not.toBeInTheDocument();
    expect(screen.getByText(/contributions in the last month/i)).toBeInTheDocument();
  });

  it("renders one interactive cell per day across all weeks", () => {
    const { container } = render(
      <GitHubContributions loading={false} contributions={sampleContributions} />
    );
    expect(container.querySelectorAll(".contrib-day")).toHaveLength(3);
  });

  it("renders a single-letter header for each weekday column", () => {
    const { container } = render(
      <GitHubContributions loading={false} contributions={sampleContributions} />
    );
    const heads = [...container.querySelectorAll(".contrib-head")].map((h) => h.textContent);
    expect(heads).toEqual(["S", "M", "T", "W", "T", "F", "S"]);
  });

  it("gives each cell an accessible label with its date and pluralized count", () => {
    render(<GitHubContributions loading={false} contributions={sampleContributions} />);
    expect(screen.getByLabelText("2026-01-02: 5 contributions")).toBeInTheDocument();
    render(<GitHubContributions loading={false} contributions={singleDay} />);
    expect(screen.getByLabelText("2026-01-01: 1 contribution")).toBeInTheDocument();
  });

  describe("hover tooltip", () => {
    // A mouse hover carries pointerType "mouse"; touch is guarded out so taps
    // go through the click handler instead.
    const hover = (el) => fireEvent.pointerEnter(el, { pointerType: "mouse" });
    const unhover = (el) => fireEvent.pointerLeave(el, { pointerType: "mouse" });

    it("shows no tooltip until a cell is hovered", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("shows the date and count for the hovered cell", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      hover(screen.getByLabelText("2026-01-02: 5 contributions"));

      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveTextContent("5 contributions");
      expect(tooltip).toHaveTextContent("Friday, January 2, 2026");
    });

    it("does not reveal the tooltip on a touch pointer entering (that is the tap's job)", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      fireEvent.pointerEnter(screen.getByLabelText("2026-01-02: 5 contributions"), {
        pointerType: "touch",
      });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("uses the singular form for a single contribution", () => {
      render(<GitHubContributions loading={false} contributions={singleDay} />);
      hover(screen.getByLabelText("2026-01-01: 1 contribution"));
      expect(screen.getByRole("tooltip")).toHaveTextContent("1 contribution");
      expect(screen.getByRole("tooltip")).not.toHaveTextContent("1 contributions");
    });

    it("reports zero contributions for an empty day", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      hover(screen.getByLabelText("2026-01-01: 0 contributions"));
      expect(screen.getByRole("tooltip")).toHaveTextContent("0 contributions");
    });

    it("hides the tooltip when the pointer leaves the cell", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      const cell = screen.getByLabelText("2026-01-02: 5 contributions");
      hover(cell);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      unhover(cell);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("also reveals the tooltip on keyboard focus", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      fireEvent.focus(screen.getByLabelText("2026-01-03: 20 contributions"));
      expect(screen.getByRole("tooltip")).toHaveTextContent("20 contributions");
    });

    it("switches the tooltip content when moving to another cell", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      hover(screen.getByLabelText("2026-01-02: 5 contributions"));
      hover(screen.getByLabelText("2026-01-03: 20 contributions"));
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveTextContent("20 contributions");
      expect(tooltip).not.toHaveTextContent("5 contributions");
    });

    // On touch devices there is no hover, so a tap must toggle the tooltip
    // and tapping the same cell again must dismiss it.
    it("toggles the tooltip on tap (click)", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      const cell = screen.getByLabelText("2026-01-02: 5 contributions");

      fireEvent.click(cell);
      expect(screen.getByRole("tooltip")).toHaveTextContent("5 contributions");

      fireEvent.click(cell);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});
