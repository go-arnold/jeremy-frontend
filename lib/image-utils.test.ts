import { describe, expect, it } from "vitest";
import { isValidImageSrc } from "./image-utils";

describe("isValidImageSrc", () => {
  it("rejects null, undefined and empty strings", () => {
    expect(isValidImageSrc(null)).toBe(false);
    expect(isValidImageSrc(undefined)).toBe(false);
    expect(isValidImageSrc("")).toBe(false);
    expect(isValidImageSrc("   ")).toBe(false);
  });

  it("rejects local placeholder paths", () => {
    expect(isValidImageSrc("/placeholder-artist.png")).toBe(false);
  });

  it("accepts a real URL", () => {
    expect(isValidImageSrc("https://res.cloudinary.com/demo/image/upload/cover.jpg")).toBe(true);
  });
});
