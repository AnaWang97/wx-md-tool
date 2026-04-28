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

  it("renders quote showcase block styles", () => {
    const cardHtml = parseMarkdown(":::quote-card\n先让读者扫得懂\n:::", themes[0]);
    const bubbleHtml = parseMarkdown(":::quote-bubble\n先让读者扫得懂\n:::", themes[0]);
    const ovalHtml = parseMarkdown(":::quote-oval\n先让读者扫得懂\n:::", themes[0]);
    const starHtml = parseMarkdown(":::quote-star\n先让读者扫得懂\n:::", themes[0]);
    const lineHtml = parseMarkdown(":::quote-line\n先让读者扫得懂\n:::", themes[0]);
    const frameHtml = parseMarkdown(":::quote-frame\n先让读者扫得懂\n:::", themes[0]);
    const brushHtml = parseMarkdown(":::quote-brush\n先让读者扫得懂\n:::", themes[0]);

    expect(cardHtml).toContain('data-layout-component="quote-card"');
    expect(bubbleHtml).toContain('data-layout-component="quote-bubble"');
    expect(ovalHtml).toContain('data-layout-component="quote-oval"');
    expect(starHtml).toContain('data-layout-component="quote-star"');
    expect(lineHtml).toContain('data-layout-component="quote-line"');
    expect(frameHtml).toContain('data-layout-component="quote-frame"');
    expect(brushHtml).toContain('data-layout-component="quote-brush"');
    expect(cardHtml).toContain("先让读者扫得懂");
    expect(cardHtml).toContain("font-size: inherit");
    expect(cardHtml).toContain("text-align: left");
    expect(cardHtml).toContain("text-align: right");
    expect(cardHtml).not.toContain("font-size: 17px");
    expect(bubbleHtml).toContain("transform: rotate(45deg)");
    expect(ovalHtml).toContain("border-radius: 999px");
    expect(ovalHtml).not.toContain("“");
    expect(ovalHtml).not.toContain("”");
    expect(starHtml).toContain("✦");
    expect(lineHtml).toContain("♥");
    expect(frameHtml).toContain("border-radius: 22px");
    expect(brushHtml).toContain("linear-gradient(100deg");
  });

  it("renders quote component alignment from opening fence attributes", () => {
    const leftHtml = parseMarkdown(":::quote-line align=left\n先让读者扫得懂\n:::", themes[0]);
    const rightHtml = parseMarkdown(":::quote-frame align=right\n先让读者扫得懂\n:::", themes[0]);
    const justifyHtml = parseMarkdown(
      ":::quote-card align=justify\n先让读者扫得懂\n\n再让读者愿意行动\n:::",
      themes[0]
    );

    expect(leftHtml).toContain('data-layout-component="quote-line"');
    expect(leftHtml).toContain("text-align: left");
    expect(rightHtml).toContain('data-layout-component="quote-frame"');
    expect(rightHtml).toContain("text-align: right");
    expect(justifyHtml).toContain('data-layout-component="quote-card"');
    expect(justifyHtml).toContain("text-align: justify");
  });

  it("renders general alignment blocks", () => {
    const html = parseMarkdown(
      ":::align-center\n**需要居中的文字**\n:::",
      themes[0]
    );

    expect(html).toContain('data-layout-component="align-center"');
    expect(html).toContain("text-align: center");
    expect(html).toContain("需要居中的文字");
    expect(html).not.toContain("text-align: justify");
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
