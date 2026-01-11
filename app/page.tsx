"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import ThemeSelector from "@/components/ThemeSelector";
import CopyButton from "@/components/CopyButton";
import CustomStylePanel, { CustomStyles } from "@/components/CustomStylePanel";
import ContactModal from "@/components/ContactModal";
import LandingPage from "@/components/LandingPage";
import { themes, Theme } from "@/lib/themes";
import { parseMarkdown } from "@/lib/markdown";

// 同步滚动的来源类型
type ScrollSource = "editor" | "preview" | null;

const defaultMarkdown = `# 欢迎使用 WX MD Tool

这是一个专为**微信公众号**打造的 Markdown 排版工具，让你的文章更加精美！

## 主要特性

- 12+ 精美主题，涵盖经典、现代、创意、极简、暗色等风格
- 支持自定义主题色、字号、行高
- 实时预览，所见即所得
- 一键复制，直接粘贴到公众号后台

## 代码展示

支持多种编程语言的语法高亮：

\`\`\`javascript
// JavaScript 示例
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
  return { message: 'Welcome!' };
};

greet('微信公众号');
\`\`\`

\`\`\`python
# Python 示例
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print([fibonacci(i) for i in range(10)])
\`\`\`

## 引用样式

> 工欲善其事，必先利其器。
>
> —— 《论语·卫灵公》

## 列表展示

**无序列表：**
- 第一项内容
- 第二项内容
- 第三项内容

**有序列表：**
1. 打开工具，输入 Markdown
2. 选择喜欢的主题样式
3. 调整自定义参数
4. 点击复制，粘贴到公众号

## 表格示例

| 功能 | 说明 | 状态 |
|------|------|------|
| Markdown 转换 | 将 Markdown 转换为富文本 | 已完成 |
| 主题切换 | 12+ 精美主题 | 已完成 |
| 自定义样式 | 颜色、字号、行高 | 已完成 |
| 一键复制 | 复制到剪贴板 | 已完成 |

---

开始创作你的精美文章吧！
`;

const defaultCustomStyles: CustomStyles = {
  primaryColor: "#07C160",
  fontSize: 16,
  titleFontSize: 22,
  lineHeight: 1.75,
  paragraphIndent: false,
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [customStyles, setCustomStyles] = useState<CustomStyles>(defaultCustomStyles);
  const [useCustomStyles, setUseCustomStyles] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // 检查用户是否已经访问过
  useEffect(() => {
    const hasVisited = localStorage.getItem("wx-md-tool-visited");
    if (hasVisited) {
      setShowLanding(false);
    }
    setIsLoaded(true);
  }, []);

  const handleStart = () => {
    localStorage.setItem("wx-md-tool-visited", "true");
    setShowLanding(false);
  };

  // 同步滚动状态
  const [scrollRatio, setScrollRatio] = useState(0);
  const [scrollSource, setScrollSource] = useState<ScrollSource>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 处理编辑器滚动
  const handleEditorScroll = useCallback((ratio: number) => {
    setScrollSource("editor");
    setScrollRatio(ratio);
    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    // 延迟重置滚动源，避免循环触发
    scrollTimeoutRef.current = setTimeout(() => {
      setScrollSource(null);
    }, 100);
  }, []);

  // 处理预览区滚动
  const handlePreviewScroll = useCallback((ratio: number) => {
    setScrollSource("preview");
    setScrollRatio(ratio);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setScrollSource(null);
    }, 100);
  }, []);

  const html = useMemo(() => {
    return parseMarkdown(
      markdown,
      theme,
      useCustomStyles ? customStyles : undefined
    );
  }, [markdown, theme, customStyles, useCustomStyles]);

  const getHtmlContent = useCallback(() => {
    return previewRef.current?.innerHTML || html;
  }, [html]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    // 更新自定义样式的主题色
    setCustomStyles((prev) => ({
      ...prev,
      primaryColor: newTheme.preview,
    }));
  };

  const handleCustomStylesChange = (styles: CustomStyles) => {
    setCustomStyles(styles);
    setUseCustomStyles(true);
  };

  // 等待客户端加载完成
  if (!isLoaded) {
    return (
      <div className="h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🌸</div>
          <p className="text-purple-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 显示欢迎页
  if (showLanding) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* 顶部工具栏 */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b-2 border-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLanding(true)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="返回首页"
          >
            <span className="text-xl">🌸</span>
            <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              WX MD Tool
            </h1>
            <span className="text-xl">✨</span>
          </button>
          <span className="text-xs text-purple-400 hidden sm:inline">
            微信公众号 Markdown 排版工具
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 使用自定义样式开关 */}
          <button
            onClick={() => setUseCustomStyles(!useCustomStyles)}
            className={`px-3 py-1.5 text-xs rounded-full transition-all hover-wiggle ${
              useCustomStyles
                ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md"
                : "bg-pink-50 text-purple-500 border border-pink-200 hover:bg-pink-100"
            }`}
          >
            {useCustomStyles ? "✓ 自定义" : "自定义"}
          </button>

          <CustomStylePanel
            styles={customStyles}
            onStylesChange={handleCustomStylesChange}
          />

          <ThemeSelector
            currentTheme={theme}
            onThemeChange={handleThemeChange}
          />

          <CopyButton getContent={getHtmlContent} />

          {/* 联系作者按钮 */}
          <button
            onClick={() => setShowContact(true)}
            className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md hover:shadow-lg transition-all hover-wiggle flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
            </svg>
            联系
          </button>
        </div>
      </header>

      {/* 主体内容区 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧编辑器 */}
        <div className="w-1/2 border-r-2 border-pink-100">
          <Editor
            value={markdown}
            onChange={setMarkdown}
            onScroll={handleEditorScroll}
            scrollRatio={scrollRatio}
            isScrollSource={scrollSource === "editor"}
          />
        </div>

        {/* 右侧预览 */}
        <div className="w-1/2">
          <Preview
            html={html}
            previewRef={previewRef}
            onScroll={handlePreviewScroll}
            scrollRatio={scrollRatio}
            isScrollSource={scrollSource === "preview"}
          />
        </div>
      </main>

      {/* 底部状态栏 */}
      <footer className="px-4 py-2 bg-white/80 backdrop-blur-sm border-t-2 border-pink-100 text-xs text-purple-400 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span>🎨</span>
            主题: {theme.name}
          </span>
          {useCustomStyles && (
            <span className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full border border-pink-200"
                style={{ backgroundColor: customStyles.primaryColor }}
              />
              自定义色
            </span>
          )}
        </div>
        <span className="flex items-center gap-1">
          <span>💕</span>
          复制后可直接粘贴到微信公众号编辑器
        </span>
      </footer>

      {/* 联系弹窗 */}
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </div>
  );
}
