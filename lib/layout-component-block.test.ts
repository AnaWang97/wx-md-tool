import { describe, expect, it } from "vitest";
import {
  createLayoutComponentEdit,
  findLayoutComponentBlockAtCursor,
  replaceLayoutComponentBlock,
  setLayoutComponentBlockAlign,
  unwrapLayoutComponentBlock,
} from "./layout-component-block";

describe("layout component block editing", () => {
  it("finds the component block around the cursor", () => {
    const value = [
      "开头",
      "",
      ":::quote-bubble",
      "你是最棒的",
      ":::",
      "",
      "结尾",
    ].join("\n");

    const block = findLayoutComponentBlockAtCursor(
      value,
      value.indexOf("最棒")
    );

    expect(block).toMatchObject({
      type: "quote-bubble",
      content: "你是最棒的",
    });
    expect(block?.start).toBe(value.indexOf(":::quote-bubble"));
    expect(block?.end).toBe(value.indexOf("\n\n结尾"));
  });

  it("changes a quote component style while preserving its content", () => {
    const value = ":::quote-bubble\n你是最棒的\n:::";
    const result = replaceLayoutComponentBlock(
      value,
      value.indexOf("最棒"),
      "quote-card"
    );

    expect(result?.value).toBe(":::quote-card\n你是最棒的\n:::");
    expect(result?.selectionStart).toBe(":::quote-card\n".length);
    expect(result?.selectionEnd).toBe(":::quote-card\n你是最棒的".length);
  });

  it("reads quote component alignment from the opening fence", () => {
    const value = ":::quote-line align=right\n你是最棒的\n:::";
    const block = findLayoutComponentBlockAtCursor(value, value.indexOf("最棒"));

    expect(block).toMatchObject({
      type: "quote-line",
      align: "right",
      content: "你是最棒的",
    });
  });

  it("preserves quote alignment when changing the quote style", () => {
    const value = ":::quote-line align=right\n你是最棒的\n:::";
    const result = replaceLayoutComponentBlock(
      value,
      value.indexOf("最棒"),
      "quote-card"
    );

    expect(result?.value).toBe(":::quote-card align=right\n你是最棒的\n:::");
  });

  it("adds and replaces quote component alignment", () => {
    const value = ":::quote-line\n你是最棒的\n:::";
    const added = setLayoutComponentBlockAlign(value, value.indexOf("最棒"), "left");

    expect(added?.value).toBe(":::quote-line align=left\n你是最棒的\n:::");

    const replaced = setLayoutComponentBlockAlign(
      added?.value ?? "",
      added?.value.indexOf("最棒") ?? 0,
      "justify"
    );

    expect(replaced?.value).toBe(":::quote-line align=justify\n你是最棒的\n:::");
  });

  it("unwraps a component block and keeps the inner content", () => {
    const value = "开头\n\n:::tip\n避坑提醒\n\n不要手删 Markdown\n:::\n\n结尾";
    const result = unwrapLayoutComponentBlock(value, value.indexOf("手删"));

    expect(result?.value).toBe("开头\n\n避坑提醒\n\n不要手删 Markdown\n\n结尾");
    expect(result?.selectionStart).toBe("开头\n\n".length);
    expect(result?.selectionEnd).toBe("开头\n\n避坑提醒\n\n不要手删 Markdown".length);
  });

  it("returns null when the cursor is outside a component block", () => {
    expect(findLayoutComponentBlockAtCursor("正文\n\n:::card\n内容\n:::", 1)).toBeNull();
  });

  it("uses a collapsed cursor inside a quote block to switch quote styles", () => {
    const value = "开头\n\n:::quote-bubble\n你是最棒的\n:::\n\n结尾";
    const cursor = value.indexOf("最棒");
    const result = createLayoutComponentEdit(value, cursor, cursor, "quote-card");

    expect(result.value).toBe("开头\n\n:::quote-card\n你是最棒的\n:::\n\n结尾");
  });

  it("uses a collapsed cursor inside a component block to replace the whole component", () => {
    const value = ":::card\n这是一段重点\n:::";
    const cursor = value.indexOf("重点");
    const result = createLayoutComponentEdit(value, cursor, cursor, "warning-tip");

    expect(result.value).toBe(":::tip\n避坑提醒\n\n这是一段重点\n:::");
  });
});
