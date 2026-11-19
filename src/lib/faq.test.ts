import { describe, expect, it } from "vitest";

import { extractFaqs, plainText } from "./faq";

describe("extractFaqs", () => {
  it("reads questions from the FAQ section and legacy FAQ lines", () => {
    const markdown = [
      "Intro paragraph.",
      "## Some section",
      "### Not a question heading",
      "Body.",
      "**FAQ: Is it legal?**",
      "It depends on the [product](/insights/x).",
      "## Frequently asked questions",
      "### Which is the best funded account in India?",
      "There is no single **best** account.",
      "### How do I join?",
      "[Message us](https://wa.me/1) on WhatsApp.",
      "*Educational information only.*",
    ].join("\n\n");

    expect(extractFaqs(markdown)).toEqual([
      { question: "Is it legal?", answer: "It depends on the product." },
      {
        question: "Which is the best funded account in India?",
        answer: "There is no single best account.",
      },
      { question: "How do I join?", answer: "Message us on WhatsApp." },
    ]);
  });

  it("ignores h3 headings outside the FAQ section", () => {
    expect(extractFaqs("## Rules\n\n### Daily loss\n\nText.")).toEqual([]);
  });
});

describe("plainText", () => {
  it("strips links and emphasis", () => {
    expect(plainText("See **this** [guide](/a) and *that*.")).toBe(
      "See this guide and that.",
    );
  });
});
