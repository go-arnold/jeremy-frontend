import { describe, expect, it } from "vitest";
import { formatRelativeDate, typeToHref, buildCalendarMonth, mapApiArticleToBlogPost } from "./mappers";
import type { ApiArticleDetail } from "./api-types";

describe("formatRelativeDate", () => {
  it("returns a fallback for null/undefined/invalid input", () => {
    expect(formatRelativeDate(null)).toBe("Récemment");
    expect(formatRelativeDate(undefined)).toBe("Récemment");
    expect(formatRelativeDate("not-a-date")).toBe("Récemment");
  });

  it("formats a recent timestamp as relative time", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeDate(fiveMinutesAgo)).toBe("Il y a 5 min");
  });
});

describe("typeToHref", () => {
  it("routes known search result types to their detail page", () => {
    expect(typeToHref("artists", "yannick-b", 1)).toBe("/artistes/yannick-b");
    expect(typeToHref("articles", null, 42)).toBe("/blog/42");
  });

  it("falls back to the section list page when there is no detail route", () => {
    expect(typeToHref("releases", "some-slug", 1)).toBe("/sorties-premieres");
  });

  it("falls back to home for an unknown type", () => {
    expect(typeToHref("unknown_type", "x", 1)).toBe("/");
  });
});

describe("buildCalendarMonth", () => {
  it("builds the correct number of days and flags release dates", () => {
    const month = buildCalendarMonth(new Date(2026, 0, 1), ["2026-01-15", "2026-02-01"]);
    expect(month.days).toHaveLength(31);
    expect(month.days.find((d) => d.day === 15)?.hasEvent).toBe(true);
    // A release date outside the target month must not be flagged.
    expect(month.days.every((d) => d.day !== 1 || d.hasEvent === false)).toBe(true);
  });
});

describe("mapApiArticleToBlogPost", () => {
  it("maps HTML article bodies to a sanitized html block", () => {
    const apiArticle: ApiArticleDetail = {
      id: 1,
      slug: "article-html",
      title: "Article HTML",
      content:
        `<p style="color:black">Bonjour <strong>Kivu</strong></p>` +
        `<script>alert(1)</script>` +
        `<a href="javascript:alert(1)">lien</a>`,
    };

    const mapped = mapApiArticleToBlogPost(apiArticle);
    expect(mapped.blocks[0]).toEqual({
      type: "html",
      content:
        `<p>Bonjour <strong>Kivu</strong></p>` +
        `<a href="#" rel="noopener noreferrer">lien</a>`,
    });
  });
});
