import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EditorToolbar from "./EditorToolbar";

describe("EditorToolbar", () => {
  it("renders the layout component menu trigger", () => {
    const html = renderToStaticMarkup(
      <EditorToolbar
        onInsert={() => undefined}
        onWrap={() => undefined}
        onInsertComponent={() => undefined}
      />
    );

    expect(html).toContain("组件");
    expect(html).toContain("排版组件");
  });
});
