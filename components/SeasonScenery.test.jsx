import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SeasonScenery from "./SeasonScenery";
import { MOTE_COUNT } from "../lib/seasons";

describe("SeasonScenery", () => {
  it("renders nothing without a season", () => {
    const { container } = render(<SeasonScenery season={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("hangs a sun in the summer sky, with rays that pulse in two sets", () => {
    const { container } = render(<SeasonScenery season="summer" />);
    expect(container.querySelector(".season-sun")).toBeInTheDocument();
    expect(container.querySelectorAll(".season-sun-ray")).toHaveLength(2);
    expect(container.querySelectorAll(".season-mote")).toHaveLength(0);
  });

  it.each(["spring", "fall", "winter"])("fills the %s sky with drifting motes", (season) => {
    const { container } = render(<SeasonScenery season={season} />);
    expect(container.querySelectorAll(".season-mote")).toHaveLength(MOTE_COUNT);
    expect(container.querySelector(".season-sun")).not.toBeInTheDocument();
  });

  it("marks the season with a class, so the styling can differ per season", () => {
    for (const season of ["spring", "summer", "fall", "winter"]) {
      const { container } = render(<SeasonScenery season={season} />);
      expect(container.querySelector(`.season-${season}`)).toBeInTheDocument();
    }
  });

  it("gives each mote its own column and pace", () => {
    const { container } = render(<SeasonScenery season="winter" />);
    const motes = [...container.querySelectorAll(".season-mote")];
    const columns = motes.map((m) => m.style.left);
    const delays = motes.map((m) => m.style.getPropertyValue("--mote-delay"));
    expect(new Set(columns).size).toBe(MOTE_COUNT);
    expect(new Set(delays).size).toBeGreaterThan(1);
  });

  // It's weather behind the birds, not content — the flock carries the meaning.
  it("stays out of the accessibility tree", () => {
    const { container } = render(<SeasonScenery season="spring" />);
    expect(container.querySelector(".season")).toHaveAttribute("aria-hidden", "true");
  });
});
