"use client";

interface ToolbarProps {
  onInsert: (before: string, after?: string, defaultText?: string) => void;
  onWrap: (prefix: string, suffix: string, defaultText?: string) => void;
}

interface ToolButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  divider?: boolean;
}

export default function EditorToolbar({ onInsert, onWrap }: ToolbarProps) {
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
      action: () => onInsert("\n---\n", "", ""),
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
    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-white/90 border-b-2 border-pink-100 overflow-x-auto">
      {tools.map((tool, index) => (
        <div key={index} className="flex items-center">
          <button
            onClick={tool.action}
            title={tool.label}
            className="p-1.5 rounded-lg hover:bg-pink-100 text-purple-600 hover:text-purple-800 transition-colors flex items-center justify-center min-w-[28px] h-7"
          >
            {tool.icon}
          </button>
          {tool.divider && (
            <div className="w-px h-4 bg-pink-200 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}
