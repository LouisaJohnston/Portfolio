import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GitHubContributions from "./GitHubContributions";

// 2026-01-01 has no contributions, so it produces no bird; 01-02 and 01-03 do.
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

// A month whose only day has no contributions: no birds, empty sky.
const emptyMonth = {
  total: 0,
  weeks: [{ days: [{ date: "2026-03-15", count: 0 }] }],
};

// Spans two calendar months so the navigation arrows have somewhere to go.
const twoMonths = {
  total: 0,
  weeks: [
    { days: [{ date: "2026-05-15", count: 3 }] },
    { days: [{ date: "2026-06-10", count: 7 }] },
  ],
};

describe("GitHubContributions", () => {
  it("shows a loading spinner while loading", () => {
    render(<GitHubContributions loading={true} contributions={null} />);
    expect(screen.getByRole("status")).toHaveAccessibleName(/loading/i);
  });

  // The heading and caption share their lines with the month label and the
  // arrows, so this component owns them — and must keep the section's copy on
  // screen even when there are no birds to put beside it.
  it("keeps the heading and caption while loading", () => {
    render(
      <GitHubContributions
        loading={true}
        contributions={null}
        heading="GitHub Activity"
        caption="as migratory birds"
      />
    );
    expect(screen.getByRole("heading", { name: "GitHub Activity" })).toBeInTheDocument();
    expect(screen.getByText("as migratory birds")).toBeInTheDocument();
  });

  it("keeps the heading and caption but shows no flock when no data is available", () => {
    const { container } = render(
      <GitHubContributions
        loading={false}
        contributions={null}
        heading="GitHub Activity"
        caption="as migratory birds"
      />
    );
    expect(screen.getByRole("heading", { name: "GitHub Activity" })).toBeInTheDocument();
    expect(screen.getByText("as migratory birds")).toBeInTheDocument();
    expect(container.querySelector(".contrib-sky")).not.toBeInTheDocument();
    expect(container.querySelectorAll(".bird-slot")).toHaveLength(0);
  });

  // Which of these sits beside which is down to CSS placement, and differs
  // between a wide screen and a phone. What the markup has to guarantee is that
  // they share one grid, and that they read in a sensible order — heading, then
  // what the section is, then which month, then the controls for it.
  it("groups the heading, caption, month label and arrows into one head", () => {
    const { container } = render(
      <GitHubContributions
        loading={false}
        contributions={sampleContributions}
        heading="GitHub Activity"
        caption="as migratory birds"
      />
    );
    const head = container.querySelector(".contrib-head");
    expect(head.querySelector("h2")).toHaveTextContent("GitHub Activity");
    expect(head.querySelector(".github-caption")).toHaveTextContent("as migratory birds");
    expect(head.querySelector(".contrib-meta")).toHaveTextContent("January, 2026");
    expect(head.querySelector(".contrib-arrows")).toBeInTheDocument();

    const order = [...head.children].map((el) =>
      el.tagName === "H2" ? "heading" : el.className
    );
    expect(order).toEqual([
      "heading",
      "github-caption",
      "contrib-meta",
      "contrib-arrows",
    ]);
  });

  it("renders the selected month's 'Month, Year' label", () => {
    render(<GitHubContributions loading={false} contributions={sampleContributions} />);
    expect(screen.getByText("January, 2026")).toBeInTheDocument();
  });

  it("renders one bird per day that has contributions (zero-count days get none)", () => {
    const { container } = render(
      <GitHubContributions loading={false} contributions={sampleContributions} />
    );
    // Only 01-02 and 01-03 have contributions; 01-01 (count 0) has no bird.
    expect(container.querySelectorAll(".bird-slot")).toHaveLength(2);
  });

  it("shows an empty-sky message for a month with no contributions", () => {
    const { container } = render(
      <GitHubContributions loading={false} contributions={emptyMonth} />
    );
    expect(container.querySelectorAll(".bird-slot")).toHaveLength(0);
    expect(screen.getByText(/no contributions this month/i)).toBeInTheDocument();
    expect(screen.getByText("March, 2026")).toBeInTheDocument();
  });

  it("gives each bird an accessible label with its date and pluralized count", () => {
    render(<GitHubContributions loading={false} contributions={sampleContributions} />);
    expect(screen.getByLabelText("2026-01-02: 5 contributions")).toBeInTheDocument();
    expect(screen.getByLabelText("2026-01-03: 20 contributions")).toBeInTheDocument();
    render(<GitHubContributions loading={false} contributions={singleDay} />);
    expect(screen.getByLabelText("2026-01-01: 1 contribution")).toBeInTheDocument();
  });

  describe("hover tooltip", () => {
    // A mouse hover carries pointerType "mouse"; touch is guarded out so taps
    // go through the click handler instead.
    const hover = (el) => fireEvent.pointerEnter(el, { pointerType: "mouse" });
    const unhover = (el) => fireEvent.pointerLeave(el, { pointerType: "mouse" });

    it("shows no tooltip until a bird is hovered", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("shows the date and count for the hovered bird", () => {
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

    it("hides the tooltip when the pointer leaves the bird", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      const bird = screen.getByLabelText("2026-01-02: 5 contributions");
      hover(bird);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      unhover(bird);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("also reveals the tooltip on keyboard focus", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      fireEvent.focus(screen.getByLabelText("2026-01-03: 20 contributions"));
      expect(screen.getByRole("tooltip")).toHaveTextContent("20 contributions");
    });

    it("switches the tooltip content when moving to another bird", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      hover(screen.getByLabelText("2026-01-02: 5 contributions"));
      hover(screen.getByLabelText("2026-01-03: 20 contributions"));
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toHaveTextContent("20 contributions");
      expect(tooltip).not.toHaveTextContent("5 contributions");
    });

    // On touch devices there is no hover, so a tap must toggle the tooltip
    // and tapping the same bird again must dismiss it.
    it("toggles the tooltip on tap (click)", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      const bird = screen.getByLabelText("2026-01-02: 5 contributions");

      fireEvent.click(bird);
      expect(screen.getByRole("tooltip")).toHaveTextContent("5 contributions");

      fireEvent.click(bird);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    // A real tap on a focusable element focuses it before the click lands.
    // If focus opens the tooltip, the click that follows must not close it
    // again, or the details never appear on a touch device.
    const tap = (el) => {
      fireEvent.pointerDown(el, { pointerType: "touch" });
      fireEvent.focus(el);
      fireEvent.pointerUp(el, { pointerType: "touch" });
      fireEvent.click(el);
    };

    it("shows the tooltip on a tap that also focuses the bird", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      const bird = screen.getByLabelText("2026-01-02: 5 contributions");

      tap(bird);
      expect(screen.getByRole("tooltip")).toHaveTextContent("5 contributions");
    });

    it("dismisses the tooltip when the same bird is tapped again", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      const bird = screen.getByLabelText("2026-01-02: 5 contributions");

      tap(bird);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      tap(bird);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("moves the tooltip to another bird when that one is tapped", () => {
      render(<GitHubContributions loading={false} contributions={sampleContributions} />);
      tap(screen.getByLabelText("2026-01-02: 5 contributions"));
      // Focus leaves the first bird as the second takes it.
      fireEvent.blur(screen.getByLabelText("2026-01-02: 5 contributions"));
      tap(screen.getByLabelText("2026-01-03: 20 contributions"));

      expect(screen.getByRole("tooltip")).toHaveTextContent("20 contributions");
    });
  });

  describe("month navigation", () => {
    const prevButton = () => screen.getByRole("button", { name: /previous month/i });
    const nextButton = () => screen.getByRole("button", { name: /next month/i });

    it("starts on the most recent month", () => {
      render(<GitHubContributions loading={false} contributions={twoMonths} />);
      expect(screen.getByText("June, 2026")).toBeInTheDocument();
    });

    it("steps back to the previous month with the previous arrow", () => {
      render(<GitHubContributions loading={false} contributions={twoMonths} />);
      fireEvent.click(prevButton());
      expect(screen.getByText("May, 2026")).toBeInTheDocument();
    });

    it("returns to the newer month with the next arrow", () => {
      render(<GitHubContributions loading={false} contributions={twoMonths} />);
      fireEvent.click(prevButton());
      fireEvent.click(nextButton());
      expect(screen.getByText("June, 2026")).toBeInTheDocument();
    });

    it("disables the next arrow on the most recent month", () => {
      render(<GitHubContributions loading={false} contributions={twoMonths} />);
      expect(nextButton()).toBeDisabled();
      expect(prevButton()).not.toBeDisabled();
    });

    it("disables the previous arrow once on the oldest month", () => {
      render(<GitHubContributions loading={false} contributions={twoMonths} />);
      fireEvent.click(prevButton());
      expect(prevButton()).toBeDisabled();
    });

    it("dismisses an open tooltip when the month changes", () => {
      render(<GitHubContributions loading={false} contributions={twoMonths} />);
      fireEvent.click(screen.getByLabelText("2026-06-10: 7 contributions"));
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      fireEvent.click(prevButton());
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});
