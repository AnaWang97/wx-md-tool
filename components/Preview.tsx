"use client";

import { useRef, useEffect } from "react";

interface PreviewProps {
  html: string;
  previewRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: (scrollRatio: number) => void;
  scrollRatio?: number;
  isScrollSource?: boolean;
}

export default function Preview({
  html,
  previewRef,
  onScroll,
  scrollRatio,
  isScrollSource,
}: PreviewProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ref = previewRef || internalRef;
  const isInternalScroll = useRef(false);

  // 处理滚动事件
  const handleScroll = () => {
    if (isInternalScroll.current) {
      isInternalScroll.current = false;
      return;
    }

    const container = scrollContainerRef.current;
    if (!container || !onScroll) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      const ratio = scrollTop / maxScroll;
      onScroll(ratio);
    }
  };

  // 同步滚动位置
  useEffect(() => {
    if (isScrollSource || scrollRatio === undefined) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollHeight, clientHeight } = container;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      isInternalScroll.current = true;
      container.scrollTop = scrollRatio * maxScroll;
    }
  }, [scrollRatio, isScrollSource]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-50/50 to-purple-50/50">
      <div className="flex items-center px-4 py-2.5 border-b-2 border-pink-100 bg-white/80">
        <span className="text-sm text-purple-500 font-medium flex items-center gap-1">
          <span>👀</span>
          预览
        </span>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto p-4"
        onScroll={handleScroll}
      >
        <div
          ref={ref}
          className="max-w-[680px] mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border-2 border-pink-100"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
