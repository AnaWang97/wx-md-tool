# Scene Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic layout component menu with WeChat article scene components that turn selected text into ready-to-edit article modules.

**Architecture:** Keep the existing `layout-components` API so `Editor` and `EditorToolbar` keep their current integration points. Update deterministic template generation in `lib/layout-components.ts`, keep insertion behavior in `lib/insert-template.ts`, and reuse the existing Markdown renderer for `:::card`, `:::tip`, `:::cta`, blockquotes, and ordered lists.

**Tech Stack:** Next.js App Router, React, TypeScript, marked, Vitest, ESLint.

---

## File Structure

- Modify `lib/layout-components.ts`: replace generic component ids, labels, descriptions, icons, and templates with scene components.
- Modify `lib/layout-components.test.ts`: verify menu order, selected text insertion, and multi-line step conversion.
- Modify `components/EditorToolbar.test.tsx`: verify the toolbar exposes scene component labels.
- Leave `components/Editor.tsx` unchanged unless tests reveal selection handling broke; it already passes selected text into `createLayoutComponentTemplate` and places the cursor after insertion.
- Leave `lib/markdown.ts` unchanged unless rendering tests fail; existing custom blocks cover card, tip, and CTA.

## Task 1: Scene Component Definitions

**Files:**
- Modify: `lib/layout-components.ts`
- Test: `lib/layout-components.test.ts`

- [ ] **Step 1: Write the failing component order test**

Replace the first test in `lib/layout-components.test.ts` with:

```ts
it("defines the six scene components in menu order", () => {
  expect(layoutComponents.map((item) => item.id)).toEqual([
    "quote-highlight",
    "key-point",
    "step-list",
    "warning-tip",
    "summary-card",
    "follow-cta",
  ]);

  expect(layoutComponents.map((item) => item.label)).toEqual([
    "金句引用",
    "核心观点",
    "步骤清单",
    "避坑提醒",
    "总结复盘",
    "关注引导",
  ]);
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm test lib/layout-components.test.ts`

Expected: FAIL because `layoutComponents.map((item) => item.id)` still returns `section-heading`, `card`, `quote-box`, `tip-box`, `divider`, `cta`.

- [ ] **Step 3: Replace the component ids and definitions**

Update `LayoutComponentId` in `lib/layout-components.ts` to:

```ts
export type LayoutComponentId =
  | "quote-highlight"
  | "key-point"
  | "step-list"
  | "warning-tip"
  | "summary-card"
  | "follow-cta";
```

Replace `layoutComponents` with scene labels and descriptions while keeping `createTemplate` functions in place for Task 2:

```ts
export const layoutComponents: LayoutComponent[] = [
  {
    id: "quote-highlight",
    label: "金句引用",
    description: "突出一句观点或引用",
    icon: "“”",
    createTemplate: (selectedText) =>
      `> ${cleanSelectedText(selectedText) || "这里写一句最想让读者记住的话"}
>
> -- 来源或作者`,
  },
  {
    id: "key-point",
    label: "核心观点",
    description: "包装文章里的关键判断",
    icon: "观",
    createTemplate: (selectedText) => `:::card
### 核心观点
${cleanSelectedText(selectedText) || "这里写这段内容最重要的观点。"}
:::`,
  },
  {
    id: "step-list",
    label: "步骤清单",
    description: "把方法拆成可执行步骤",
    icon: "1",
    createTemplate: (selectedText) => createStepListTemplate(selectedText),
  },
  {
    id: "warning-tip",
    label: "避坑提醒",
    description: "提醒读者注意风险",
    icon: "!",
    createTemplate: (selectedText) => `:::tip
避坑提醒

${cleanSelectedText(selectedText) || "这里写容易忽略的注意事项。"}
:::`,
  },
  {
    id: "summary-card",
    label: "总结复盘",
    description: "收束文章重点",
    icon: "结",
    createTemplate: (selectedText) => createSummaryTemplate(selectedText),
  },
  {
    id: "follow-cta",
    label: "关注引导",
    description: "引导收藏、关注或行动",
    icon: "↗",
    createTemplate: (selectedText) => `:::cta
觉得有用就收藏起来

${cleanSelectedText(selectedText) || "下次需要写同类内容时，可以直接回来套用这套结构。"}

