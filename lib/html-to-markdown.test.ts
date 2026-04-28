import { describe, expect, it } from "vitest";
import {
  createMarkdownImage,
  resolveImageSource,
} from "./html-to-markdown";

describe("html-to-markdown image helpers", () => {
  it("keeps remote and data image sources renderable", () => {
    expect(resolveImageSource("https://example.com/a.png")).toBe(
      "https://example.com/a.png"
    );
    expect(resolveImageSource("data:image/png;base64,abc")).toBe(
      "data:image/png;base64,abc"
    );
  });

  it("uses a pasted image fallback when the HTML image source is not renderable", () => {
    expect(resolveImageSource("blob:https://feishu.example/image", [
      "data:image/png;base64,pasted",
    ])).toBe("data:image/png;base64,pasted");
  });

  it("creates markdown for pasted images", () => {
    expect(createMarkdownImage("data:image/png;base64,abc", "", 1)).toBe(
      "\n![图片1](data:image/png;base64,abc)\n\n"
    );
    expect(createMarkdownImage("https://example.com/a.png", "封面", 2)).toBe(
      "\n![封面](https://example.com/a.png)\n\n"
    );
  });
});
