import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EditorToolbar from "./EditorToolbar";

describe("EditorToolbar", () => {
  it("renders the scene component menu trigger and labels", () => {
    const html = renderToStaticMarkup(
      <EditorToolbar
        onInsert={() => undefined}
        onWrap={() => undefined}
        onInsertComponent={() => undefined}
      />
    );

    expect(html).toContain("组件");
    expect(html).toContain("排版组件");
    expect(html).toContain("先选中文字，再点组件；未选择时插入模板");
    expect(html).toContain("金句卡片");
    expect(html).toContain("居中金句");
    expect(html).toContain("侧栏金句");
    expect(html).toContain("核心观点");
    expect(html).toContain("步骤清单");
    expect(html).toContain("避坑提醒");
    expect(html).toContain("总结复盘");
    expect(html).toContain("关注引导");
    expect(html).toContain("overflow-visible");
    expect(html).toContain("right-0 top-full");
  });
});
