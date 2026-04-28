import { describe, expect, it } from "vitest";
import {
  createLayoutComponentTemplate,
  layoutComponents,
  type LayoutComponentId,
} from "./layout-components";

describe("layoutComponents", () => {
  it("defines scene components with three quote showcase styles", () => {
    expect(layoutComponents.map((item) => item.id)).toEqual([
      "quote-card",
      "quote-center",
      "quote-side",
      "key-point",
      "step-list",
      "warning-tip",
      "summary-card",
      "follow-cta",
    ]);

    expect(layoutComponents.map((item) => item.label)).toEqual([
      "金句卡片",
      "居中金句",
      "侧栏金句",
      "核心观点",
      "步骤清单",
      "避坑提醒",
      "总结复盘",
      "关注引导",
    ]);
  });

  it("creates distinct quote showcase templates with selected text", () => {
    expect(createLayoutComponentTemplate("quote-card", "先让读者扫得懂")).toContain(
      ":::quote-card\n先让读者扫得懂\n:::"
    );
    expect(createLayoutComponentTemplate("quote-center", "先让读者扫得懂")).toContain(
      ":::quote-center\n先让读者扫得懂\n:::"
    );
    expect(createLayoutComponentTemplate("quote-side", "先让读者扫得懂")).toContain(
      ":::quote-side\n先让读者扫得懂\n:::"
    );
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
      "quote-center",
      "quote-side",
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
