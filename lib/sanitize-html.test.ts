import { describe, expect, it } from "vitest";
import { sanitizeArticleHtml } from "./sanitize-html";

describe("sanitizeArticleHtml", () => {
  it("keeps allowed formatting tags and strips inline styles", () => {
    const input = `<p style="color:red">Texte <strong>important</strong></p>`;
    const output = sanitizeArticleHtml(input);
    expect(output).toContain("<p>");
    expect(output).toContain("<strong>important</strong>");
    expect(output).not.toContain("style=");
  });

  it("removes scripts and unsafe javascript links", () => {
    const input = `<script>alert(1)</script><a href="javascript:alert(1)" onclick="hack()">Lien</a>`;
    const output = sanitizeArticleHtml(input);
    expect(output).not.toContain("<script>");
    expect(output).toContain('<a href="#" rel="noopener noreferrer">Lien</a>');
    expect(output).not.toContain("onclick=");
  });
});
