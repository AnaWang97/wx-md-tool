export type LayoutComponentId =
  | "quote-card"
  | "quote-bubble"
  | "quote-oval"
  | "quote-star"
  | "quote-line"
  | "quote-frame"
  | "quote-brush"
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
  type:
    | "quote-card"
    | "quote-bubble"
    | "quote-oval"
    | "quote-star"
    | "quote-line"
    | "quote-frame"
    | "quote-brush",
  selectedText?: string
) => `:::${type}
${cleanSelectedText(selectedText) || "这里写一句最想让读者记住的话"}
:::`;

export const quoteComponents: LayoutComponent[] = [
  {
    id: "quote-card",
    label: "简约经典",
    description: "基础金句卡片",
    icon: "简",
    createTemplate: (selectedText) => createQuoteTemplate("quote-card", selectedText),
  },
  {
    id: "quote-bubble",
    label: "对话框",
    description: "边框气泡样式",
    icon: "框",
    createTemplate: (selectedText) => createQuoteTemplate("quote-bubble", selectedText),
  },
  {
    id: "quote-oval",
    label: "柔和椭圆",
    description: "浅色椭圆背景",
    icon: "椭",
    createTemplate: (selectedText) => createQuoteTemplate("quote-oval", selectedText),
  },
  {
    id: "quote-star",
    label: "星芒线框",
    description: "星星和细线点缀",
    icon: "星",
    createTemplate: (selectedText) => createQuoteTemplate("quote-star", selectedText),
  },
  {
    id: "quote-line",
    label: "横线爱心",
    description: "横线和小爱心装饰",
    icon: "心",
    createTemplate: (selectedText) => createQuoteTemplate("quote-line", selectedText),
  },
  {
    id: "quote-frame",
    label: "圆角边框",
    description: "细线圆角框",
    icon: "框",
    createTemplate: (selectedText) => createQuoteTemplate("quote-frame", selectedText),
  },
  {
    id: "quote-brush",
    label: "浅色刷痕",
    description: "柔和笔刷底色",
    icon: "刷",
    createTemplate: (selectedText) => createQuoteTemplate("quote-brush", selectedText),
  },
];

export const articleComponents: LayoutComponent[] = [
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

export const layoutComponents: LayoutComponent[] = [
  ...quoteComponents,
  ...articleComponents,
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
