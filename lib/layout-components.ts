export type LayoutComponentId =
  | "quote-card"
  | "quote-center"
  | "quote-side"
  | "key-point"
  | "step-list"
  | "warning-tip"
  | "summary-card"
  | "follow-cta";

export interface LayoutComponent {
  id: LayoutComponentId;
  label: string;
  description: string;
  icon: string;
  createTemplate: (selectedText?: string) => string;
}

const cleanSelectedText = (selectedText?: string) => selectedText?.trim() || "";

const splitSelectedLines = (selectedText?: string) =>
  cleanSelectedText(selectedText)
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""))
    .filter(Boolean);

const createStepListTemplate = (selectedText?: string) => {
  const lines = splitSelectedLines(selectedText);
  const steps =
    lines.length > 0
      ? lines
      : ["第一步：写清楚要做什么", "第二步：补充关键细节", "第三步：给出行动建议"];

  return steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
};

const createSummaryTemplate = (selectedText?: string) => {
  const firstBullet = cleanSelectedText(selectedText) || "这里写本文最重要的结论";

  return `:::card
### 本文小结
- ${firstBullet}
- 可以继续补充第二个重点
- 最后写一个可执行的行动建议
:::`;
};

const createQuoteTemplate = (
  type: "quote-card" | "quote-center" | "quote-side",
  selectedText?: string
) => `:::${type}
${cleanSelectedText(selectedText) || "这里写一句最想让读者记住的话"}
:::`;

export const layoutComponents: LayoutComponent[] = [
  {
    id: "quote-card",
    label: "金句卡片",
    description: "选一句话变精致卡片",
    icon: "句",
    createTemplate: (selectedText) => createQuoteTemplate("quote-card", selectedText),
  },
  {
    id: "quote-center",
    label: "居中金句",
    description: "选一句话变留白展示",
    icon: "中",
    createTemplate: (selectedText) => createQuoteTemplate("quote-center", selectedText),
  },
  {
    id: "quote-side",
    label: "侧栏金句",
    description: "选一句话变左线强调",
    icon: "引",
    createTemplate: (selectedText) => createQuoteTemplate("quote-side", selectedText),
  },
  {
    id: "key-point",
    label: "核心观点",
    description: "选一段文字变成观点卡",
    icon: "观",
    createTemplate: (selectedText) => `:::card
### 核心观点
${cleanSelectedText(selectedText) || "这里写这段内容最重要的观点。"}
:::`,
  },
  {
    id: "step-list",
    label: "步骤清单",
    description: "选多行文字变编号步骤",
    icon: "1",
    createTemplate: (selectedText) => createStepListTemplate(selectedText),
  },
  {
    id: "warning-tip",
    label: "避坑提醒",
    description: "选注意事项变提醒框",
    icon: "!",
    createTemplate: (selectedText) => `:::tip
避坑提醒

${cleanSelectedText(selectedText) || "这里写容易忽略的注意事项。"}
:::`,
  },
  {
    id: "summary-card",
    label: "总结复盘",
    description: "选结论变小结卡片",
    icon: "结",
    createTemplate: (selectedText) => createSummaryTemplate(selectedText),
  },
  {
    id: "follow-cta",
    label: "关注引导",
    description: "选一句话变行动引导",
    icon: "↗",
    createTemplate: (selectedText) => `:::cta
觉得有用就收藏起来

${cleanSelectedText(selectedText) || "下次需要写同类内容时，可以直接回来套用这套结构。"}

[关注我，继续看更多实用内容](#)
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
