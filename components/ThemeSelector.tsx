"use client";

import { useState } from "react";
import { themes, categories, Theme } from "@/lib/themes";

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredThemes =
    activeCategory === "all"
      ? themes
      : themes.filter((t) => t.category === activeCategory);

  return (
    <div className="relative">
      {/* 当前主题按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-full transition-all hover-wiggle"
      >
        <span
          className="w-4 h-4 rounded-full border border-pink-200"
          style={{ backgroundColor: currentTheme.preview }}
        />
        <span className="text-sm text-purple-600">{currentTheme.name}</span>
        <svg
          className={`w-4 h-4 text-purple-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉面板 */}
      {isOpen && (
        <>
          {/* 遮罩 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 主题选择面板 */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border-2 border-pink-100 z-50 overflow-hidden">
            {/* 分类标签 */}
            <div className="flex gap-1 p-2 bg-gradient-to-r from-pink-50 to-purple-50 border-b-2 border-pink-100 overflow-x-auto">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all ${
                  activeCategory === "all"
                    ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md"
                    : "bg-white text-purple-500 hover:bg-pink-100"
                }`}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md"
                      : "bg-white text-purple-500 hover:bg-pink-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* 主题列表 */}
            <div className="max-h-72 overflow-y-auto p-2 bg-white">
              <div className="grid grid-cols-2 gap-2">
                {filteredThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl transition-all ${
                      currentTheme.id === theme.id
                        ? "bg-gradient-to-r from-pink-100 to-purple-100 ring-2 ring-pink-400"
                        : "bg-pink-50/50 hover:bg-pink-100"
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
                      style={{ backgroundColor: theme.preview }}
                    />
                    <span className="text-sm text-purple-700 truncate">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
