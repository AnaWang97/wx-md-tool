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
  | "quote-side"
  | "align-left"
  | "align-center"
  | "align-right"
  | "align-justify";

export type LayoutComponentAlign = "left" | "center" | "right" | "justify";

export interface LayoutComponentBlock {
  type: LayoutComponentBlockType;
  attrs: string;
  align: LayoutComponentAlign;
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
  /^:::(card|tip|cta|quote-card|quote-bubble|quote-oval|quote-star|quote-line|quote-frame|quote-brush|quote-center|quote-side|align-left|align-center|align-right|align-justify)([ \t][^\n]*)?\n([\s\S]*?)\n:::[ \t]*(?=\n|$)/gm;

const alignValues = new Set<LayoutComponentAlign>([
  "left",
  "center",
  "right",
  "justify",
]);

export function isLayoutComponentAlign(
  value: string
): value is LayoutComponentAlign {
  return alignValues.has(value as LayoutComponentAlign);
}

function getLayoutComponentAlign(attrs: string): LayoutComponentAlign {
  const match = attrs.match(/\balign=(left|center|right|justify)\b/);
  return match && isLayoutComponentAlign(match[1]) ? match[1] : "center";
}

function setLayoutComponentAlignAttr(
  attrs: string,
  align: LayoutComponentAlign
): string {
  const trimmedAttrs = attrs.trim();

  if (!trimmedAttrs) return ` align=${align}`;

  if (/\balign=[^\s]+/.test(trimmedAttrs)) {
    return ` ${trimmedAttrs.replace(/\balign=[^\s]+/, `align=${align}`)}`;
  }

  return ` ${trimmedAttrs} align=${align}`;
}

export function isQuoteComponentId(id: LayoutComponentId): boolean {
  return quoteComponents.some((component) => component.id === id);
}

export function isQuoteBlockType(type: LayoutComponentBlockType): boolean {
  return type.startsWith("quote-");
}

export function isAlignmentBlockType(type: LayoutComponentBlockType): boolean {
  return type.startsWith("align-");
}

function getAlignmentBlockType(
  align: LayoutComponentAlign
): LayoutComponentBlockType {
  return `align-${align}` as LayoutComponentBlockType;
}

function getAlignmentFromBlockType(
  type: LayoutComponentBlockType
): LayoutComponentAlign {
  const align = type.replace("align-", "");
  return isLayoutComponentAlign(align) ? align : "center";
}

function getBlockAlign(
  type: LayoutComponentBlockType,
  attrs: string
): LayoutComponentAlign {
  if (isQuoteBlockType(type)) return getLayoutComponentAlign(attrs);
  if (isAlignmentBlockType(type)) return getAlignmentFromBlockType(type);
  return "center";
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
    "align-left": "左对齐",
    "align-center": "居中对齐",
    "align-right": "右对齐",
    "align-justify": "两端对齐",
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

    const type = match[1] as LayoutComponentBlockType;
    const attrs = match[2] ?? "";

    return {
      type,
      attrs,
      align: getBlockAlign(type, attrs),
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

  const openingFence = `:::${nextType}${
    isQuoteBlockType(nextType) ? block.attrs : ""
  }`;
  const nextBlock = `${openingFence}\n${block.content}\n:::`;
  const selectionStart = block.start + openingFence.length + 1;

  return {
    value: `${value.slice(0, block.start)}${nextBlock}${value.slice(block.end)}`,
    selectionStart,
    selectionEnd: selectionStart + block.content.length,
  };
}

export function setLayoutComponentBlockAlign(
  value: string,
  cursor: number,
  align: LayoutComponentAlign
): LayoutComponentBlockEdit | null {
  const block = findLayoutComponentBlockAtCursor(value, cursor);
  if (!block || !isQuoteBlockType(block.type)) return null;

  const nextAttrs = setLayoutComponentAlignAttr(block.attrs, align);
  const openingFence = `:::${block.type}${nextAttrs}`;
  const nextBlock = `${openingFence}\n${block.content}\n:::`;
  const selectionStart = block.start + openingFence.length + 1;

  return {
    value: `${value.slice(0, block.start)}${nextBlock}${value.slice(block.end)}`,
    selectionStart,
    selectionEnd: selectionStart + block.content.length,
  };
}

export function createAlignmentBlockEdit(
  value: string,
  start: number,
  end: number,
  align: LayoutComponentAlign
): LayoutComponentBlockEdit {
  const activeBlock = findLayoutComponentBlockAtCursor(value, start);
  const nextType = getAlignmentBlockType(align);

  if (activeBlock && isAlignmentBlockType(activeBlock.type)) {
    if (activeBlock.type === nextType) {
      const unwrapped = unwrapLayoutComponentBlock(value, start);
      if (unwrapped) return unwrapped;
    }

    const replaced = replaceLayoutComponentBlock(value, start, nextType);
    if (replaced) return replaced;
  }

  const selectedText = value.slice(start, end);
  return insertBlockTemplate(
    value,
    start,
    end,
    `:::${nextType}\n${selectedText.trim() || "这里输入要对齐的文字"}\n:::`
  );
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
