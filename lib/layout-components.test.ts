import { describe, expect, it } from "vitest";
import {
  createLayoutComponentTemplate,
  layoutComponents,
  type LayoutComponentId,
} from "./layout-components";

describe("layoutComponents", () => {
  it("defines the six first-version components in menu order", () => {
    expect(layoutComponents.map((item) => item.id)).toEqual([
      "section-heading",
      "card",
      "quote-box",
      "tip-box",
      "divider",
      "cta",
    ]);
  });

  it("creates a card template with selected text as body content", () => {
    const template = createLayoutComponentTemplate("card", "这里是选中的重点内容");

    expect(template).toContain(":::card");
    expect(template).toContain("### 卡片标题");
    expect(template).toContain("这里是选中的重点内容");
    expect(template).toContain(":::");
  });

  it("creates readable default templates for every component", () => {
    const ids: LayoutComponentId[] = [
      "section-heading",
      "card",
      "quote-box",
      "tip-box",
      "divider",
      "cta",
    ];

    for (const id of ids) {
      expect(createLayoutComponentTemplate(id)).toMatch(/\S/);
    }
  });
});
