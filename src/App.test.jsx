import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = "";
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
    window.location.hash = "";
  });
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

  it("renders creator and documentation links in the attribution/footer areas", () => {
    render(<App />);

    expect(
      screen.getAllByRole("link", { name: "Three Five Two" }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "React Docs" })
    ).toHaveAttribute("href", "https://react.dev/");
    expect(screen.getByRole("link", { name: "Vite Docs" })).toHaveAttribute(
      "href",
      "https://vite.dev/"
    );
    expect(
      screen.getAllByRole("link", { name: "Tachyons" }).every((link) =>
        link.getAttribute("href") === "https://tachyons.io/"
      )
    ).toBe(true);
  });

  it("opens the tree and shows the start helper while no points are spent", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Open the talent tree/i }));

    expect(screen.getByText("Start here!")).toHaveClass("active");
    expect(document.querySelector(".avatar .level")).toHaveTextContent(
      "Level 1 Web Developer"
    );
  });

  it("clicking the logo while open returns to the intro preview state", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Open the talent tree/i }));
    expect(document.querySelector(".page")).toHaveClass("open");

    fireEvent.click(screen.getByAltText("Dungeons and Developers"));

    expect(document.querySelector(".page")).not.toHaveClass("open");
    expect(document.querySelector(".intro")).not.toHaveClass("hide");
  });

  it("adds points, unlocks dependencies, and updates avatar stats", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Open the talent tree/i }));

    fireEvent.click(screen.getByLabelText("Add or remove points for HTML"));
    fireEvent.click(screen.getByLabelText("Add or remove points for HTML"));
    fireEvent.click(screen.getByLabelText("Add or remove points for CSS"));

    expect(screen.getByText("Start here!")).not.toHaveClass("active");
    expect(document.querySelector(".avatar .level")).toHaveTextContent(
      "Level 4 Web Developer"
    );
    expect(screen.getByText("HTML").closest(".skill")).toHaveClass("has-max-points");
    expect(screen.getByText("CSS").closest(".skill")).toHaveClass("has-points");

    const avatar = document.querySelector(".avatar");
    const stats = within(avatar).getByText("Charisma").closest("li");
    expect(stats).toHaveTextContent("Charisma: 14");
  });

  it("supports right click removal and blocks removing a prerequisite in use", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Open the talent tree/i }));

    const htmlNode = screen.getByLabelText("Add or remove points for HTML");
    const cssNode = screen.getByLabelText("Add or remove points for CSS");

    fireEvent.click(htmlNode);
    fireEvent.click(cssNode);
    fireEvent.contextMenu(htmlNode);

    expect(screen.getByText("HTML").closest(".skill")).toHaveClass("has-points");

    fireEvent.click(htmlNode);
    fireEvent.contextMenu(htmlNode);
    expect(screen.getByText("HTML").closest(".skill")).toHaveClass("has-points");

    fireEvent.contextMenu(cssNode);
    fireEvent.contextMenu(htmlNode);

    expect(screen.getByText("HTML").closest(".skill")).not.toHaveClass("has-points");
    expect(screen.getByText("CSS").closest(".skill")).not.toHaveClass("has-points");
  });

  it("hydrates from the URL hash before localStorage and opens the tree", () => {
    window.location.hash = "#_a2b_5_Avi";
    window.localStorage.setItem(
      "dndevs_state_v1",
      JSON.stringify({
        isOpen: false,
        avatarName: "Stored Name",
        portrait: 9,
        pointsBySkillId: { 24: 1 },
      })
    );

    render(<App />);

    expect(document.querySelector(".page")).toHaveClass("open");
    expect(document.querySelector(".avatar .level")).toHaveTextContent(
      "Level 4 Web Developer"
    );
    expect(screen.getByDisplayValue("Avi")).toBeInTheDocument();
    expect(document.querySelector(".avatar .portrait img")).toHaveAttribute(
      "src",
      "/dndevs-remake/img/portrait-5.jpg"
    );
    expect(screen.getByText("HTML").closest(".skill")).toHaveClass("has-max-points");
    expect(screen.getByText("CSS").closest(".skill")).toHaveClass("has-points");
    expect(screen.getByText("Server Administration").closest(".skill")).not.toHaveClass(
      "has-points"
    );
  });

  it("falls back to localStorage when the URL hash is empty", () => {
    window.localStorage.setItem(
      "dndevs_state_v1",
      JSON.stringify({
        isOpen: true,
        avatarName: "Stored Name",
        portrait: 9,
        pointsBySkillId: { 24: 1 },
      })
    );

    render(<App />);

    expect(document.querySelector(".page")).toHaveClass("open");
    expect(screen.getByDisplayValue("Stored Name")).toBeInTheDocument();
    expect(document.querySelector(".avatar .portrait img")).toHaveAttribute(
      "src",
      "/dndevs-remake/img/portrait-9.jpg"
    );
    expect(screen.getByText("Server Administration").closest(".skill")).toHaveClass(
      "has-points"
    );
  });

  it("debounces localStorage saves and hash updates from reducer state changes", () => {
    vi.useFakeTimers();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Open the talent tree/i }));
    fireEvent.click(screen.getByLabelText("Add or remove points for HTML"));

    expect(window.localStorage.getItem("dndevs_state_v1")).toBeNull();
    expect(window.location.hash).toBe("");

    act(() => {
      vi.runAllTimers();
    });

    expect(window.localStorage.getItem("dndevs_state_v1")).toBe(
      JSON.stringify({
        isOpen: true,
        avatarName: "Your Name",
        portrait: 1,
        pointsBySkillId: { 1: 1 },
      })
    );
    expect(decodeURIComponent(window.location.hash)).toBe("#_a_1_Your Name");
  });
});
