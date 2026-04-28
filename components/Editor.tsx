"use client";

import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import {
  createMarkdownImage,
  htmlToMarkdown,
  hasHtmlContent,
  getHtmlFromClipboard,
} from "@/lib/html-to-markdown";
import {
  getClipboardImageFiles,
  readImageFilesAsDataUrls,
} from "@/lib/clipboard-images";
import { getRestoredTextareaScrollTop } from "@/lib/editor-scroll";
import { toggleTextAffix } from "@/lib/markdown-formatting";
import {
  type LayoutComponentId,
} from "@/lib/layout-components";
import {
  createAlignmentBlockEdit,
  createLayoutComponentEdit,
  findLayoutComponentBlockAtCursor,
  getLayoutComponentBlockLabel,
  isQuoteBlockType,
  setLayoutComponentBlockAlign,
  unwrapLayoutComponentBlock,
  type LayoutComponentAlign,
} from "@/lib/layout-component-block";
import EditorToolbar from "./EditorToolbar";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (scrollRatio: number) => void;
  scrollRatio?: number;
  isScrollSource?: boolean;
  renderFileButton?: () => React.ReactNode;
  onClear?: () => void;
}

export default function Editor({
  value,
  onChange,
  onScroll,
  scrollRatio,
  isScrollSource,
  renderFileButton,
  onClear,
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInternalScroll = useRef(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const activeComponent = useMemo(() => {
    const block = findLayoutComponentBlockAtCursor(value, cursorPosition);

    return block
      ? {
          type: block.type,
          label: getLayoutComponentBlockLabel(block.type),
          align: block.align,
        }
      : null;
  }, [value, cursorPosition]);

  const updateCursorPosition = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    setCursorPosition(textarea.selectionStart);
  }, []);

  const restoreTextareaAfterEdit = useCallback(
    (
      selectionStart: number,
      selectionEnd: number,
      previousScrollTop: number
    ) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
      textarea.scrollTop = getRestoredTextareaScrollTop({
        previousScrollTop,
        scrollHeight: textarea.scrollHeight,
        clientHeight: textarea.clientHeight,
      });
      setCursorPosition(selectionStart);
    },
    []
  );

  // 处理粘贴事件 - 智能识别富文本
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const clipboardData = e.clipboardData;
      const imageFiles = getClipboardImageFiles(clipboardData);
      const hasRichHtml = hasHtmlContent(clipboardData);
      const html = hasRichHtml ? getHtmlFromClipboard(clipboardData) : "";
      const shouldConvertHtml =
        html &&
        /<(p|div|h[1-6]|strong|b|em|i|ul|ol|li|img|table|blockquote|pre|code)\b/i.test(
          html
        );

      // 检查是否有 HTML 内容（来自飞书等富文本编辑器）
      if (!shouldConvertHtml && imageFiles.length === 0) {
        return;
      }

      e.preventDefault();

      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? value.length;
      const end = textarea?.selectionEnd ?? value.length;
      let imageDataUrls: string[] = [];
      if (imageFiles.length > 0) {
        try {
          imageDataUrls = await readImageFilesAsDataUrls(imageFiles);
        } catch {
          imageDataUrls = [];
        }
      }

      const { markdown } = shouldConvertHtml
        ? htmlToMarkdown(html, { fallbackImageSources: imageDataUrls })
        : {
            markdown: imageDataUrls
              .map((src, index) => createMarkdownImage(src, "", index + 1))
              .join(""),
          };

      // 获取当前光标位置
      if (textarea) {
        const newValue =
          value.substring(0, start) + markdown + value.substring(end);
        onChange(newValue);

        // 设置光标位置到粘贴内容之后
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + markdown.length;
          textarea.focus();
        }, 0);
      } else {
        onChange(value + markdown);
      }
    },
    [value, onChange]
  );

  // 处理滚动事件
  const handleScroll = () => {
    if (isInternalScroll.current) {
      isInternalScroll.current = false;
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea || !onScroll) return;

    const { scrollTop, scrollHeight, clientHeight } = textarea;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      const ratio = scrollTop / maxScroll;
      onScroll(ratio);
    }
  };

  // 同步滚动位置 - 使用原生 DOM 操作避免 React 渲染循环
  useEffect(() => {
    if (isScrollSource || scrollRatio === undefined) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const { scrollHeight, clientHeight } = textarea;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) return;

    const targetScrollTop = Math.round(scrollRatio * maxScroll);

    // 只在确实需要移动时才设置标志
    if (Math.abs(textarea.scrollTop - targetScrollTop) > 1) {
      isInternalScroll.current = true;
      textarea.scrollTop = targetScrollTop;
      // 立即重置标志，让后续的用户滚动可以正常触发
      requestAnimationFrame(() => {
        isInternalScroll.current = false;
      });
    }
  }, [scrollRatio, isScrollSource]);

  // 工具栏：插入文本
  const handleInsert = useCallback(
    (before: string, after: string = "", defaultText: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const previousScrollTop = textarea.scrollTop;
      const selectedText = value.substring(start, end) || defaultText;

      // 检查是否在行首，如果不是则添加换行
      const needNewLine = before.startsWith("#") || before.startsWith("-") || before.startsWith("1.") || before.startsWith(">") || before.startsWith("```") || before.startsWith("|") || before.startsWith("\n");
      const prefix = needNewLine && start > 0 && value[start - 1] !== "\n" ? "\n" : "";
      const isToggleableFormat = defaultText.length > 0 && !before.startsWith("|");

      if (isToggleableFormat) {
        const result = toggleTextAffix({
          value,
          start,
          end,
          prefix: before,
          suffix: after,
          defaultText,
          leadingPrefix: prefix,
        });

        onChange(result.value);

        setTimeout(() => {
          restoreTextareaAfterEdit(
            result.selectionStart,
            result.selectionEnd,
            previousScrollTop
          );
        }, 0);
        return;
      }

      const newValue =
        value.substring(0, start) +
        prefix +
        before +
        selectedText +
        after +
        value.substring(end);

      onChange(newValue);

      // 设置光标位置
      setTimeout(() => {
        const newCursorPos = start + prefix.length + before.length + selectedText.length;
        restoreTextareaAfterEdit(newCursorPos, newCursorPos, previousScrollTop);
      }, 0);
    },
    [value, onChange, restoreTextareaAfterEdit]
  );

  // 工具栏：包裹选中文本
  const handleWrap = useCallback(
    (prefix: string, suffix: string, defaultText: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const previousScrollTop = textarea.scrollTop;
      const result = toggleTextAffix({
        value,
        start,
        end,
        prefix,
        suffix,
        defaultText,
      });

      onChange(result.value);

      // 选中插入的文本
      setTimeout(() => {
        restoreTextareaAfterEdit(
          result.selectionStart,
          result.selectionEnd,
          previousScrollTop
        );
      }, 0);
    },
    [value, onChange, restoreTextareaAfterEdit]
  );

  const handleInsertComponent = useCallback(
    (id: LayoutComponentId) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const previousScrollTop = textarea.scrollTop;
      const result = createLayoutComponentEdit(value, start, end, id);

      onChange(result.value);

      setTimeout(() => {
        restoreTextareaAfterEdit(
          result.selectionEnd,
          result.selectionEnd,
          previousScrollTop
        );
      }, 0);
    },
    [value, onChange, restoreTextareaAfterEdit]
  );

  const handleClearComponent = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const previousScrollTop = textarea.scrollTop;
    const result = unwrapLayoutComponentBlock(value, textarea.selectionStart);
    if (!result) return;

    onChange(result.value);

    setTimeout(() => {
      restoreTextareaAfterEdit(
        result.selectionStart,
        result.selectionEnd,
        previousScrollTop
      );
    }, 0);
  }, [value, onChange, restoreTextareaAfterEdit]);

  const handleSetComponentAlign = useCallback(
    (align: LayoutComponentAlign) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const previousScrollTop = textarea.scrollTop;
      const result = setLayoutComponentBlockAlign(
        value,
        textarea.selectionStart,
        align
      );
      if (!result) return;

      onChange(result.value);

      setTimeout(() => {
        restoreTextareaAfterEdit(
          result.selectionStart,
          result.selectionEnd,
          previousScrollTop
        );
      }, 0);
    },
    [value, onChange, restoreTextareaAfterEdit]
  );

  const handleSetTextAlign = useCallback(
    (align: LayoutComponentAlign) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const previousScrollTop = textarea.scrollTop;
      const activeBlock = findLayoutComponentBlockAtCursor(value, start);
      const result =
        activeBlock && isQuoteBlockType(activeBlock.type)
          ? setLayoutComponentBlockAlign(value, start, align)
          : createAlignmentBlockEdit(value, start, end, align);

      if (!result) return;

      onChange(result.value);

      setTimeout(() => {
        restoreTextareaAfterEdit(
          result.selectionStart,
          result.selectionEnd,
          previousScrollTop
        );
      }, 0);
    },
    [value, onChange, restoreTextareaAfterEdit]
  );

  // 快捷键处理
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey) {
        switch (e.key.toLowerCase()) {
          case 'b': // 加粗
            e.preventDefault();
            handleWrap('**', '**', '粗体文本');
            break;
          case 'i': // 斜体
            e.preventDefault();
            handleWrap('*', '*', '斜体文本');
            break;
          case 'k': // 链接
            e.preventDefault();
            handleWrap('[', '](url)', '链接文本');
            break;
          case 'd': // 删除线
            e.preventDefault();
            handleWrap('~~', '~~', '删除文本');
            break;
          case 'e': // 行内代码
            e.preventDefault();
            handleWrap('`', '`', 'code');
            break;
          case 'h': // 高亮
            e.preventDefault();
            handleWrap('==', '==', '高亮文本');
            break;
        }
      }
    },
    [handleWrap]
  );

  return (
    <div className="h-full flex flex-col bg-white/60">
      <div className="flex items-center justify-between px-4 py-2 border-b border-pink-100 bg-white/80">
        <div className="flex items-center gap-2">
          <span className="text-sm text-purple-500 font-medium flex items-center gap-1">
            <span>📝</span>
            Markdown
          </span>
          <span className="text-xs text-pink-400 hidden sm:inline">
            支持从飞书粘贴
          </span>
          {renderFileButton && renderFileButton()}
          {onClear && (
            <button
              onClick={onClear}
              className="text-xs text-pink-400 hover:text-pink-600 hover:bg-pink-50 px-2 py-1 rounded transition-colors"
              title="清空内容"
            >
              清空
            </button>
          )}
        </div>
        <span className="text-xs text-purple-300 bg-purple-50 px-2 py-0.5 rounded-full">{value.length} 字符</span>
      </div>
      <EditorToolbar
        onInsert={handleInsert}
        onWrap={handleWrap}
        onInsertComponent={handleInsertComponent}
        onClearComponent={handleClearComponent}
        onSetComponentAlign={handleSetComponentAlign}
        onSetTextAlign={handleSetTextAlign}
        activeComponent={activeComponent}
      />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        onClick={updateCursorPosition}
        onFocus={updateCursorPosition}
        onKeyUp={updateCursorPosition}
        onSelect={updateCursorPosition}
        className="flex-1 w-full p-4 bg-transparent text-purple-900 font-mono text-base leading-relaxed resize-none focus:outline-none placeholder:text-purple-300"
        placeholder="在此输入 Markdown 内容，或直接从飞书粘贴..."
        spellCheck={false}
      />
    </div>
  );
}
