import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContribSpinner from "./ContribSpinner";

describe("ContribSpinner", () => {
  it("exposes an accessible loading status", () => {
    render(<ContribSpinner />);
    const status = screen.getByRole("status");
    expect(status).toHaveAccessibleName(/loading/i);
  });

  it("renders a 3x3 block of grid-style tiles with an empty center", () => {
    const { container } = render(<ContribSpinner />);
    // 9 cells total: the 8-cell ring plus the empty center placeholder.
    expect(container.querySelectorAll(".contrib-loader span")).toHaveLength(9);
    expect(container.querySelectorAll(".contrib-loader-gap")).toHaveLength(1);
  });
});
