"use client";

import { useRef, useEffect, useState } from "react";

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
  const [isMobilePreview, setIsMobilePreview] = useState(false);

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

  // 同步滚动位置 - 使用原生 DOM 操作避免 React 渲染循环
  useEffect(() => {
    if (isScrollSource || scrollRatio === undefined) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollHeight, clientHeight } = container;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) return;

    const targetScrollTop = Math.round(scrollRatio * maxScroll);

    // 只在确实需要移动时才设置标志
    if (Math.abs(container.scrollTop - targetScrollTop) > 1) {
      isInternalScroll.current = true;
      container.scrollTop = targetScrollTop;
      // 立即重置标志，让后续的用户滚动可以正常触发
      requestAnimationFrame(() => {
        isInternalScroll.current = false;
      });
    }
  }, [scrollRatio, isScrollSource]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-pink-50/50 to-purple-50/50">
      <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-pink-100 bg-white/80">
        <span className="text-sm text-purple-500 font-medium flex items-center gap-1">
          <span>👀</span>
          预览
        </span>
        <button
          onClick={() => setIsMobilePreview(!isMobilePreview)}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-all ${
            isMobilePreview
              ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md"
              : "bg-pink-50 text-purple-500 border border-pink-200 hover:bg-pink-100"
          }`}
          title={isMobilePreview ? "切换到桌面预览" : "切换到手机预览"}
        >
          {isMobilePreview ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              手机
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              桌面
            </>
          )}
        </button>
      </div>
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-auto p-4 ${isMobilePreview ? "bg-gray-200 flex items-start justify-center" : ""}`}
        onScroll={handleScroll}
      >
        {isMobilePreview ? (
          <div
            className="flex-shrink-0"
            style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}
          >
            <div className="w-[375px] bg-gray-800 rounded-[3rem] p-3 shadow-2xl">
              {/* 手机顶部刘海 */}
              <div className="w-32 h-6 bg-gray-800 rounded-full mx-auto mb-2 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-4 bg-black rounded-full"></div>
              </div>
              <div
                ref={ref}
                className="bg-white rounded-[2rem] overflow-hidden"
                style={{ minHeight: "600px" }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
              {/* 手机底部横条 */}
              <div className="w-32 h-1 bg-gray-600 rounded-full mx-auto mt-3"></div>
            </div>
          </div>
        ) : (
          <div
            ref={ref}
            className="max-w-[680px] mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border-2 border-pink-100"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
