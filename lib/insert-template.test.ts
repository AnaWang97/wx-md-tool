import { describe, expect, it } from "vitest";
import { insertBlockTemplate } from "./insert-template";

describe("insertBlockTemplate", () => {
  it("inserts a block between paragraphs with clean blank lines", () => {
    const value = "第一段\n\n第二段";
    const template = ":::card\n内容\n:::";
    const result = insertBlockTemplate(value, 5, 5, template);

    expect(result.value).toBe("第一段\n\n:::card\n内容\n:::\n\n第二段");
    expect(result.selectionStart).toBe(5);
    expect(result.selectionEnd).toBe(5 + template.length);
  });

  it("replaces selected text with the generated block", () => {
    const value = "开头\n选中文字\n结尾";
    const template = "> 选中文字";
    const result = insertBlockTemplate(value, 3, 7, template);

    expect(result.value).toBe("开头\n\n> 选中文字\n\n结尾");
    expect(result.selectionStart).toBe(4);
    expect(result.selectionEnd).toBe(4 + template.length);
  });

  it("does not add leading blank lines at the start of the document", () => {
    const template = "## 小标题";
    const result = insertBlockTemplate("正文", 0, 0, template);

    expect(result.value).toBe("## 小标题\n\n正文");
    expect(result.selectionStart).toBe(0);
    expect(result.selectionEnd).toBe(template.length);
  });
});
