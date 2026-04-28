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

  it("renders blockquotes without extra quote marks", () => {
    const html = parseMarkdown("> 普通引用内容", themes[0]);

    expect(html).toContain("<blockquote");
    expect(html).toContain("普通引用内容");
    expect(html).not.toContain("aria-hidden=\"true\"");
    expect(html).toContain(themes[0].preview);
  });

  it("renders a horizontal rule after a bold sentence without needing a blank line", () => {
    const html = parseMarkdown(
      "**我的答案是：不一定。**\n---\n## 下一节",
      themes[0]
    );

    expect(html).toContain("<strong");
    expect(html).toContain("我的答案是：不一定。");
    expect(html).toContain("<hr");
    expect(html).toContain("下一节");
    expect(html).not.toContain(">---<");
  });

  it("renders a horizontal rule after a bold sentence with trailing whitespace", () => {
    const html = parseMarkdown(
      "**我的答案是：不一定。 **\n\n---\n\n## 下一节",
      themes[0]
    );

    expect(html).toContain("<strong");
    expect(html).toContain("我的答案是：不一定。");
    expect(html).toContain("<hr");
    expect(html).toContain("下一节");
    expect(html).not.toContain("---");
  });

  it("splits a trailing horizontal rule marker out of a bold paragraph", () => {
    const html = parseMarkdown(
      "**我的答案是：不一定。 ** ---\n## 下一节",
      themes[0]
    );

    expect(html).toContain("<strong");
    expect(html).toContain("我的答案是：不一定。");
    expect(html).toContain("<hr");
    expect(html).toContain("下一节");
    expect(html).not.toContain("---");
  });
});
