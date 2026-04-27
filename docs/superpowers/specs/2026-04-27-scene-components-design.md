# Scene Components Design

## Goal

Upgrade the current generic layout components into WeChat article scene components. The feature should make the component menu feel useful even when the visual theme stays the same: selecting text and choosing a component should turn that text into a ready-to-edit article module.

## User Value

The current component menu mainly inserts neutral formatting blocks such as "card" and "tip". That is technically useful, but the user still has to decide how each block should function in an article.

The upgraded menu should speak in publishing scenarios:

- `金句引用`: turn a sentence into a quote-style highlight.
- `核心观点`: turn selected text into a key opinion card.
- `步骤清单`: turn selected lines into numbered steps, or insert a three-step starter.
- `避坑提醒`: turn selected text into a warning/tip block.
- `总结复盘`: insert a compact article summary module.
- `关注引导`: insert a call-to-action module.

This keeps the tool token-free. All behavior is deterministic template insertion and Markdown rendering.

## UX

Keep the existing pink, fresh visual style. Keep the toolbar location so the user does not have to relearn the editor.

Change the mental model of the dropdown:

- The toolbar button remains short, such as `组件`.
- Each menu item uses a scenario label plus a short practical description.
- The descriptions should explain when to use the module, not what markup it inserts.
- If text is selected, the selected text is carried into the most important part of the component.
- After inserting a component, the cursor lands after the inserted block for quick continued writing.

## Component Templates

The templates should favor WeChat article writing language over generic placeholders:

- `金句引用`: Markdown blockquote with selected text as the quote and an editable source line.
- `核心观点`: `:::card` with title `核心观点` and selected text as the body.
- `步骤清单`: plain Markdown numbered list. If the selected text has multiple non-empty lines, each line becomes one step. Otherwise insert three editable steps.
- `避坑提醒`: `:::tip` with title `避坑提醒` and selected text as the body.
- `总结复盘`: `:::card` with title `本文小结` and a three-bullet summary starter. If text is selected, use it as the first bullet.
- `关注引导`: `:::cta` with a practical follow/collect/share prompt. If text is selected, use it as the CTA supporting sentence.

## Rendering

Reuse the existing renderer:

- `:::card`, `:::tip`, and `:::cta` already render as styled blocks.
- Quote and numbered-list components should rely on normal Markdown rendering.
- No new backend, AI call, persistence, or network dependency is needed.

## Testing

Add focused tests for:

- Scene component definitions and labels.
- Selected text flowing into templates.
- Multi-line text becoming a numbered step list.
- Existing layout block rendering remaining stable.
- Toolbar showing the scene labels.

## Out Of Scope

- AI rewriting or automatic semantic classification.
- Multiple visual styles per component.
- Modal configuration before insertion.
- Changing the overall page theme.
