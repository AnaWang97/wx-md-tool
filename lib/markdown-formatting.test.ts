import { describe, expect, it } from "vitest";
import { toggleTextAffix } from "./markdown-formatting";

describe("toggleTextAffix", () => {
  it("wraps selected text and keeps the inner text selected", () => {
    const result = toggleTextAffix({
      value: "事半功倍",
      start: 0,
      end: 4,
      prefix: "==",
      suffix: "==",
      defaultText: "高亮文本",
    });

    expect(result.value).toBe("==事半功倍==");
    expect(result.selectionStart).toBe(2);
    expect(result.selectionEnd).toBe(6);
  });

  it("removes the style when the selected text is already surrounded", () => {
    const result = toggleTextAffix({
      value: "**事半功倍**",
      start: 2,
      end: 6,
      prefix: "**",
      suffix: "**",
      defaultText: "粗体文本",
    });

    expect(result.value).toBe("事半功倍");
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(4);
  });

  it("removes the style when the selection includes the markers", () => {
    const result = toggleTextAffix({
      value: "`事半功倍`",
      start: 0,
      end: 6,
      prefix: "`",
      suffix: "`",
      defaultText: "code",
    });

    expect(result.value).toBe("事半功倍");
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(4);
  });

  it("can toggle a block prefix while preserving the current line position", () => {
    const applied = toggleTextAffix({
      value: "第一段。事半功倍",
      start: 4,
      end: 8,
      prefix: "# ",
      suffix: "",
      defaultText: "标题",
      leadingPrefix: "\n",
    });

    expect(applied.value).toBe("第一段。\n# 事半功倍");
    expect(applied.selectionStart).toBe(7);
    expect(applied.selectionEnd).toBe(11);

    const removed = toggleTextAffix({
      value: applied.value,
      start: applied.selectionStart,
      end: applied.selectionEnd,
      prefix: "# ",
      suffix: "",
      defaultText: "标题",
    });

    expect(removed.value).toBe("第一段。\n事半功倍");
    expect(removed.selectionStart).toBe(5);
    expect(removed.selectionEnd).toBe(9);
  });
});
