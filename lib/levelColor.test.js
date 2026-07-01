import { describe, it, expect } from "vitest";
import { levelColor } from "./levelColor";

describe("levelColor", () => {
  it("returns a light gray fill for zero contributions", () => {
    expect(levelColor(0)).toBe("#f4f2f4");
  });

  it.each([
    [1, "#b3d1d1"],
    [3, "#b3d1d1"],
    [4, "#669999"],
    [7, "#669999"],
    [8, "#4a7a7a"],
    [14, "#4a7a7a"],
    [15, "#4d2b43"],
    [500, "#4d2b43"],
  ])("maps a count of %i to %s", (count, color) => {
    expect(levelColor(count)).toBe(color);
  });

  it("uses the brightest bucket only above 14", () => {
    expect(levelColor(14)).not.toBe(levelColor(15));
  });
});
