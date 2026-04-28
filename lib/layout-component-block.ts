import {
  createLayoutComponentTemplate,
  quoteComponents,
  type LayoutComponentId,
} from "./layout-components";
import { insertBlockTemplate } from "./insert-template";

export type LayoutComponentBlockType =
  | "card"
  | "tip"
  | "cta"
  | "quote-card"
  | "quote-bubble"
  | "quote-oval"
  | "quote-star"
  | "quote-line"
  | "quote-frame"
  | "quote-brush"
  | "quote-center"
  | "quote-side";

export interface LayoutComponentBlock {
  type: LayoutComponentBlockType;
  start: number;
  end: number;
  contentStart: number;
  contentEnd: number;
  content: string;
}

export interface LayoutComponentBlockEdit {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

const blockPattern =
  /^:::(card|tip|cta|quote-card|quote-bubble|quote-oval|quote-star|quote-line|quote-frame|quote-brush|quote-center|quote-side)[ \t]*\n([\s\S]*?)\n:::[ \t]*(?=\n|$)/gm;

export function isQuoteComponentId(id: LayoutComponentId): boolean {
  return quoteComponents.some((component) => component.id === id);
}

export function isQuoteBlockType(type: LayoutComponentBlockType): boolean {
  return type.startsWith("quote-");
}

export function getLayoutComponentBlockLabel(
  type: LayoutComponentBlockType
): string {
  const quoteComponent = quoteComponents.find((component) => component.id === type);
  if (quoteComponent) return quoteComponent.label;

  const labels: Record<LayoutComponentBlockType, string> = {
    card: "内容卡片",
    tip: "提示框",
    cta: "行动引导",
    "quote-card": "简约经典",
    "quote-bubble": "对话框",
    "quote-oval": "柔和椭圆",
    "quote-star": "星芒线框",
    "quote-line": "横线爱心",
    "quote-frame": "圆角边框",
    "quote-brush": "浅色刷痕",
    "quote-center": "居中金句",
    "quote-side": "侧边金句",
  };

  return labels[type];
}

export function findLayoutComponentBlockAtCursor(
  value: string,
  cursor: number
): LayoutComponentBlock | null {
  blockPattern.lastIndex = 0;

  for (const match of value.matchAll(blockPattern)) {
    const fullBlock = match[0];
    const start = match.index ?? 0;
    const end = start + fullBlock.length;

    if (cursor < start || cursor > end) continue;

    const firstLineBreak = fullBlock.indexOf("\n");
    const closingFence = fullBlock.lastIndexOf("\n:::");
    const contentStart = start + firstLineBreak + 1;
    const contentEnd = start + closingFence;

    return {
      type: match[1] as LayoutComponentBlockType,
      start,
      end,
      contentStart,
      contentEnd,
      content: value.slice(contentStart, contentEnd),
    };
  }

  return null;
}

export function replaceLayoutComponentBlock(
  value: string,
  cursor: number,
  nextType: LayoutComponentBlockType
): LayoutComponentBlockEdit | null {
  const block = findLayoutComponentBlockAtCursor(value, cursor);
  if (!block) return null;

  const openingFence = `:::${nextType}`;
  const nextBlock = `${openingFence}\n${block.content}\n:::`;
  const selectionStart = block.start + openingFence.length + 1;

  return {
    value: `${value.slice(0, block.start)}${nextBlock}${value.slice(block.end)}`,
    selectionStart,
    selectionEnd: selectionStart + block.content.length,
  };
}

export function replaceLayoutComponentBlockWithTemplate(
  value: string,
  cursor: number,
  template: string
): LayoutComponentBlockEdit | null {
  const block = findLayoutComponentBlockAtCursor(value, cursor);
  if (!block) return null;

  const trimmedTemplate = template.trim();

  return {
    value: `${value.slice(0, block.start)}${trimmedTemplate}${value.slice(block.end)}`,
    selectionStart: block.start,
    selectionEnd: block.start + trimmedTemplate.length,
  };
}

export function unwrapLayoutComponentBlock(
  value: string,
  cursor: number
): LayoutComponentBlockEdit | null {
  const block = findLayoutComponentBlockAtCursor(value, cursor);
  if (!block) return null;

  return {
    value: `${value.slice(0, block.start)}${block.content}${value.slice(block.end)}`,
    selectionStart: block.start,
    selectionEnd: block.start + block.content.length,
  };
}

export function createLayoutComponentEdit(
  value: string,
  start: number,
  end: number,
  id: LayoutComponentId
): LayoutComponentBlockEdit {
  const selectedText = value.slice(start, end);

  if (start === end) {
    const activeBlock = findLayoutComponentBlockAtCursor(value, start);

    if (activeBlock) {
      const replacement =
        isQuoteBlockType(activeBlock.type) && isQuoteComponentId(id)
          ? replaceLayoutComponentBlock(
              value,
              start,
              id as LayoutComponentBlockType
            )
          : replaceLayoutComponentBlockWithTemplate(
              value,
              start,
              createLayoutComponentTemplate(id, activeBlock.content)
            );

      if (replacement) return replacement;
    }
  }

  return insertBlockTemplate(
    value,
    start,
    end,
    createLayoutComponentTemplate(id, selectedText)
  );
}
