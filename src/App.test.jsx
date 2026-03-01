import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the legacy intro copy and CTA", () => {
    render(<App />);

    expect(screen.getByText(/An RPG-style talent tree/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Open the talent tree/i })
    ).toBeInTheDocument();
  });

  it("renders the imported skill titles into the placeholder tree", () => {
    render(<App />);

    expect(screen.getByText("HTML")).toBeInTheDocument();
    expect(screen.getByText("Web Development Mastery")).toBeInTheDocument();
  });
});
