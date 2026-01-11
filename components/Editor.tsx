"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  htmlToMarkdown,
  hasHtmlContent,
  getHtmlFromClipboard,
} from "@/lib/html-to-markdown";
import EditorToolbar from "./EditorToolbar";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: (scrollRatio: number) => void;
  scrollRatio?: number;
  isScrollSource?: boolean;
}

export default function Editor({
  value,
  onChange,
  onScroll,
  scrollRatio,
  isScrollSource,
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInternalScroll = useRef(false);

  // 处理粘贴事件 - 智能识别富文本
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const clipboardData = e.clipboardData;

      // 检查是否有 HTML 内容（来自飞书等富文本编辑器）
      if (hasHtmlContent(clipboardData)) {
        const html = getHtmlFromClipboard(clipboardData);

        // 检查是否是有意义的 HTML（不只是纯文本的 HTML 包装）
        if (html && html.includes("<") && (html.includes("<p") || html.includes("<div") || html.includes("<h") || html.includes("<strong") || html.includes("<em") || html.includes("<ul") || html.includes("<ol"))) {
          e.preventDefault();

          const { markdown } = htmlToMarkdown(html);

          // 获取当前光标位置
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
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
        }
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

  // 同步滚动位置
  useEffect(() => {
    if (isScrollSource || scrollRatio === undefined) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const { scrollHeight, clientHeight } = textarea;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      isInternalScroll.current = true;
      textarea.scrollTop = scrollRatio * maxScroll;
    }
  }, [scrollRatio, isScrollSource]);

  // 工具栏：插入文本
  const handleInsert = useCallback(
    (before: string, after: string = "", defaultText: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end) || defaultText;

      // 检查是否在行首，如果不是则添加换行
      const needNewLine = before.startsWith("#") || before.startsWith("-") || before.startsWith("1.") || before.startsWith(">") || before.startsWith("```") || before.startsWith("|") || before.startsWith("\n");
      const prefix = needNewLine && start > 0 && value[start - 1] !== "\n" ? "\n" : "";

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
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, onChange]
  );

  // 工具栏：包裹选中文本
  const handleWrap = useCallback(
    (prefix: string, suffix: string, defaultText: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end) || defaultText;

      const newValue =
        value.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        value.substring(end);

      onChange(newValue);

      // 选中插入的文本
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + selectedText.length
        );
      }, 0);
    },
    [value, onChange]
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
        </div>
        <span className="text-xs text-purple-300 bg-purple-50 px-2 py-0.5 rounded-full">{value.length} 字符</span>
      </div>
      <EditorToolbar onInsert={handleInsert} onWrap={handleWrap} />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        onScroll={handleScroll}
        className="flex-1 w-full p-4 bg-transparent text-purple-900 font-mono text-sm resize-none focus:outline-none placeholder:text-purple-300"
        placeholder="在此输入 Markdown 内容，或直接从飞书粘贴..."
        spellCheck={false}
      />
    </div>
  );
}
