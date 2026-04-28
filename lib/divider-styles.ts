export type DividerStyleId =
  | "divider-star-candy"
  | "divider-flower-leaf"
  | "divider-heart-dot"
  | "divider-soft-line"
  | "divider-dot-line"
  | "divider-double-line"
  | "divider-dash-line"
  | "divider-diamond-line";

export interface DividerStyleOption {
  id: DividerStyleId;
  label: string;
  description: string;
  icon: string;
  followsTheme: boolean;
}

export const dividerStyleOptions: DividerStyleOption[] = [
  {
    id: "divider-star-candy",
    label: "星糖点点",
    description: "固定糖果配色",
    icon: "星",
    followsTheme: false,
  },
  {
    id: "divider-flower-leaf",
    label: "小花叶片",
    description: "固定粉绿配色",
    icon: "花",
    followsTheme: false,
  },
  {
    id: "divider-heart-dot",
    label: "爱心点线",
    description: "跟随主题色",
    icon: "心",
    followsTheme: true,
  },
  {
    id: "divider-soft-line",
    label: "柔光细线",
    description: "跟随主题色",
    icon: "线",
    followsTheme: true,
  },
  {
    id: "divider-dot-line",
    label: "中点细线",
    description: "跟随主题色",
    icon: "点",
    followsTheme: true,
  },
  {
    id: "divider-double-line",
    label: "双细线",
    description: "跟随主题色",
    icon: "双",
    followsTheme: true,
  },
  {
    id: "divider-dash-line",
    label: "轻虚线",
    description: "跟随主题色",
    icon: "虚",
    followsTheme: true,
  },
  {
    id: "divider-diamond-line",
    label: "小钻细线",
    description: "跟随主题色",
    icon: "钻",
    followsTheme: true,
  },
];

export function createDividerStyleTemplate(id: DividerStyleId): string {
  return `:::${id}\n:::`;
}
