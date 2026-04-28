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
        onClearComponent={() => undefined}
        onSetComponentAlign={() => undefined}
      />
    );

    expect(html).toContain("组件");
    expect(html).toContain("排版组件");
    expect(html).toContain("高亮");
    expect(html).toContain("先选中文字，再点组件；未选择时插入模板");
    expect(html).toContain("金句卡片");
    expect(html).toContain("选择一种金句展示样式");
    expect(html).toContain("简约经典");
    expect(html).toContain("对话框");
    expect(html).toContain("柔和椭圆");
    expect(html).toContain("星芒线框");
    expect(html).toContain("横线爱心");
    expect(html).toContain("圆角边框");
    expect(html).toContain("浅色刷痕");
    expect(html).toContain("核心观点");
    expect(html).toContain("步骤清单");
    expect(html).toContain("避坑提醒");
    expect(html).toContain("总结复盘");
    expect(html).toContain("关注引导");
    expect(html).toContain("overflow-visible");
    expect(html).toContain("right-0 top-full");
  });

  it("shows current component actions when the cursor is inside a component", () => {
    const html = renderToStaticMarkup(
      <EditorToolbar
        activeComponent={{ type: "quote-bubble", label: "对话框", align: "right" }}
        onInsert={() => undefined}
        onWrap={() => undefined}
        onInsertComponent={() => undefined}
        onClearComponent={() => undefined}
        onSetComponentAlign={() => undefined}
      />
    );

    expect(html).toContain("当前组件");
    expect(html).toContain("当前：对话框");
    expect(html).toContain("取消组件");
    expect(html).toContain("对齐方式");
    expect(html).toContain("左");
    expect(html).toContain("中");
    expect(html).toContain("右");
    expect(html).toContain("两端");
  });
});
