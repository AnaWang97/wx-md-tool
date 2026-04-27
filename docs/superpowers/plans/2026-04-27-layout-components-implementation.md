# Layout Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight `组件` menu that inserts six themed layout component templates into the Markdown editor and renders custom card, tip, and CTA blocks in the WeChat-compatible preview.

**Architecture:** Keep the current textarea editor and `marked` rendering pipeline. Add focused pure modules for component templates and block insertion, then wire them into `Editor.tsx`, `EditorToolbar.tsx`, and `lib/markdown.ts`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, marked, highlight.js, Vitest for focused pure-function tests.

---

## Scope Check

The design covers one feature area: reusable article layout components. It does not require a separate subsystem split because each task builds toward one shippable workflow: insert template, preview themed output, copy inline HTML.

## File Map

- Create `lib/layout-components.ts`: component ids, labels, descriptions, icons as text labels, and template factory functions.
- Create `lib/insert-template.ts`: pure helper for replacing the current selection with a block template while adding clean blank lines.
- Create `lib/layout-components.test.ts`: tests for component definitions and selected-text behavior.
- Create `lib/insert-template.test.ts`: tests for block insertion spacing and cursor placement.
- Create `lib/markdown-layout-components.test.ts`: tests for card, tip, CTA, theme color, and malformed-block behavior.
- Modify `package.json`: add `test` script and Vitest dev dependency.
- Modify `components/Editor.tsx`: add `handleInsertComponent`, read selected text, generate the template, and insert it through the pure helper.
- Modify `components/EditorToolbar.tsx`: add a compact `组件` dropdown that calls `onInsertComponent`.
- Modify `lib/markdown.ts`: render `:::card`, `:::tip`, and `:::cta` blocks before normal Markdown rendering.

## Task 1: Add Vitest Harness

**Files:**
- Modify: `package.json`
- Create: `lib/markdown.test.ts`

- [ ] **Step 1: Install Vitest**

Run:

```bash
pnpm add -D vitest
```

Expected: `package.json` and `pnpm-lock.yaml` update with `vitest`.

- [ ] **Step 2: Add the test script**

Modify `package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Add a baseline Markdown rendering test**

Create `lib/markdown.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseMarkdown } from "./markdown";
import { themes } from "./themes";

describe("parseMarkdown", () => {
  it("renders existing headings and paragraphs with inline styles", () => {
    const html = parseMarkdown("## 小标题\n\n正文内容", themes[0]);

    expect(html).toContain("<section");
    expect(html).toContain("<h2");
    expect(html).toContain("小标题");
    expect(html).toContain("<p");
    expect(html).toContain("正文内容");
  });
});
```

- [ ] **Step 4: Run the baseline test**

Run:

```bash
pnpm test -- lib/markdown.test.ts
```

Expected: PASS with 1 test passing.

- [ ] **Step 5: Commit test harness**

```bash
git add package.json pnpm-lock.yaml lib/markdown.test.ts
git commit -m "test: add markdown test harness"
```

## Task 2: Add Layout Component Templates

**Files:**
- Create: `lib/layout-components.test.ts`
- Create: `lib/layout-components.ts`

- [ ] **Step 1: Write failing template tests**

Create `lib/layout-components.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  createLayoutComponentTemplate,
  layoutComponents,
  type LayoutComponentId,
} from "./layout-components";

