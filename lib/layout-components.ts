export type LayoutComponentId =
  | "section-heading"
  | "card"
  | "quote-box"
  | "tip-box"
  | "divider"
  | "cta";

export interface LayoutComponent {
  id: LayoutComponentId;
  label: string;
  description: string;
  icon: string;
  createTemplate: (selectedText?: string) => string;
}

const cleanSelectedText = (selectedText?: string) => selectedText?.trim() || "";

export const layoutComponents: LayoutComponent[] = [
  {
    id: "section-heading",
    label: "小标题",
    description: "插入二级标题",
    icon: "H2",
    createTemplate: (selectedText) =>
      `## ${cleanSelectedText(selectedText) || "小标题"}`,
  },
  {
    id: "card",
    label: "卡片",
    description: "重点内容或小结",
    icon: "▣",
    createTemplate: (selectedText) => `:::card
### 卡片标题
${cleanSelectedText(selectedText) || "卡片正文内容，适合放重点、步骤或小结。"}
:::`,
  },
  {
    id: "quote-box",
    label: "引用框",
    description: "金句或引用来源",
    icon: "❝",
    createTemplate: (selectedText) => `> ${cleanSelectedText(selectedText) || "金句或引用内容"}
>
> -- 引用来源`,
  },
  {
    id: "tip-box",
    label: "提示框",
    description: "提示、注意事项",
    icon: "!",
    createTemplate: (selectedText) => `:::tip
提示标题

${cleanSelectedText(selectedText) || "这里填写提示内容。"}
:::`,
  },
  {
    id: "divider",
    label: "分割线",
    description: "分隔文章段落",
    icon: "—",
    createTemplate: () => "---",
  },
  {
    id: "cta",
    label: "CTA",
    description: "行动引导按钮",
    icon: "↗",
    createTemplate: (selectedText) => `:::cta
行动标题

${cleanSelectedText(selectedText) || "这里填写引导文字。"}

[按钮文案](https://example.com)
:::`,
  },
];

export function createLayoutComponentTemplate(
  id: LayoutComponentId,
  selectedText?: string
): string {
  const component = layoutComponents.find((item) => item.id === id);
  if (!component) {
    throw new Error(`Unknown layout component: ${id}`);
  }
  return component.createTemplate(selectedText);
}
