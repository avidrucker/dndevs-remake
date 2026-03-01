import { describe, expect, it } from "vitest";
import { skills } from "./skills";

describe("skills data port", () => {
  it("keeps the expected structure and representative legacy content", () => {
    expect(skills[0]).toEqual({
      id: 1,
      title: "HTML",
      description:
        "The main language for creating web pages, HTML is written in the form of tags enclosed in angle brackets (like <html>).",
      rankDescriptions: [
        "You understand how to create and view a basic web page.",
        "You understand how to link pages together, design multi-column layouts, and work with form fields and media elements.",
      ],
      links: [
        {
          label: "HTML.net Tutorials",
          url: "http://www.html.net/tutorials/html/",
        },
        {
          label: "Sublime Text 3, a great code editor",
          url: "http://www.sublimetext.com/",
        },
      ],
      maxPoints: 2,
      stats: [
        { title: "Intellect", value: 1 },
        { title: "Charisma", value: 1 },
        { title: "Strength", value: 1 },
      ],
    });

    expect(skills[14]).toEqual({
      id: 15,
      title: "Server-side Development Mastery",
      dependsOn: [12, 14],
      description:
        "You are capable of architecting and building an application's backend to efficiently store and retrieve data.",
      stats: [{ title: "Strength", value: 10 }],
    });

    expect(skills[25]).toEqual({
      id: 26,
      title: "Web Development Mastery",
      dependsOn: [4, 5, 10, 15, 22, 25],
      links: [
        {
          label: "Web Development Wiki",
          url: "http://en.wikipedia.org/wiki/Web_development",
        },
      ],
      description: "This refers to designing, creating, and maintaining a website.",
      stats: [
        { title: "Charisma", value: 3 },
        { title: "Dexterity", value: 3 },
        { title: "Fortitude", value: 3 },
        { title: "Intellect", value: 3 },
        { title: "Strength", value: 3 },
        { title: "Wisdom", value: 3 },
      ],
      talents: ["Demigod"],
    });
  });

  it("keeps all 26 legacy skill ids in ascending order", () => {
    expect(skills).toHaveLength(26);
    expect(skills.map((skill) => skill.id)).toEqual(
      Array.from({ length: 26 }, (_, index) => index + 1)
    );
  });

  it("uses direct links instead of archived Wayback URLs", () => {
    const allUrls = skills.flatMap((skill) =>
      (skill.links ?? []).map((link) => link.url)
    );

    expect(allUrls.length).toBeGreaterThan(0);
    expect(allUrls.every((url) => !url.includes("web.archive.org"))).toBe(true);
  });
});
