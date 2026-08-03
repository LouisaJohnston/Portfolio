import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders each social link in both the desktop and mobile menus", () => {
    render(<Navbar />);
    // Two menus (desktop + mobile) each render the same set of links.
    expect(screen.getAllByRole("link", { name: /github/i })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /linkedin/i })).toHaveLength(2);
  });

  it("lists LinkedIn before GitHub in each menu", () => {
    render(<Navbar />);
    const desktop = document.querySelector("#social-links");
    const mobile = document.querySelector("#mobile-links");
    [desktop, mobile].forEach((menu) => {
      const labels = [...menu.querySelectorAll("a")].map((a) => a.textContent);
      expect(labels).toEqual(["LinkedIn", "GitHub"]);
    });
  });

  it("points both copies of a link at the same href", () => {
    render(<Navbar />);
    const github = screen.getAllByRole("link", { name: /github/i });
    github.forEach((link) =>
      expect(link).toHaveAttribute("href", "https://github.com/LouisaJohnston")
    );

    const linkedin = screen.getAllByRole("link", { name: /linkedin/i });
    linkedin.forEach((link) =>
      expect(link).toHaveAttribute("href", "https://www.linkedin.com/in/louisa-j/")
    );
  });

  it("opens external links safely in a new tab", () => {
    render(<Navbar />);
    const externalLinks = [
      ...screen.getAllByRole("link", { name: /github/i }),
      ...screen.getAllByRole("link", { name: /linkedin/i }),
    ];
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    });
  });
});
