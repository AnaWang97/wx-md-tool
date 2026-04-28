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

  it("renders ordered lists as WeChat-safe inline numbered paragraphs", () => {
    const html = parseMarkdown(
      "1. 它告诉 AI 你想让它扮演什么角色。\n2. 它告诉 AI 你想要什么结果。\n3. 它告诉 AI 输出的时候要遵守什么边界。",
      themes[0]
    );

    expect(html).toContain('data-list="ordered"');
    expect(html).toContain('data-list-item="ordered"');
    expect(html).toContain(">1. </span><span");
    expect(html).toContain("它告诉 AI 你想让它扮演什么角色。");
    expect(html).not.toContain("<ol");
    expect(html).not.toContain("<li");
  });

  it("keeps the default horizontal rule unchanged", () => {
    const html = parseMarkdown("---", themes[0]);

    expect(html).toContain(`<hr style="${themes[0].styles.hr}" />`);
    expect(html).not.toContain("data-divider");
  });

  it("renders decorative divider blocks without replacing the default hr", () => {
    const html = parseMarkdown(":::divider-star-candy\n:::", themes[0]);

    expect(html).toContain('data-divider="star-candy"');
    expect(html).toContain("#f9d86e");
    expect(html).not.toContain("<hr");
  });

  it("renders theme-following divider blocks with the active primary color", () => {
    const html = parseMarkdown(":::divider-heart-dot\n:::", themes[0], {
      primaryColor: "#ec4899",
      fontSize: 16,
      titleFontSize: 22,
      lineHeight: 1.75,
      paragraphIndent: false,
      codeTheme: "github-dark",
    });

    expect(html).toContain('data-divider="heart-dot"');
    expect(html).toContain("#ec4899");
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

  it("normalizes pasted whitespace around horizontal rules", () => {
    const html = parseMarkdown(
      "**我的答案是：不一定。 **\n\n\u00a0---\u3000\n\n## 下一节",
      themes[0]
    );

    expect(html).toContain("<strong");
    expect(html).toContain("我的答案是：不一定。");
    expect(html).toContain("<hr");
    expect(html).toContain("下一节");
    expect(html).not.toContain("---");
  });

  it("normalizes windows line endings around horizontal rules", () => {
    const html = parseMarkdown(
      "**我的答案是：不一定。 **\r\n\r\n---\r\n\r\n## 下一节",
      themes[0]
    );

    expect(html).toContain("<strong");
    expect(html).toContain("我的答案是：不一定。");
    expect(html).toContain("<hr");
    expect(html).toContain("下一节");
    expect(html).not.toContain("---");
  });

  it("renders a horizontal rule in the article snippet after a bold answer", () => {
    const html = parseMarkdown(
      `但今天的问题是：当模型本身已经足够聪明，甚至能够理解复杂目标、使用工具、检查结果、完成多步骤任务时，我们还要不要继续用过去那种“事无巨细地控制它”的方式？

**我的答案是：不一定。**

---

这个问题还是没有被解决。`,
      themes[0]
    );

    expect(html).toContain("但今天的问题是");
    expect(html).toContain("<strong");
    expect(html).toContain("我的答案是：不一定。");
    expect(html).toContain("<hr");
    expect(html).toContain("这个问题还是没有被解决。");
    expect(html).not.toContain("不一定。</strong> ---");
  });

  it("normalizes unicode line separators around horizontal rules", () => {
    const html = parseMarkdown(
      "但今天的问题是：当模型本身已经足够聪明。\u2028\u2028**我的答案是：不一定。 **\u2028\u2028---\u2028\u2028## 二、提示词太细",
      themes[0]
    );

    expect(html).toContain("<strong");
    expect(html).toContain("我的答案是：不一定。");
    expect(html).toContain("<hr");
    expect(html).toContain("二、提示词太细");
    expect(html).not.toContain("不一定。</strong> ---");
  });

  it("keeps a previous inline bold sentence from consuming a later horizontal rule", () => {
    const html = parseMarkdown(
      `当模型能力弱的时候，我们需要靠详细提示词补足它的能力；但当模型能力变强以后，我们更需要做的不是继续加限制，而是让它理解你的**真实目标、真实背景、真实偏好和真实素材**。

但今天的问题是：当模型本身已经足够聪明，甚至能够理解复杂目标、使用工具、检查结果、完成多步骤任务时，我们还要不要继续用过去那种“事无巨细地控制它”的方式？

**我的答案是：不一定。 **

---

## 二、提示词太细，为什么会限制模型？`,
      themes[0]
    );

    expect(html).toContain("真实目标、真实背景、真实偏好和真实素材");
    expect(html).toContain("我的答案是：不一定。");
    expect(html).toContain("<hr");
    expect(html).toContain("二、提示词太细，为什么会限制模型？");
    expect(html).not.toContain("---");
  });

  it("normalizes invisible trailing spaces inside bold before a horizontal rule", () => {
    const html = parseMarkdown(
      `**我的答案是：不一定。\u00a0**\n\n---\n\n## 一、以前我们为什么迷信“长提示词”？\n\n当模型能力弱的时候，我们需要靠详细提示词补足它的能力；但当模型能力变强以后，我们更需要做的不是继续加限制，而是让它理解你的**真实目标、真实背景、真实偏好和真实素材**。`,
      themes[0]
    );

    expect(html).toContain("我的答案是：不一定。");
    expect(html).toContain("<hr");
    expect(html).toContain("一、以前我们为什么迷信");
    expect(html).toContain("真实目标、真实背景、真实偏好和真实素材");
    expect(html).not.toContain("---");
  });
});
