import { describe, expect, it } from "vitest";
import { getRestoredTextareaScrollTop } from "./editor-scroll";

describe("editor scroll restoration", () => {
  it("keeps the previous scroll position after an edit", () => {
    expect(
      getRestoredTextareaScrollTop({
        previousScrollTop: 860,
        scrollHeight: 2400,
        clientHeight: 500,
      })
    ).toBe(860);
  });

  it("clamps the restored position when the edited document becomes shorter", () => {
    expect(
      getRestoredTextareaScrollTop({
        previousScrollTop: 860,
        scrollHeight: 900,
        clientHeight: 500,
      })
    ).toBe(400);
  });
});
