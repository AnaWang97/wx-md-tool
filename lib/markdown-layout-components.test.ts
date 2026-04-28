import { describe, expect, it } from "vitest";
import { parseMarkdown } from "./markdown";
import { themes } from "./themes";

describe("layout component Markdown blocks", () => {
  it("renders card blocks with themed inline styles", () => {
    const html = parseMarkdown(":::card\n### 卡片标题\n卡片内容\n:::", themes[0]);

    expect(html).toContain('data-layout-component="card"');
    expect(html).toContain("卡片标题");
    expect(html).toContain("卡片内容");
    expect(html).toContain(themes[0].preview);
  });

  it("renders tip blocks with a light themed background", () => {
    const html = parseMarkdown(":::tip\n提示标题\n\n提示内容\n:::", themes[0]);

    expect(html).toContain('data-layout-component="tip"');
    expect(html).toContain("提示标题");
    expect(html).toContain("提示内容");
    expect(html).toContain("rgba(7, 193, 96, 0.1)");
  });

  it("renders CTA blocks with a button when a Markdown link exists", () => {
    const html = parseMarkdown(
      ":::cta\n行动标题\n\n欢迎继续阅读。\n\n[了解更多](https://example.com)\n:::",
      themes[0]
    );

    expect(html).toContain('data-layout-component="cta"');
    expect(html).toContain("行动标题");
    expect(html).toContain("欢迎继续阅读。");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain("了解更多");
  });

  it("renders three quote showcase block styles", () => {
    const cardHtml = parseMarkdown(":::quote-card\n先让读者扫得懂\n:::", themes[0]);
    const centerHtml = parseMarkdown(":::quote-center\n先让读者扫得懂\n:::", themes[0]);
    const sideHtml = parseMarkdown(":::quote-side\n先让读者扫得懂\n:::", themes[0]);

    expect(cardHtml).toContain('data-layout-component="quote-card"');
    expect(centerHtml).toContain('data-layout-component="quote-center"');
    expect(sideHtml).toContain('data-layout-component="quote-side"');
    expect(cardHtml).toContain("先让读者扫得懂");
    expect(centerHtml).toContain("text-align: center");
    expect(centerHtml).toContain("text-align: left");
    expect(centerHtml).toContain("text-align: right");
    expect(centerHtml).not.toContain("“ ”");
    expect(sideHtml).toContain("border-left");
  });

  it("uses custom primary color when custom styles are active", () => {
    const html = parseMarkdown(":::card\n卡片内容\n:::", themes[0], {
      primaryColor: "#ec4899",
      fontSize: 16,
      titleFontSize: 22,
      lineHeight: 1.75,
      paragraphIndent: false,
      codeTheme: "github-dark",
    });

    expect(html).toContain("#ec4899");
  });

  it("leaves malformed blocks readable instead of crashing", () => {
    const html = parseMarkdown(":::card\n没有闭合的卡片", themes[0]);

    expect(html).toContain("没有闭合的卡片");
    expect(html).toContain("<section");
  });
});