[关注我，继续看更多实用内容](#)
:::`,
  },
];
```

- [ ] **Step 4: Run the targeted test to verify the menu order passes**

Run: `pnpm test lib/layout-components.test.ts`

Expected: the order test passes, while template-specific tests may still fail because they reference old ids.

## Task 2: Scene Template Behavior

**Files:**
- Modify: `lib/layout-components.ts`
- Modify: `lib/layout-components.test.ts`

- [ ] **Step 1: Add selected-text and step-list tests**

Replace the old card-template test in `lib/layout-components.test.ts` with:

```ts
it("creates a key point card with selected text as body content", () => {
  const template = createLayoutComponentTemplate("key-point", "这里是选中的重点内容");

  expect(template).toContain(":::card");
  expect(template).toContain("### 核心观点");
  expect(template).toContain("这里是选中的重点内容");
  expect(template).toContain(":::");
});

it("turns selected lines into a numbered step list", () => {
  const template = createLayoutComponentTemplate(
    "step-list",
    "确定主题\n整理素材\n发布文章"
  );

  expect(template).toBe("1. 确定主题\n2. 整理素材\n3. 发布文章");
});

it("uses selected text as the first summary bullet", () => {
  const template = createLayoutComponentTemplate("summary-card", "先让读者扫得懂");

  expect(template).toContain(":::card");
  expect(template).toContain("### 本文小结");
  expect(template).toContain("- 先让读者扫得懂");
  expect(template).toContain("- 可以继续补充第二个重点");
  expect(template).toContain("- 最后写一个可执行的行动建议");
});
```

Update the readable-default test ids to:

```ts
const ids: LayoutComponentId[] = [
  "quote-highlight",
  "key-point",
  "step-list",
  "warning-tip",
  "summary-card",
  "follow-cta",
];
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm test lib/layout-components.test.ts`

Expected: FAIL until `createStepListTemplate` and `createSummaryTemplate` exist.

- [ ] **Step 3: Add helper functions**

Add these helpers before `layoutComponents` in `lib/layout-components.ts`:

```ts
const splitSelectedLines = (selectedText?: string) =>
  cleanSelectedText(selectedText)
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""))
    .filter(Boolean);

const createStepListTemplate = (selectedText?: string) => {
  const lines = splitSelectedLines(selectedText);
  const steps =
    lines.length > 0
      ? lines
      : ["第一步：写清楚要做什么", "第二步：补充关键细节", "第三步：给出行动建议"];

  return steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
};

const createSummaryTemplate = (selectedText?: string) => {
  const firstBullet = cleanSelectedText(selectedText) || "这里写本文最重要的结论";

  return `:::card
### 本文小结
- ${firstBullet}
- 可以继续补充第二个重点
- 最后写一个可执行的行动建议
:::`;
};
```

- [ ] **Step 4: Run the targeted test to verify it passes**

Run: `pnpm test lib/layout-components.test.ts`

Expected: PASS with all layout component tests green.

## Task 3: Toolbar Test Coverage

**Files:**
- Modify: `components/EditorToolbar.test.tsx`

- [ ] **Step 1: Add scene label assertions**

Update the toolbar test to:

```tsx
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
  expect(html).toContain("金句引用");
  expect(html).toContain("核心观点");
  expect(html).toContain("步骤清单");
  expect(html).toContain("避坑提醒");
  expect(html).toContain("总结复盘");
  expect(html).toContain("关注引导");
});
```

- [ ] **Step 2: Run the targeted test**

Run: `pnpm test components/EditorToolbar.test.tsx`

Expected: PASS after Task 1 updates `layoutComponents`.

## Task 4: Full Verification

**Files:**
- No source edits unless verification reveals a defect.

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`

Expected: PASS with all test files and tests green.

- [ ] **Step 2: Run lint**

Run: `pnpm lint`

Expected: PASS with ESLint exit code 0.

- [ ] **Step 3: Run production build**

Run: `pnpm build`

Expected: PASS. If the sandbox blocks port or process creation, rerun with escalated permissions.

- [ ] **Step 4: Browser smoke test**

Open `http://127.0.0.1:3000`, click `组件`, and confirm these labels appear: `金句引用`, `核心观点`, `步骤清单`, `避坑提醒`, `总结复盘`, `关注引导`.

Insert a selected multi-line paragraph as `步骤清单` and confirm the editor receives a numbered list. Insert selected text as `核心观点` and confirm the preview renders a styled card.

## Self-Review

- Spec coverage: every scene component in the approved spec is covered by Task 1 and Task 2. Toolbar discoverability is covered by Task 3. Verification is covered by Task 4.
- Placeholder scan: the plan contains concrete ids, labels, helper functions, test assertions, and commands.
- Type consistency: all references use `LayoutComponentId`, `layoutComponents`, and `createLayoutComponentTemplate`, matching the existing API.