describe("layoutComponents", () => {
  it("defines the six first-version components in menu order", () => {
    expect(layoutComponents.map((item) => item.id)).toEqual([
      "section-heading",
      "card",
      "quote-box",
      "tip-box",
      "divider",
      "cta",
    ]);
  });

  it("creates a card template with selected text as body content", () => {
    const template = createLayoutComponentTemplate("card", "这里是选中的重点内容");

    expect(template).toContain(":::card");
    expect(template).toContain("### 卡片标题");
    expect(template).toContain("这里是选中的重点内容");
    expect(template).toContain(":::");
  });

  it("creates readable default templates for every component", () => {
    const ids: LayoutComponentId[] = [
      "section-heading",
      "card",
      "quote-box",
      "tip-box",
      "divider",
      "cta",
    ];

    for (const id of ids) {
      expect(createLayoutComponentTemplate(id)).toMatch(/\S/);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
pnpm test -- lib/layout-components.test.ts
```

Expected: FAIL because `lib/layout-components.ts` does not exist.

- [ ] **Step 3: Implement component definitions**

Create `lib/layout-components.ts`:

```ts
export type LayoutComponentId =
  | "section-heading"
  | "card"
  | "quote-box"
  | "tip-box"
  | "divider"
  | "cta";

export interface LayoutComponent {
  id: LayoutComponentId;
  label: string;
  description: string;
  icon: string;
  createTemplate: (selectedText?: string) => string;
}

const cleanSelectedText = (selectedText?: string) => selectedText?.trim() || "";

export const layoutComponents: LayoutComponent[] = [
  {
    id: "section-heading",
    label: "小标题",
    description: "插入二级标题",
    icon: "H2",
    createTemplate: (selectedText) => `## ${cleanSelectedText(selectedText) || "小标题"}`,
  },
  {
    id: "card",
    label: "卡片",
    description: "重点内容或小结",
    icon: "▣",
    createTemplate: (selectedText) => `:::card
### 卡片标题
${cleanSelectedText(selectedText) || "卡片正文内容，适合放重点、步骤或小结。"}
:::`,
  },
  {
    id: "quote-box",
    label: "引用框",
    description: "金句或引用来源",
    icon: "❝",
    createTemplate: (selectedText) => `> ${cleanSelectedText(selectedText) || "金句或引用内容"}
>
> -- 引用来源`,
  },
  {
    id: "tip-box",
    label: "提示框",
    description: "提示、注意事项",
    icon: "!",
    createTemplate: (selectedText) => `:::tip
提示标题

${cleanSelectedText(selectedText) || "这里填写提示内容。"}
:::`,
  },
  {
    id: "divider",
    label: "分割线",
    description: "分隔文章段落",
    icon: "—",
    createTemplate: () => "---",
  },
  {
    id: "cta",
    label: "CTA",
    description: "行动引导按钮",
    icon: "↗",
    createTemplate: (selectedText) => `:::cta
行动标题

${cleanSelectedText(selectedText) || "这里填写引导文字。"}

[按钮文案](https://example.com)
:::`,
  },
];

export function createLayoutComponentTemplate(
  id: LayoutComponentId,
  selectedText?: string
): string {
  const component = layoutComponents.find((item) => item.id === id);
  if (!component) {
    throw new Error(`Unknown layout component: ${id}`);
  }
  return component.createTemplate(selectedText);
}
```

- [ ] **Step 4: Run template tests**

Run:

```bash
pnpm test -- lib/layout-components.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit templates**

```bash
git add lib/layout-components.ts lib/layout-components.test.ts
git commit -m "feat: add layout component templates"
```

## Task 3: Add Block Insertion Helper

**Files:**
- Create: `lib/insert-template.test.ts`
- Create: `lib/insert-template.ts`

- [ ] **Step 1: Write failing insertion tests**

Create `lib/insert-template.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
pnpm test -- lib/insert-template.test.ts
```

Expected: FAIL because `lib/insert-template.ts` does not exist.

- [ ] **Step 3: Implement insertion helper**

Create `lib/insert-template.ts`:

```ts
export interface InsertBlockTemplateResult {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

function getPrefix(before: string): string {
  if (before.length === 0) return "";
  if (before.endsWith("\n\n")) return "";
  if (before.endsWith("\n")) return "\n";
  return "\n\n";
}

function getSuffix(after: string): string {
  if (after.length === 0) return "";
  if (after.startsWith("\n\n")) return "";
  if (after.startsWith("\n")) return "\n";
  return "\n\n";
}

export function insertBlockTemplate(
  value: string,
  start: number,
  end: number,
  template: string
): InsertBlockTemplateResult {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const trimmedTemplate = template.trim();
  const prefix = getPrefix(before);
  const suffix = getSuffix(after);
  const insertion = `${prefix}${trimmedTemplate}${suffix}`;
  const selectionStart = before.length + prefix.length;
  const selectionEnd = selectionStart + trimmedTemplate.length;

  return {
    value: `${before}${insertion}${after}`,
    selectionStart,
    selectionEnd,
  };
}
```

- [ ] **Step 4: Run insertion tests**

Run:

```bash
pnpm test -- lib/insert-template.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit insertion helper**

```bash
git add lib/insert-template.ts lib/insert-template.test.ts
git commit -m "feat: add block template insertion helper"
```

## Task 4: Render Layout Blocks In Markdown

**Files:**
- Create: `lib/markdown-layout-components.test.ts`
- Modify: `lib/markdown.ts`

- [ ] **Step 1: Write failing Markdown rendering tests**

Create `lib/markdown-layout-components.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseMarkdown } from "./markdown";
import { themes } from "./themes";

describe("layout component Markdown blocks", () => {
  it("renders card blocks with themed inline styles", () => {
    const html = parseMarkdown(":::card\n### 卡片标题\n卡片内容\n:::", themes[0]);

    expect(html).toContain('data-layout-component="card"');
    expect(html).toContain("卡片标题");
    expect(html).toContain("卡片内容");
    expect(html).toContain(themes[0].preview);
  });

  it("renders tip blocks with a light themed background", () => {
    const html = parseMarkdown(":::tip\n提示标题\n\n提示内容\n:::", themes[0]);

    expect(html).toContain('data-layout-component="tip"');
    expect(html).toContain("提示标题");
    expect(html).toContain("提示内容");
    expect(html).toContain("rgba(7, 193, 96, 0.1)");
  });

  it("renders CTA blocks with a button when a Markdown link exists", () => {
    const html = parseMarkdown(
      ":::cta\n行动标题\n\n欢迎继续阅读。\n\n[了解更多](https://example.com)\n:::",
      themes[0]
    );

    expect(html).toContain('data-layout-component="cta"');
    expect(html).toContain("行动标题");
    expect(html).toContain("欢迎继续阅读。");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain("了解更多");
  });

  it("leaves malformed blocks readable instead of crashing", () => {
    const html = parseMarkdown(":::card\n没有闭合的卡片", themes[0]);

    expect(html).toContain("没有闭合的卡片");
    expect(html).toContain("<section");
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
pnpm test -- lib/markdown-layout-components.test.ts
```

Expected: FAIL because custom blocks render as plain paragraphs.

- [ ] **Step 3: Add color and inner-render helpers in `lib/markdown.ts`**

Add these helpers above `parseMarkdown`:

```ts
function getPrimaryColor(theme: Theme, customStyles?: CustomStyles): string {
  return customStyles?.primaryColor || theme.preview;
}

function colorToRgba(color: string, alpha: number): string {
  if (!color.startsWith("#")) return color;
  const hex = color.slice(1);
  const fullHex = hex.length === 3
    ? hex.split("").map((char) => char + char).join("")
    : hex;
  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function stripOuterParagraph(html: string): string {
  return html.trim().replace(/^<p([^>]*)>([\s\S]*)<\/p>$/i, "<span$1>$2</span>");
}
```

- [ ] **Step 4: Add layout block renderer in `lib/markdown.ts`**

Add this helper below the color helpers:

```ts
function renderLayoutComponentBlocks(
  markdown: string,
  theme: Theme,
  customStyles?: CustomStyles
): string {
  const primaryColor = getPrimaryColor(theme, customStyles);
  const lightColor = colorToRgba(primaryColor, 0.1);

  return markdown.replace(
    /^:::(card|tip|cta)[ \t]*\n([\s\S]*?)\n:::[ \t]*$/gm,
    (_match, type: "card" | "tip" | "cta", body: string) => {
      const trimmedBody = body.trim();

      if (type === "card") {
        const innerHtml = marked.parse(trimmedBody) as string;
        const style = `margin: 22px 0; padding: 18px 20px; border: 1px solid ${primaryColor}; border-left: 5px solid ${primaryColor}; border-radius: 10px; background: #fff; box-shadow: 0 4px 14px ${colorToRgba(primaryColor, 0.12)};`;
        return `<section data-layout-component="card" style="${style}">${innerHtml}</section>`;
      }

      if (type === "tip") {
        const lines = trimmedBody.split(/\n+/);
        const title = lines.shift()?.trim() || "提示";
        const content = lines.join("\n").trim();
        const titleStyle = `margin: 0 0 8px; font-weight: 700; color: ${primaryColor};`;
        const boxStyle = `margin: 22px 0; padding: 16px 18px; border-radius: 10px; background: ${lightColor}; border: 1px solid ${colorToRgba(primaryColor, 0.25)};`;
        const contentHtml = content ? marked.parse(content) as string : "";
        return `<section data-layout-component="tip" style="${boxStyle}"><p style="${titleStyle}">${title}</p>${contentHtml}</section>`;
      }

      const linkMatch = trimmedBody.match(/\[([^\]]+)\]\(([^)]+)\)/);
      const linkLabel = linkMatch?.[1];
      const linkHref = linkMatch?.[2];
      const bodyWithoutLink = linkMatch
        ? trimmedBody.replace(linkMatch[0], "").trim()
        : trimmedBody;
      const lines = bodyWithoutLink.split(/\n+/);
      const title = lines.shift()?.trim() || "行动标题";
      const content = lines.join("\n").trim();
      const sectionStyle = `margin: 26px 0; padding: 20px; text-align: center; border-radius: 12px; background: ${lightColor}; border: 1px solid ${colorToRgba(primaryColor, 0.25)};`;
      const titleStyle = `margin: 0 0 10px; font-size: 18px; font-weight: 700; color: ${primaryColor};`;
      const contentHtml = content ? stripOuterParagraph(marked.parse(content) as string) : "";
      const buttonHtml = linkLabel && linkHref
        ? `<p style="margin: 16px 0 0;"><a href="${linkHref}" style="display: inline-block; padding: 8px 18px; border-radius: 999px; background: ${primaryColor}; color: #fff; text-decoration: none; font-weight: 600;">${linkLabel}</a></p>`
        : "";
      return `<section data-layout-component="cta" style="${sectionStyle}"><p style="${titleStyle}">${title}</p>${contentHtml}${buttonHtml}</section>`;
    }
  );
}
```

- [ ] **Step 5: Call the renderer inside `parseMarkdown`**

Change this section:

```ts
const processedMarkdown = preprocessMarkdown(markdown);
const rawHtml = marked.parse(processedMarkdown) as string;
```

to:

```ts
const processedMarkdown = preprocessMarkdown(markdown);
const markdownWithLayoutComponents = renderLayoutComponentBlocks(
  processedMarkdown,
  theme,
  customStyles
);
const rawHtml = marked.parse(markdownWithLayoutComponents) as string;
```

- [ ] **Step 6: Run Markdown component tests**

Run:

```bash
pnpm test -- lib/markdown-layout-components.test.ts
```

Expected: PASS.

- [ ] **Step 7: Run all tests**

Run:

```bash
pnpm test
```

Expected: PASS for all test files.

- [ ] **Step 8: Commit Markdown rendering**

```bash
git add lib/markdown.ts lib/markdown-layout-components.test.ts
git commit -m "feat: render themed layout component blocks"
```

## Task 5: Wire Component Insertion Into The Editor

**Files:**
- Modify: `components/Editor.tsx`
- Modify: `components/EditorToolbar.tsx`

- [ ] **Step 1: Update `EditorToolbar` props**

In `components/EditorToolbar.tsx`, add imports:

```ts
import { useEffect, useRef, useState } from "react";
import { layoutComponents, type LayoutComponentId } from "@/lib/layout-components";
```

Change props to:

```ts
interface ToolbarProps {
  onInsert: (before: string, after?: string, defaultText?: string) => void;
  onWrap: (prefix: string, suffix: string, defaultText?: string) => void;
  onInsertComponent: (id: LayoutComponentId) => void;
}
```

Change the function signature to:

```ts
export default function EditorToolbar({
  onInsert,
  onWrap,
  onInsertComponent,
}: ToolbarProps) {
```

- [ ] **Step 2: Add dropdown state in `EditorToolbar`**

Inside `EditorToolbar`, before `tools`, add:

```ts
const [isComponentMenuOpen, setIsComponentMenuOpen] = useState(false);
const componentMenuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!isComponentMenuOpen) return;

  const handleClickOutside = (event: MouseEvent) => {
    if (
      componentMenuRef.current &&
      !componentMenuRef.current.contains(event.target as Node)
    ) {
      setIsComponentMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [isComponentMenuOpen]);
```

- [ ] **Step 3: Render the `组件` menu after the existing buttons**

In the toolbar JSX, after the existing `tools.map(...)`, add:

```tsx
<div className="w-px h-4 bg-pink-200 mx-1" />
<div ref={componentMenuRef} className="relative flex items-center">
  <button
    onClick={() => setIsComponentMenuOpen((open) => !open)}
    title="排版组件"
    className="px-2.5 h-7 rounded-lg hover:bg-pink-100 text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 text-xs font-medium"
  >
    组件
    <span className={`transition-transform ${isComponentMenuOpen ? "rotate-180" : ""}`}>
      ▾
    </span>
  </button>

  {isComponentMenuOpen && (
    <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border-2 border-pink-100 z-[60] overflow-hidden">
      {layoutComponents.map((component) => (
        <button
          key={component.id}
          onClick={() => {
            onInsertComponent(component.id);
            setIsComponentMenuOpen(false);
          }}
          className="w-full px-3 py-2.5 text-left hover:bg-pink-50 flex items-center gap-3 transition-colors"
        >
          <span className="w-7 h-7 rounded-lg bg-pink-50 text-purple-500 flex items-center justify-center text-xs font-bold">
            {component.icon}
          </span>
          <span className="min-w-0">
            <span className="block text-sm text-purple-700 font-medium">
              {component.label}
            </span>
            <span className="block text-xs text-pink-400 truncate">
              {component.description}
            </span>
          </span>
        </button>
      ))}
    </div>
  )}
</div>
```

- [ ] **Step 4: Add imports in `Editor.tsx`**

Add:

```ts
import {
  createLayoutComponentTemplate,
  type LayoutComponentId,
} from "@/lib/layout-components";
import { insertBlockTemplate } from "@/lib/insert-template";
```

- [ ] **Step 5: Add `handleInsertComponent` in `Editor.tsx`**

Add this callback near `handleInsert` and `handleWrap`:

```ts
const handleInsertComponent = useCallback(
  (id: LayoutComponentId) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const template = createLayoutComponentTemplate(id, selectedText);
    const result = insertBlockTemplate(value, start, end, template);

    onChange(result.value);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
    }, 0);
  },
  [value, onChange]
);
```

- [ ] **Step 6: Pass the new prop to `EditorToolbar`**

Change:

```tsx
<EditorToolbar onInsert={handleInsert} onWrap={handleWrap} />
```

to:

```tsx
<EditorToolbar
  onInsert={handleInsert}
  onWrap={handleWrap}
  onInsertComponent={handleInsertComponent}
/>
```

- [ ] **Step 7: Run type and lint checks**

Run:

```bash
pnpm lint
```

Expected: PASS.

Run:

```bash
pnpm test
```

Expected: PASS.

- [ ] **Step 8: Commit toolbar wiring**

```bash
git add components/Editor.tsx components/EditorToolbar.tsx
git commit -m "feat: add layout component toolbar menu"
```

## Task 6: Build And Browser Verification

**Files:**
- Modify only if verification reveals a defect in files changed by Tasks 1-5.

- [ ] **Step 1: Run all automated checks**

Run:

```bash
pnpm lint
pnpm test
pnpm build
```

Expected: all commands exit 0.

- [ ] **Step 2: Start the local app**

Run:

```bash
pnpm dev --hostname 127.0.0.1 --port 3000
```

Expected: Next.js serves `http://127.0.0.1:3000`.

- [ ] **Step 3: Verify component menu manually**

In the browser:

1. Open `http://127.0.0.1:3000`.
2. Enter the editor view.
3. Click `组件`.
4. Confirm the menu shows 小标题、卡片、引用框、提示框、分割线、CTA.
5. Insert each component and confirm the Markdown template appears in the editor.

Expected: every component inserts at the cursor without replacing unrelated content.

- [ ] **Step 4: Verify preview and theme behavior manually**

In the browser:

1. Insert 卡片、提示框、CTA.
2. Confirm each renders as a styled block in the right preview.
3. Switch from 微信绿 to another theme.
4. Confirm component accent colors change.
5. Turn on 自定义 and choose a custom color.
6. Confirm component accent colors follow the custom color.

Expected: component colors follow the active article color source.

- [ ] **Step 5: Verify copy output manually**

In the browser:

1. Click `复制内容`.
2. Paste into a plain text scratch area or inspect clipboard HTML if available.
3. Confirm component output includes `data-layout-component` and inline `style` attributes.

Expected: copied HTML includes styled card, tip, and CTA sections.

- [ ] **Step 6: Commit verification fixes if any were needed**

If verification required code changes:

```bash
git add components/Editor.tsx components/EditorToolbar.tsx lib/markdown.ts lib/*.test.ts
git commit -m "fix: polish layout component behavior"
```

If no changes were needed, do not create an empty commit.

## Task 7: Final Review

**Files:**
- Review: all files changed in previous tasks.

- [ ] **Step 1: Inspect final diff**

Run:

```bash
git status --short --branch
git log --oneline --decorate -6
git diff main...HEAD --stat
```

Expected: changes are limited to tests, component template helpers, insertion helper, toolbar/editor wiring, Markdown rendering, and the previously committed docs.

- [ ] **Step 2: Re-run final checks**

Run:

```bash
pnpm lint
pnpm test
pnpm build
```

Expected: all commands exit 0.

- [ ] **Step 3: Prepare final implementation summary**

Summarize:

- components added to the toolbar menu
- new Markdown syntaxes supported
- test/build commands run
- any remaining risks, especially WeChat paste behavior that still requires a real公众号后台 check

Expected: user receives a concise handoff with verification evidence.
