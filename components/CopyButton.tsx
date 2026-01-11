"use client";

import { useState, useCallback } from "react";

interface CopyButtonProps {
  getContent: () => string;
}

export default function CopyButton({ getContent }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      const content = getContent();

      // 创建一个临时的 div 来保存 HTML 内容
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      document.body.appendChild(tempDiv);

      // 选择内容
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      // 复制
      document.execCommand("copy");

      // 清理
      selection?.removeAllRanges();
      document.body.removeChild(tempDiv);

      // 也尝试使用现代 Clipboard API
      try {
        const blob = new Blob([content], { type: "text/html" });
        const clipboardItem = new ClipboardItem({
          "text/html": blob,
          "text/plain": new Blob([tempDiv.innerText], { type: "text/plain" }),
        });
        await navigator.clipboard.write([clipboardItem]);
      } catch {
        // 如果现代 API 失败，已经用 execCommand 复制了
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("复制失败:", error);
      alert("复制失败，请手动选择内容复制");
    }
  }, [getContent]);

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all hover-wiggle shadow-md ${
        copied
          ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
          : "bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white hover:shadow-lg"
      }`}
    >
      {copied ? "已复制 ✓" : "复制内容"}
    </button>
  );
}
