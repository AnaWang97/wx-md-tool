"use client";

import { useState } from "react";

export interface CustomStyles {
  primaryColor: string;
  fontSize: number;
  titleFontSize: number;
  lineHeight: number;
  paragraphIndent: boolean;
}

interface CustomStylePanelProps {
  styles: CustomStyles;
  onStylesChange: (styles: CustomStyles) => void;
}

export default function CustomStylePanel({
  styles,
  onStylesChange,
}: CustomStylePanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    "#07C160", // 微信绿
    "#1677ff", // 蓝色
    "#8b5cf6", // 紫色
    "#06b6d4", // 青色
    "#f97316", // 橙色
    "#ec4899", // 粉色
    "#059669", // 绿色
    "#18181b", // 黑色
    "#ef4444", // 红色
    "#eab308", // 黄色
  ];

  return (
    <div className="relative">
      {/* 自定义按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-full transition-all hover-wiggle"
      >
        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span className="text-sm text-purple-600">调整</span>
      </button>

      {/* 下拉面板 */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border-2 border-pink-100 z-50 p-4">
            <h3 className="text-sm font-medium text-purple-600 mb-4 flex items-center gap-1">
              <span>🎨</span>
              样式调整
            </h3>

            {/* 主题色 */}
            <div className="mb-4">
              <label className="text-xs text-purple-400 block mb-2">主题色</label>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onStylesChange({ ...styles, primaryColor: color })}
                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 shadow-sm ${
                      styles.primaryColor === color ? "ring-2 ring-pink-400 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={styles.primaryColor}
                  onChange={(e) => onStylesChange({ ...styles, primaryColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer"
                  title="自定义颜色"
                />
              </div>
            </div>

            {/* 正文字号 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-purple-400">正文字号</label>
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{styles.fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="20"
                value={styles.fontSize}
                onChange={(e) => onStylesChange({ ...styles, fontSize: Number(e.target.value) })}
                className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-xs text-purple-300 mt-1">
                <span>14px</span>
                <span>20px</span>
              </div>
            </div>

            {/* 标题字号 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-purple-400">标题字号</label>
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{styles.titleFontSize}px</span>
              </div>
              <input
                type="range"
                min="18"
                max="28"
                value={styles.titleFontSize}
                onChange={(e) => onStylesChange({ ...styles, titleFontSize: Number(e.target.value) })}
                className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-xs text-purple-300 mt-1">
                <span>18px</span>
                <span>28px</span>
              </div>
            </div>

            {/* 行高 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-purple-400">行高</label>
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{styles.lineHeight}</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="2.5"
                step="0.1"
                value={styles.lineHeight}
                onChange={(e) => onStylesChange({ ...styles, lineHeight: Number(e.target.value) })}
                className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-xs text-purple-300 mt-1">
                <span>紧凑</span>
                <span>宽松</span>
              </div>
            </div>

            {/* 段落首行缩进 */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-purple-400">段落首行缩进</label>
              <button
                onClick={() => onStylesChange({ ...styles, paragraphIndent: !styles.paragraphIndent })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  styles.paragraphIndent ? "bg-gradient-to-r from-pink-400 to-purple-400" : "bg-pink-100"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                    styles.paragraphIndent ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
