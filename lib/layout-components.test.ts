import { describe, expect, it } from "vitest";
import {
  createLayoutComponentTemplate,
  quoteComponents,
  layoutComponents,
  type LayoutComponentId,
} from "./layout-components";

describe("layoutComponents", () => {
  it("defines scene components with quote styles first", () => {
    expect(layoutComponents.map((item) => item.id)).toEqual([
      "quote-card",
      "quote-bubble",
      "quote-oval",
      "quote-star",
      "quote-line",
      "quote-frame",
      "quote-brush",
      "key-point",
      "step-list",
      "warning-tip",
      "summary-card",
      "follow-cta",
    ]);

    expect(layoutComponents.map((item) => item.label)).toEqual([
      "简约经典",
      "对话框",
      "柔和椭圆",
      "星芒线框",
      "横线爱心",
      "圆角边框",
      "浅色刷痕",
      "核心观点",
      "步骤清单",
      "避坑提醒",
      "总结复盘",
      "关注引导",
    ]);
  });

  it("keeps classic quote style at the top of the quote submenu", () => {
    expect(quoteComponents.map((item) => item.label)).toEqual([
      "简约经典",
      "对话框",
      "柔和椭圆",
      "星芒线框",
      "横线爱心",
      "圆角边框",
      "浅色刷痕",
    ]);
  });

  it("creates distinct quote showcase templates with selected text", () => {
    for (const component of quoteComponents) {
      expect(createLayoutComponentTemplate(component.id, "先让读者扫得懂")).toContain(
        `:::${component.id}\n先让读者扫得懂\n:::`
      );
    }
  });

  it("creates a key point card with selected text as body content", () => {
    const template = createLayoutComponentTemplate("key-point", "这里是选中的重点内容");

    expect(template).toContain(":::card");
    expect(template).toContain("### 核心观点");
    expect(template).toContain("这里是选中的重点内容");
    expect(template).toContain(":::");
  });

  it("turns selected lines into a numbered step list", () => {
    const template = createLayoutComponentTemplate(
      "step-list",
      "确定主题\n整理素材\n发布文章"
    );

    expect(template).toBe("1. 确定主题\n2. 整理素材\n3. 发布文章");
  });

  it("uses selected text as the first summary bullet", () => {
    const template = createLayoutComponentTemplate("summary-card", "先让读者扫得懂");

    expect(template).toContain(":::card");
    expect(template).toContain("### 本文小结");
    expect(template).toContain("- 先让读者扫得懂");
    expect(template).toContain("- 可以继续补充第二个重点");
    expect(template).toContain("- 最后写一个可执行的行动建议");
  });

  it("creates readable default templates for every component", () => {
    const ids: LayoutComponentId[] = [
      "quote-card",
      "quote-bubble",
      "quote-oval",
      "quote-star",
      "quote-line",
      "quote-frame",
      "quote-brush",
      "key-point",
      "step-list",
      "warning-tip",
      "summary-card",
      "follow-cta",
    ];

    for (const id of ids) {
      expect(createLayoutComponentTemplate(id)).toMatch(/\S/);
    }
  });
});
