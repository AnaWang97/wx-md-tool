"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  articleComponents,
  quoteComponents,
  type LayoutComponentId,
} from "@/lib/layout-components";
import {
  createDividerStyleTemplate,
  dividerStyleOptions,
  type DividerStyleId,
} from "@/lib/divider-styles";
import {
  isAlignmentBlockType,
  isQuoteBlockType,
  type LayoutComponentAlign,
  type LayoutComponentBlockType,
} from "@/lib/layout-component-block";

interface ToolbarProps {
  onInsert: (before: string, after?: string, defaultText?: string) => void;
  onWrap: (prefix: string, suffix: string, defaultText?: string) => void;
  onInsertComponent: (id: LayoutComponentId) => void;
  onClearComponent: () => void;
  onSetComponentAlign: (align: LayoutComponentAlign) => void;
  onSetTextAlign: (align: LayoutComponentAlign) => void;
  activeComponent?: {
    type: LayoutComponentBlockType;
    label: string;
    align: LayoutComponentAlign;
  } | null;
}

interface ToolButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  divider?: boolean;
  menu?: "divider";
}

const alignOptions: Array<{ value: LayoutComponentAlign; label: string }> = [
  { value: "left", label: "左" },
  { value: "center", label: "中" },
  { value: "right", label: "右" },
  { value: "justify", label: "两端" },
];

const toolbarAlignOptions: Array<{
  value: LayoutComponentAlign;
  label: string;
}> = [
  { value: "left", label: "左对齐" },
  { value: "center", label: "居中对齐" },
  { value: "right", label: "右对齐" },
  { value: "justify", label: "两端对齐" },
];

