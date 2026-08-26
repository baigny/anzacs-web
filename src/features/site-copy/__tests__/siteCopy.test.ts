import { describe, it, expect } from "vitest";
import { copy } from "../api/siteCopy.api";

describe("copy() helper", () => {
  it("returns the value for a known key", () => {
    expect(copy({ hero_eyebrow: "Trusted seeds" }, "hero_eyebrow")).toBe("Trusted seeds");
  });

  it("falls back gracefully when a key is missing, so a page never breaks on absent copy", () => {
    expect(copy({}, "hero_eyebrow", "default text")).toBe("default text");
  });

  it("falls back to an empty string when no fallback is provided", () => {
    expect(copy({}, "missing_key")).toBe("");
  });
});
