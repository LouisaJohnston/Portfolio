import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the name and location", () => {
    render(<Footer />);
    expect(screen.getByText("Louisa Johnston")).toBeInTheDocument();
    expect(screen.getByText("San Francisco, CA")).toBeInTheDocument();
  });

  it("links to the portfolio repo and opens it safely in a new tab", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /portfolio repo/i });
    expect(link).toHaveAttribute("href", "https://github.com/LouisaJohnston/Portfolio");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