export default function EditorToolbar({
  onInsert,
  onWrap,
  onInsertComponent,
  onClearComponent,
  onSetComponentAlign,
  onSetTextAlign,
  activeComponent,
}: ToolbarProps) {
  const [isComponentMenuOpen, setIsComponentMenuOpen] = useState(false);
  const [isQuoteMenuOpen, setIsQuoteMenuOpen] = useState(false);
  const [isAlignMenuOpen, setIsAlignMenuOpen] = useState(false);
  const [isDividerMenuOpen, setIsDividerMenuOpen] = useState(false);
  const [dividerMenuPosition, setDividerMenuPosition] = useState({ left: 8, top: 40 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const componentMenuRef = useRef<HTMLDivElement>(null);
  const alignMenuRef = useRef<HTMLDivElement>(null);
  const dividerMenuRef = useRef<HTMLDivElement>(null);
  const dividerButtonRef = useRef<HTMLButtonElement>(null);

  const updateDividerMenuPosition = useCallback(() => {
    const toolbar = toolbarRef.current;
    const button = dividerButtonRef.current;

    if (!toolbar || !button) return;

    const toolbarRect = toolbar.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const menuWidth = 256;
    const padding = 8;
    const maxLeft = Math.max(padding, toolbarRect.width - menuWidth - padding);
    const nextLeft = Math.min(
      Math.max(buttonRect.left - toolbarRect.left, padding),
      maxLeft
    );

    setDividerMenuPosition({
      left: nextLeft,
      top: buttonRect.bottom - toolbarRect.top + 8,
    });
  }, []);

  useEffect(() => {
    if (!isComponentMenuOpen && !isAlignMenuOpen && !isDividerMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isDividerMenuOpen &&
        dividerMenuRef.current &&
        dividerButtonRef.current &&
        !dividerMenuRef.current.contains(target) &&
        !dividerButtonRef.current.contains(target)
      ) {
        setIsDividerMenuOpen(false);
      }

      if (
        isComponentMenuOpen &&
        componentMenuRef.current &&
        !componentMenuRef.current.contains(target)
      ) {
        setIsComponentMenuOpen(false);
        setIsQuoteMenuOpen(false);
      }

      if (
        isAlignMenuOpen &&
        alignMenuRef.current &&
        !alignMenuRef.current.contains(target)
      ) {
        setIsAlignMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAlignMenuOpen, isComponentMenuOpen, isDividerMenuOpen]);

  useEffect(() => {
    if (!isDividerMenuOpen) return;

    window.addEventListener("resize", updateDividerMenuPosition);
    window.addEventListener("scroll", updateDividerMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateDividerMenuPosition);
      window.removeEventListener("scroll", updateDividerMenuPosition, true);
    };
  }, [isDividerMenuOpen, updateDividerMenuPosition]);

  const insertDividerStyle = (id: DividerStyleId) => {
    onInsert(`\n${createDividerStyleTemplate(id)}\n`, "", "");
    setIsDividerMenuOpen(false);
  };

  const insertDefaultDivider = () => {
    onInsert("\n---\n", "", "");
    setIsDividerMenuOpen(false);
  };

  const handleDividerMenuToggle = () => {
    if (isDividerMenuOpen) {
      setIsDividerMenuOpen(false);
    } else {
      updateDividerMenuPosition();
      setIsDividerMenuOpen(true);
    }
    setIsAlignMenuOpen(false);
    setIsComponentMenuOpen(false);
    setIsQuoteMenuOpen(false);
  };

  const currentToolbarAlign =
    activeComponent &&
    (isQuoteBlockType(activeComponent.type) ||
      isAlignmentBlockType(activeComponent.type))
      ? activeComponent.align
      : null;

  const tools: ToolButton[] = [
    // 标题
    {
      icon: <span className="font-bold">H1</span>,
      label: "一级标题",
      action: () => onInsert("# ", "", "标题"),
    },
    {
      icon: <span className="font-bold">H2</span>,
      label: "二级标题",
      action: () => onInsert("## ", "", "标题"),
    },
    {
      icon: <span className="font-bold text-sm">H3</span>,
      label: "三级标题",
      action: () => onInsert("### ", "", "标题"),
      divider: true,
    },
    // 文本格式
    {
      icon: <span className="font-bold">B</span>,
      label: "加粗",
      action: () => onWrap("**", "**", "粗体文本"),
    },
    {
      icon: <span className="italic">I</span>,
      label: "斜体",
      action: () => onWrap("*", "*", "斜体文本"),
    },
    {
      icon: <span className="line-through">S</span>,
      label: "删除线",
      action: () => onWrap("~~", "~~", "删除文本"),
    },
    {
      icon: (
        <span className="relative inline-flex h-4 min-w-4 items-center justify-center px-0.5 text-[11px] font-bold leading-none">
          <span className="relative z-10">==</span>
          <span className="absolute bottom-0 left-0 right-0 h-1.5 rounded-sm bg-pink-200" />
        </span>
      ),
      label: "高亮",
      action: () => onWrap("==", "==", "高亮文本"),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 12h6" />
        </svg>
      ),
      label: "行内代码",
      action: () => onWrap("`", "`", "code"),
      divider: true,
    },
    // 列表
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="9" y1="6" x2="20" y2="6" />
          <line x1="9" y1="12" x2="20" y2="12" />
          <line x1="9" y1="18" x2="20" y2="18" />
          <circle cx="4" cy="6" r="1.5" fill="currentColor" />
          <circle cx="4" cy="12" r="1.5" fill="currentColor" />
          <circle cx="4" cy="18" r="1.5" fill="currentColor" />
        </svg>
      ),
      label: "无序列表",
      action: () => onInsert("- ", "", "列表项"),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="6" x2="20" y2="6" />
          <line x1="10" y1="12" x2="20" y2="12" />
          <line x1="10" y1="18" x2="20" y2="18" />
          <text x="2" y="8" fontSize="8" fill="currentColor" fontWeight="bold">1</text>
          <text x="2" y="14" fontSize="8" fill="currentColor" fontWeight="bold">2</text>
          <text x="2" y="20" fontSize="8" fill="currentColor" fontWeight="bold">3</text>
        </svg>
      ),
      label: "有序列表",
      action: () => onInsert("1. ", "", "列表项"),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="14" height="14" rx="2" />
          <path d="M7 10l2 2 4-4" />
        </svg>
      ),
      label: "任务列表",
      action: () => onInsert("- [ ] ", "", "待办事项"),
      divider: true,
    },
    // 引用和代码块
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>
      ),
      label: "引用",
      action: () => onInsert("> ", "", "引用文本"),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16,18 22,12 16,6" />
          <polyline points="8,6 2,12 8,18" />
        </svg>
      ),
      label: "代码块",
      action: () => onInsert("```javascript\n", "\n```", "// 代码"),
      divider: true,
    },
    // 链接和分割线
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
      label: "链接",
      action: () => onWrap("[", "](https://)", "链接文字"),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
      ),
      label: "图片",
      action: () => onInsert("![", "](图片链接)", "图片描述"),
    },
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      ),
      label: "分割线",
      action: () => undefined,
      menu: "divider",
      divider: true,
    },
    // 表格
    {
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      ),
      label: "表格",
      action: () => onInsert("| 列1 | 列2 | 列3 |\n|------|------|------|\n| ", " | | |", "内容"),
    },
  ];

  return (
    <div
      ref={toolbarRef}
      className="relative flex items-center bg-white/90 border-b-2 border-pink-100 overflow-visible"
    >
      <div className="flex min-w-0 flex-1 items-center gap-0.5 px-2 py-1.5 overflow-x-auto">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="relative flex items-center"
          >
            <button
              ref={tool.menu === "divider" ? dividerButtonRef : undefined}
              onClick={tool.menu === "divider" ? handleDividerMenuToggle : tool.action}
              title={tool.label}
              className={`p-1.5 rounded-lg hover:bg-pink-100 text-purple-600 hover:text-purple-800 transition-colors flex items-center justify-center min-w-[28px] h-7 ${
                tool.menu === "divider" && isDividerMenuOpen ? "bg-pink-100" : ""
              }`}
            >
              {tool.icon}
            </button>
            {tool.divider && (
              <div className="w-px h-4 bg-pink-200 mx-1" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center px-2 py-1.5 border-l border-pink-100 bg-white/95">
        <div ref={alignMenuRef} className="relative flex items-center">
          <button
            onClick={() => {
              setIsAlignMenuOpen((open) => !open);
              setIsDividerMenuOpen(false);
              setIsComponentMenuOpen(false);
              setIsQuoteMenuOpen(false);
            }}
            title="对齐方式"
            className={`p-1.5 rounded-lg hover:bg-pink-100 text-purple-600 hover:text-purple-800 transition-colors flex items-center justify-center min-w-[28px] h-7 ${
              isAlignMenuOpen ? "bg-pink-100" : ""
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="11" x2="16" y2="11" />
              <line x1="4" y1="16" x2="20" y2="16" />
              <line x1="4" y1="21" x2="14" y2="21" />
            </svg>
          </button>
          <div
            aria-hidden={!isAlignMenuOpen}
            className={`absolute right-0 top-full mt-2 w-28 rounded-xl border-2 border-pink-100 bg-white py-1 shadow-xl z-[90] ${
              isAlignMenuOpen ? "" : "hidden"
            }`}
          >
            {toolbarAlignOptions.map((option) => {
              const isActive = currentToolbarAlign === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onSetTextAlign(option.value);
                    setIsAlignMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-purple-50 text-purple-700"
                      : "text-pink-500 hover:bg-pink-50 hover:text-purple-600"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="w-px h-4 bg-pink-200 mx-1" />
        <div ref={componentMenuRef} className="relative flex items-center">
          <button
            onClick={() => {
              setIsDividerMenuOpen(false);
              setIsComponentMenuOpen((open) => {
                const nextOpen = !open;
                setIsQuoteMenuOpen(
                  nextOpen && Boolean(activeComponent && isQuoteBlockType(activeComponent.type))
                );
                return nextOpen;
              });
            }}
            title="排版组件"
            className="px-2.5 h-7 rounded-lg hover:bg-pink-100 text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 text-xs font-medium whitespace-nowrap"
          >
            组件
            <span className={`transition-transform ${isComponentMenuOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          <div
            aria-hidden={!isComponentMenuOpen}
            className={`absolute right-0 top-full mt-2 w-60 max-h-[70vh] overflow-y-auto bg-white rounded-xl shadow-xl border-2 border-pink-100 z-[80] ${
              isComponentMenuOpen ? "" : "hidden"
            }`}
          >
            <div className="px-3 py-2 border-b border-pink-100 bg-pink-50/70">
              <p className="text-[11px] leading-relaxed text-purple-500">
                {activeComponent
                  ? "当前组件可换样式，也可以一键取消"
                  : "先选中文字，再点组件；未选择时插入模板"}
              </p>
            </div>
            {activeComponent && (
              <div className="border-b border-pink-100 bg-white px-3 py-2">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-purple-600">
                    当前组件
                  </span>
                  <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] text-purple-500">
                    当前：{activeComponent.label}
                  </span>
                </div>
                {isQuoteBlockType(activeComponent.type) && (
                  <div className="mb-2">
                    <div className="mb-1.5 text-[11px] font-medium text-purple-500">
                      对齐方式
                    </div>
                    <div className="grid grid-cols-4 gap-1 rounded-lg bg-pink-50/70 p-1">
                      {alignOptions.map((option) => {
                        const isActive = activeComponent.align === option.value;

                        return (
                          <button
                            key={option.value}
                            onClick={() => onSetComponentAlign(option.value)}
                            className={`h-7 rounded-md text-[11px] font-medium transition-colors ${
                              isActive
                                ? "bg-white text-purple-700 shadow-sm"
                                : "text-pink-500 hover:bg-white/70 hover:text-purple-600"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    onClearComponent();
                    setIsComponentMenuOpen(false);
                    setIsQuoteMenuOpen(false);
                  }}
                  className="w-full rounded-lg border border-pink-100 bg-pink-50/80 px-3 py-2 text-left text-xs font-medium text-pink-500 hover:bg-pink-100 transition-colors"
                >
                  取消组件
                </button>
              </div>
            )}
            <button
              onClick={() => setIsQuoteMenuOpen((open) => !open)}
              className="w-full px-3 py-2.5 text-left hover:bg-pink-50 flex items-center gap-3 transition-colors"
            >
              <span className="w-7 h-7 rounded-lg bg-pink-50 text-purple-500 flex items-center justify-center text-xs font-bold">
                句
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-purple-700 font-medium">
                  金句卡片
                </span>
                <span className="block text-xs text-pink-400 truncate">
                  选择一种金句展示样式
                </span>
              </span>
              <span className={`text-xs text-purple-400 transition-transform ${isQuoteMenuOpen ? "rotate-90" : ""}`}>
                ▸
              </span>
            </button>

            <div
              aria-hidden={!isQuoteMenuOpen}
              className={`border-y border-pink-100 bg-pink-50/40 py-1 ${
                isQuoteMenuOpen ? "" : "hidden"
              }`}
            >
              {quoteComponents.map((component) => (
                <button
                  key={component.id}
                  onClick={() => {
                    onInsertComponent(component.id);
                    setIsComponentMenuOpen(false);
                    setIsQuoteMenuOpen(false);
                  }}
                  className={`w-full py-2 pl-8 pr-3 text-left hover:bg-white/80 flex items-center gap-2 transition-colors ${
                    activeComponent?.type === component.id ? "bg-white/90" : ""
                  }`}
                >
                  <span className="w-6 h-6 rounded-md bg-white text-purple-500 flex items-center justify-center text-[11px] font-bold">
                    {component.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-purple-700 font-medium">
                      {component.label}
                    </span>
                    <span className="block text-xs text-pink-400 truncate">
                      {component.description}
                    </span>
                  </span>
                  {activeComponent?.type === component.id && (
                    <span className="text-[11px] text-purple-400">当前</span>
                  )}
                </button>
              ))}
            </div>

            {articleComponents.map((component) => (
              <button
                key={component.id}
                onClick={() => {
                  onInsertComponent(component.id);
                  setIsComponentMenuOpen(false);
                  setIsQuoteMenuOpen(false);
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
        </div>
      </div>

      <div
        ref={dividerMenuRef}
        aria-hidden={!isDividerMenuOpen}
        style={{
          left: dividerMenuPosition.left,
          top: dividerMenuPosition.top,
        }}
        className={`absolute w-64 max-h-[70vh] overflow-y-auto rounded-xl border-2 border-pink-100 bg-white py-2 shadow-xl z-[110] ${
          isDividerMenuOpen ? "" : "hidden"
        }`}
      >
        <div className="px-3 pb-2 border-b border-pink-100">
          <p className="text-xs font-medium text-purple-600">分割线样式</p>
          <p className="mt-1 text-[11px] text-pink-400">
            默认样式不变，可选择更细的装饰线
          </p>
        </div>
        <button
          onClick={insertDefaultDivider}
          className="w-full px-3 py-2.5 text-left transition-colors hover:bg-pink-50"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-xs font-bold text-purple-600">
              默
            </span>
            <span>
              <span className="block text-sm font-semibold text-purple-700">
                默认样式
              </span>
              <span className="block text-xs text-pink-400">
                保持当前主题原始分割线
              </span>
            </span>
          </span>
        </button>
        {dividerStyleOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => insertDividerStyle(option.id)}
            className="w-full px-3 py-2.5 text-left transition-colors hover:bg-pink-50"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-xs font-bold text-purple-600">
                {option.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold text-purple-700">
                  {option.label}
                </span>
                <span className="block text-xs text-pink-400">
                  {option.description}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
