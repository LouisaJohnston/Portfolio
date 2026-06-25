import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import IntroParagraph from "./IntroParagraph";

describe("IntroParagraph", () => {
  it("renders the paragraph text", () => {
    render(<IntroParagraph paragraph="Hello world" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders the optional hello prefix when provided", () => {
    render(<IntroParagraph hello="Hi! " paragraph="rest" />);
    expect(screen.getByText("Hi!", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("rest")).toBeInTheDocument();
  });

  it("renders without a hello prefix", () => {
    const { container } = render(<IntroParagraph paragraph="only" />);
    // The #hello span exists but is empty when no hello prop is passed
    expect(container.querySelector("#hello")).toBeEmptyDOMElement();
  });
});
