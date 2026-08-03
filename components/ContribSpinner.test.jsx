import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContribSpinner from "./ContribSpinner";

describe("ContribSpinner", () => {
  it("exposes an accessible loading status", () => {
    render(<ContribSpinner />);
    const status = screen.getByRole("status");
    expect(status).toHaveAccessibleName(/loading/i);
  });

  it("renders a single flapping bird", () => {
    const { container } = render(<ContribSpinner />);
    expect(container.querySelectorAll(".bird")).toHaveLength(1);
  });
});
