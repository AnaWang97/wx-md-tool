import { describe, expect, it } from "vitest";
import { parseMarkdown } from "./markdown";
import { themes } from "./themes";

describe("parseMarkdown", () => {
  it("renders existing headings and paragraphs with inline styles", () => {
    const html = parseMarkdown("## 小标题\n\n正文内容", themes[0]);

    expect(html).toContain("<section");
    expect(html).toContain("<h2");
    expect(html).toContain("小标题");
    expect(html).toContain("<p");
    expect(html).toContain("正文内容");
  });

  it("renders blockquotes with a lightweight quote mark", () => {
    const html = parseMarkdown("> 普通引用内容", themes[0]);

    expect(html).toContain("<blockquote");
    expect(html).toContain("普通引用内容");
    expect(html).toContain("aria-hidden=\"true\"");
    expect(html).toContain(themes[0].preview);
  });
});
