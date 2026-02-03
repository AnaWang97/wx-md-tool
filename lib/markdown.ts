import { marked, Renderer, Tokens } from "marked";
import hljs from "highlight.js";
import { Theme } from "./themes";

// 代码高亮主题类型
export type CodeTheme = "github-dark" | "github-light" | "monokai" | "dracula";

export interface CustomStyles {
  primaryColor: string;
  fontSize: number;
  titleFontSize: number;
  lineHeight: number;
  paragraphIndent: boolean;
  codeTheme: CodeTheme;
}

// 代码高亮主题样式
export const codeThemes: Record<CodeTheme, { name: string; pre: string; code: string }> = {
  "github-dark": {
    name: "GitHub Dark",
    pre: "background: #0d1117; color: #c9d1d9; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0; font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.7;",
    code: "background: transparent; color: inherit; padding: 0; font-family: inherit; font-size: inherit;",
  },
  "github-light": {
    name: "GitHub Light",
    pre: "background: #f6f8fa; color: #24292f; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0; font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.7; border: 1px solid #d0d7de;",
    code: "background: transparent; color: inherit; padding: 0; font-family: inherit; font-size: inherit;",
  },
  "monokai": {
    name: "Monokai",
    pre: "background: #272822; color: #f8f8f2; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0; font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.7;",
    code: "background: transparent; color: inherit; padding: 0; font-family: inherit; font-size: inherit;",
  },
  "dracula": {
    name: "Dracula",
    pre: "background: #282a36; color: #f8f8f2; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0; font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.7;",
    code: "background: transparent; color: inherit; padding: 0; font-family: inherit; font-size: inherit;",
  },
};

// 高亮文本扩展 ==text==
const highlightExtension = {
  name: "highlight",
  level: "inline" as const,
  start(src: string) {
    const match = src.match(/==/);
    return match ? match.index : -1;
  },
  tokenizer(src: string) {
    const rule = /^==([^=]+)==/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "highlight",
        raw: match[0],
        text: match[1].trim(),
      };
    }
    return undefined;
  },
  renderer(token: { text: string }) {
    return `<mark>${token.text}</mark>`;
  },
};

// 脚注扩展
interface FootnoteToken {
  type: string;
  raw: string;
  id: string;
  text?: string;
}

const footnoteList: Map<string, string> = new Map();

const footnoteRefExtension = {
  name: "footnoteRef",
  level: "inline" as const,
  start(src: string) {
    return src.indexOf("[^");
  },
  tokenizer(src: string): FootnoteToken | undefined {
    // 匹配脚注引用 [^1]
    const rule = /^\[\^([^\]]+)\](?!:)/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "footnoteRef",
        raw: match[0],
        id: match[1],
      };
    }
    return undefined;
  },
  renderer(token: FootnoteToken) {
    return `<sup class="footnote-ref"><a href="#fn-${token.id}" id="fnref-${token.id}">[${token.id}]</a></sup>`;
  },
};

const footnoteDefExtension = {
  name: "footnoteDef",
  level: "block" as const,
  start(src: string) {
    return src.indexOf("[^");
  },
  tokenizer(src: string): FootnoteToken | undefined {
    // 匹配脚注定义 [^1]: 内容
    const rule = /^\[\^([^\]]+)\]:\s*(.+?)(?:\n|$)/;
    const match = rule.exec(src);
    if (match) {
      footnoteList.set(match[1], match[2]);
      return {
        type: "footnoteDef",
        raw: match[0],
        id: match[1],
        text: match[2],
      };
    }
    return undefined;
  },
  renderer() {
    // 脚注定义不在原位置渲染，而是在文末统一渲染
    return "";
  },
};

// 根据自定义样式覆盖主题样式
function applyCustomStyles(
  themeStyles: Theme["styles"],
  custom: CustomStyles,
  colorFollowable: boolean = false
): Theme["styles"] {
  const { primaryColor, fontSize, titleFontSize, lineHeight, paragraphIndent } = custom;

  // 创建样式副本
  const styles = { ...themeStyles };

  // 覆盖容器样式
  styles.container = styles.container
    .replace(/font-size:\s*\d+px/g, `font-size: ${fontSize}px`)
    .replace(/line-height:\s*[\d.]+/g, `line-height: ${lineHeight}`);

  // 覆盖段落缩进
  if (paragraphIndent) {
    if (!styles.p.includes("text-indent")) {
      styles.p += " text-indent: 2em;";
    }
  } else {
    styles.p = styles.p.replace(/text-indent:\s*\d+em;?/g, "");
  }

  // 覆盖标题字号 (基于 titleFontSize 计算各级标题大小)
  const h1Size = titleFontSize;
  const h2Size = Math.round(titleFontSize * 0.85);
  const h3Size = Math.round(titleFontSize * 0.75);
  const h4Size = Math.round(titleFontSize * 0.68);

  styles.h1 = styles.h1.replace(/font-size:\s*\d+px/g, `font-size: ${h1Size}px`);
  styles.h2 = styles.h2.replace(/font-size:\s*\d+px/g, `font-size: ${h2Size}px`);
  styles.h3 = styles.h3.replace(/font-size:\s*\d+px/g, `font-size: ${h3Size}px`);
  styles.h4 = styles.h4.replace(/font-size:\s*\d+px/g, `font-size: ${h4Size}px`);

  // 颜色正则
  const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g;

  // 生成深色版本（用于渐变的深色端）
  const darkenColor = (color: string, amount: number = 0.2): string => {
    // 简单实现：将 hex 颜色变暗
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - Math.round(255 * amount));
      const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - Math.round(255 * amount));
      const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - Math.round(255 * amount));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return color;
  };

  // 生成浅色版本（用于背景）
  const lightenColor = (color: string, alpha: number = 0.1): string => {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  };

  // 替换边框颜色
  const replaceBorderColor = (style: string) => {
    return style.replace(/border[^:]*:\s*[^;]*#[0-9a-fA-F]+[^;]*/g, (match) =>
      match.replace(colorRegex, primaryColor)
    );
  };

  // 替换背景色（包括纯色和渐变）
  const replaceBackgroundColor = (style: string) => {
    let result = style;
    // 替换 linear-gradient
    result = result.replace(/linear-gradient\([^)]+\)/g, () => {
      return `linear-gradient(135deg, ${primaryColor} 0%, ${darkenColor(primaryColor, 0.15)} 100%)`;
    });
    // 替换纯色 background（但保留 background: #fff 等浅色背景）
    result = result.replace(/background:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})(?![^;]*gradient)/g, (match, color) => {
      // 判断是否是深色背景（用于胶囊标题等）
      const hex = color.slice(1);
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      // 如果原来是深色背景，替换为主题色
      if (brightness < 180) {
        return `background: ${primaryColor}`;
      }
      // 如果是浅色背景，替换为主题色的浅色版本
      return `background: ${lightenColor(primaryColor, 0.1)}`;
    });
    return result;
  };

  // 智能替换颜色：保留白色文字，替换其他颜色
  const smartReplaceColors = (style: string) => {
    // 替换 background 和 border 中的颜色
    let result = style;

    // 替换 linear-gradient 中的颜色（但保留 transparent）
    result = result.replace(/linear-gradient\([^)]+\)/g, (match) => {
      return match.replace(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g, (color) => {
        return primaryColor;
      });
    });

    // 替换 background: #xxx（非白色/浅色背景）
    result = result.replace(/background:\s*(#[0-9a-fA-F]{3,6})/g, (match, color) => {
      const hex = color.slice(1);
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      // 深色背景替换为主题色，浅色背景替换为主题色的浅色版本
      if (brightness < 200) {
        return `background: ${primaryColor}`;
      } else {
        return `background: ${lightenColor(primaryColor, 0.1)}`;
      }
    });

    // 替换 border 中的颜色（非白色/浅灰色）
    result = result.replace(/border[^:]*:\s*([^;]*)/g, (match) => {
      return match.replace(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g, (color) => {
        const hex = color.slice(1);
        const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
        const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
        const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        // 只替换非浅色边框
        if (brightness < 230) {
          return primaryColor;
        }
        return color;
      });
    });

    // 替换 color: #xxx（非白色文字，用于标题文字颜色）
    result = result.replace(/([^-])color:\s*(#[0-9a-fA-F]{3,6})/g, (match, prefix, color) => {
      const hex = color.slice(1);
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      // 白色/浅色文字保持不变，深色文字替换为主题色
      if (brightness > 240) {
        return match; // 保持白色文字
      }
      return `${prefix}color: ${primaryColor}`;
    });

    return result;
  };

  // 引用块特殊处理：只替换背景和边框，保留文字颜色
  const replaceBlockquoteColors = (style: string) => {
    let result = style;
    // 替换 background: #xxx 纯色背景（但保留渐变背景）
    result = result.replace(/background:\s*(#[0-9a-fA-F]{3,6})(?!\s*\d)/g, () => {
      return `background: ${lightenColor(primaryColor, 0.1)}`;
    });
    // 替换 border 中的颜色
    result = result.replace(/border[^:]*:\s*([^;]*)/g, (match) => {
      return match.replace(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g, () => primaryColor);
    });
    // 不替换 color 属性，保持文字可读
    return result;
  };

  // 替换标题样式
  if (colorFollowable) {
    styles.h1 = smartReplaceColors(styles.h1);
    styles.h2 = smartReplaceColors(styles.h2);
    styles.h3 = smartReplaceColors(styles.h3);
    styles.h4 = smartReplaceColors(styles.h4);
    styles.hr = smartReplaceColors(styles.hr);
    styles.blockquote = replaceBlockquoteColors(styles.blockquote);
  } else {
    styles.h1 = replaceBorderColor(styles.h1);
    styles.h2 = replaceBorderColor(styles.h2);
    styles.h3 = replaceBorderColor(styles.h3);
    styles.h4 = replaceBorderColor(styles.h4);
    styles.blockquote = styles.blockquote.replace(/border[^:]*:\s*[^;]*#[0-9a-fA-F]+[^;]*/g, (match) =>
      match.replace(colorRegex, primaryColor)
    );
  }

  // 强调和链接使用主题色
  styles.strong = styles.strong.replace(/color:\s*[^;]+;/, `color: ${primaryColor};`);
  styles.a = styles.a.replace(/color:\s*[^;]+;/, `color: ${primaryColor};`);

  return styles;
}

export function createMarkdownRenderer(
  theme: Theme,
  customStyles?: CustomStyles,
  codeTheme?: CodeTheme
): Renderer {
  const renderer = new Renderer();
  const styles = customStyles
    ? applyCustomStyles(theme.styles, customStyles, theme.colorFollowable ?? false)
    : theme.styles;

  // 标题
  renderer.heading = function ({ tokens, depth }: Tokens.Heading): string {
    const styleMap: Record<number, { base: string; before?: string; after?: string }> = {
      1: { base: styles.h1, before: styles.h1Before, after: styles.h1After },
      2: { base: styles.h2, before: styles.h2Before, after: styles.h2After },
      3: { base: styles.h3, before: styles.h3Before, after: styles.h3After },
      4: { base: styles.h4, before: styles.h4Before, after: styles.h4After },
    };
    const { base, before, after } = styleMap[depth] || { base: styles.h4 };
    const content = this.parser.parseInline(tokens);
    // 从 before/after 中提取符号（content: '符号 ' -> 符号）
    const getSymbol = (style?: string) => {
      if (!style) return '';
      const match = style.match(/content:\s*['"]([^'"]+)['"]/);
      return match ? match[1].trim() : '';
    };
    const beforeSymbol = getSymbol(before);
    const afterSymbol = getSymbol(after);
    return `<h${depth} style="${base}">${beforeSymbol}${content}${afterSymbol}</h${depth}>`;
  };

  // 段落
  renderer.paragraph = ({ text }: Tokens.Paragraph): string => {
    return `<p style="${styles.p}">${text}</p>`;
  };

  // 粗体
  renderer.strong = ({ text }: Tokens.Strong): string => {
    return `<strong style="${styles.strong}">${text}</strong>`;
  };

  // 斜体
  renderer.em = ({ text }: Tokens.Em): string => {
    return `<em style="${styles.em}">${text}</em>`;
  };

  // 链接
  renderer.link = ({ href, text }: Tokens.Link): string => {
    return `<a href="${href}" style="${styles.a}">${text}</a>`;
  };

  // 引用块
  renderer.blockquote = ({ text }: Tokens.Blockquote): string => {
    return `<blockquote style="${styles.blockquote}">${text}</blockquote>`;
  };

  // 行内代码
  renderer.codespan = ({ text }: Tokens.Codespan): string => {
    return `<code style="${styles.code}">${text}</code>`;
  };

  // 代码块（支持代码主题）
  renderer.code = ({ text, lang }: Tokens.Code): string => {
    let highlightedCode = text;

    if (lang && hljs.getLanguage(lang)) {
      try {
        highlightedCode = hljs.highlight(text, { language: lang }).value;
      } catch {
        highlightedCode = text;
      }
    } else {
      try {
        highlightedCode = hljs.highlightAuto(text).value;
      } catch {
        highlightedCode = text;
      }
    }

    // 代码主题优先使用独立传入的 codeTheme，其次使用 customStyles 中的
    const effectiveCodeTheme = codeTheme || customStyles?.codeTheme;
    const preStyle = effectiveCodeTheme
      ? codeThemes[effectiveCodeTheme].pre
      : styles.pre;

    return `<pre style="${preStyle}"><code>${highlightedCode}</code></pre>`;
  };

  // 列表
  renderer.list = function (token: Tokens.List): string {
    const tag = token.ordered ? "ol" : "ul";
    // 强制使用统一的列表容器样式
    const listStyle = "margin: 16px 0; padding-left: 10px; list-style: none;";
    // 列表项样式
    const liBaseStyle = "margin: 12px 0; line-height: 1.8;";
    // 保存 parser 引用
    const parser = this.parser;
    const primaryColor = customStyles?.primaryColor || theme.preview;

    const body = token.items
      .map((item, index) => {
        // 解析列表项内容
        let content = parser.parse(item.tokens);
        // 移除 <p> 标签包裹（marked 会给列表项内容加 <p> 标签）
        content = content.replace(/^<p[^>]*>([\s\S]*)<\/p>$/i, '$1').trim();

        // 微信不支持 list-style，需要手动添加项目符号
        if (token.ordered) {
          // 有序列表：添加数字序号
          const bulletStyle = `color: ${primaryColor}; font-weight: 600; margin-right: 6px;`;
          return `<li style="${liBaseStyle}"><span style="${bulletStyle}">${index + 1}.</span>${content}</li>`;
        } else {
          // 无序列表：添加圆点符号
          const bulletStyle = `color: ${primaryColor}; margin-right: 8px;`;
          return `<li style="${liBaseStyle}"><span style="${bulletStyle}">•</span>${content}</li>`;
        }
      })
      .join("");
    return `<${tag} style="${listStyle}">${body}</${tag}>`;
  };

  // 图片
  renderer.image = ({ href, title, text }: Tokens.Image): string => {
    const titleAttr = title ? ` title="${title}"` : "";
    return `<img src="${href}" alt="${text}"${titleAttr} style="${styles.img}" />`;
  };

  // 分隔线
  renderer.hr = (): string => {
    return `<hr style="${styles.hr}" />`;
  };

  // 表格
  renderer.table = function (token: Tokens.Table): string {
    // 保存 parser 引用，避免 this 上下文问题
    const parser = this.parser;
    const header = token.header
      .map((cell) => {
        const content = parser.parseInline(cell.tokens);
        return `<th style="${styles.th}">${content}</th>`;
      })
      .join("");

    const body = token.rows
      .map((row) => {
        const cells = row
          .map((cell) => {
            const content = parser.parseInline(cell.tokens);
            return `<td style="${styles.td}">${content}</td>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");

    return `<table style="${styles.table}"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
  };

  return renderer;
}

// 预处理 Markdown，修复常见的格式问题
function preprocessMarkdown(markdown: string): string {
  let result = markdown;

  // 移除零宽字符和其他不可见字符（保留换行和普通空格）
  result = result.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // ========== 列表处理（在加粗处理之前） ==========

  // --- 无序列表 ---
  // 1. 处理冒号后紧跟无序列表项的情况：`：* 内容`
  result = result.replace(/([：:])[ \t]*([*\-+])[ \t]+/g, '$1\n\n$2 ');

  // 2. 处理标点后紧跟无序列表项：`；* 内容`
  result = result.replace(/([；;。.])[ \t]*([*\-+])[ \t]+/g, '$1\n\n$2 ');

  // 3. 确保无序列表前有空行
  result = result.replace(/([^\n])(\n)([*\-+])[ \t]+/g, '$1\n\n$3 ');

  // 4. 将全角星号转换为列表标记
  result = result.replace(/^＊[ \t]+/gm, '* ');
  result = result.replace(/\n＊[ \t]+/g, '\n* ');

  // --- 有序列表 ---
  // 5. 处理冒号后紧跟有序列表项的情况：`：1. 内容` 或 `：1、内容`
  result = result.replace(/([：:])[ \t]*(\d+)[.、．][ \t]*/g, '$1\n\n$2. ');

  // 6. 处理标点后紧跟有序列表项
  result = result.replace(/([；;。.])[ \t]*(\d+)[.、．][ \t]*/g, '$1\n\n$2. ');

  // 7. 确保有序列表前有空行（非行首的数字列表）
  result = result.replace(/([^\n])(\n)(\d+)[.、．][ \t]+/g, '$1\n\n$3. ');

  // 8. 将中文顿号列表转换为标准格式：`1、` -> `1. `
  result = result.replace(/^(\d+)、[ \t]*/gm, '$1. ');
  result = result.replace(/\n(\d+)、[ \t]*/g, '\n$1. ');

  // ========== 加粗语法处理 ==========

  // 将全角星号转换为半角星号（用于加粗的，成对出现）
  result = result.replace(/＊＊/g, '**');

  // 修复加粗语法：处理 ** 和文字之间的各种空白字符
  // 1. 两侧都有空格：`** 文字 **` -> `**文字**`
  result = result.replace(/\*\*[ \t]+([^*]+?)[ \t]+\*\*/g, '**$1**');

  // 2. 左侧有空格：`** 文字**` -> `**文字**`
  result = result.replace(/\*\*[ \t]+([^*]+?)\*\*/g, '**$1**');

  // 3. 右侧有空格：`**文字 **` -> `**文字**`
  result = result.replace(/\*\*([^*]+?)[ \t]+\*\*/g, '**$1**');

  // 4. 修复连续星号问题：`****文字****` -> `**文字**`
  result = result.replace(/\*{3,}([^*]+?)\*{3,}/g, '**$1**');

  // 5. 处理星号后紧跟换行的情况
  result = result.replace(/\*\*\n+([^*]+?)\n*\*\*/g, '**$1**');

  return result;
}

// 后处理 HTML，处理未解析的加粗语法
function postprocessHtml(html: string, strongStyle: string): string {
  let result = html;

  // 先保护代码块内容
  const codeBlocks: string[] = [];
  result = result.replace(/<(pre|code)[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // 保护已解析的 strong 标签
  const strongTags: string[] = [];
  result = result.replace(/<strong[^>]*>[\s\S]*?<\/strong>/gi, (match) => {
    strongTags.push(match);
    return `__STRONG_TAG_${strongTags.length - 1}__`;
  });

  // 手动解析未被 marked 处理的 **文字** 格式
  // 使用更宽松的匹配模式，内容可以包含除了连续两个星号以外的任何字符
  result = result.replace(/\*\*((?:(?!\*\*).)+?)\*\*/g, `<strong style="${strongStyle}">$1</strong>`);

  // 清理剩余的孤立双星号
  result = result.replace(/\*\*/g, '');

  // 恢复 strong 标签
  strongTags.forEach((tag, index) => {
    result = result.replace(`__STRONG_TAG_${index}__`, tag);
  });

  // 恢复代码块
  codeBlocks.forEach((block, index) => {
    result = result.replace(`__CODE_BLOCK_${index}__`, block);
  });

  return result;
}

export function parseMarkdown(
  markdown: string,
  theme: Theme,
  customStyles?: CustomStyles,
  codeTheme?: CodeTheme
): string {
  // 清空脚注列表
  footnoteList.clear();

  const renderer = createMarkdownRenderer(theme, customStyles, codeTheme);

  // 使用 marked.use() 注册扩展和配置
  marked.use({
    renderer,
    gfm: true,
    breaks: true,
    extensions: [highlightExtension, footnoteRefExtension, footnoteDefExtension],
  });

  // 获取样式（用于后处理）
  const styles = customStyles
    ? applyCustomStyles(theme.styles, customStyles, theme.colorFollowable ?? false)
    : theme.styles;

  // 预处理 Markdown，修复常见格式问题
  const processedMarkdown = preprocessMarkdown(markdown);
  const rawHtml = marked.parse(processedMarkdown) as string;
  // 后处理 HTML，处理未解析的加粗语法
  let content = postprocessHtml(rawHtml, styles.strong);

  // 处理高亮文本 ==text==
  const primaryColor = customStyles?.primaryColor || theme.preview;
  const highlightStyle = `background: linear-gradient(transparent 60%, ${primaryColor}40 60%); padding: 0 2px;`;
  // 先处理高亮扩展生成的 <mark> 标签
  content = content.replace(
    /<mark>([^<]+)<\/mark>/g,
    `<mark style="${highlightStyle}">$1</mark>`
  );
  // 然后处理原始的 ==text== 格式（以防扩展没有匹配到）
  content = content.replace(
    /==([^=]+)==/g,
    `<mark style="${highlightStyle}">$1</mark>`
  );

  // 渲染脚注列表
  if (footnoteList.size > 0) {
    const footnoteStyle = `margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #666;`;
    const footnoteItemStyle = `margin: 8px 0; line-height: 1.6;`;
    const footnoteLinkStyle = `color: ${primaryColor}; text-decoration: none; margin-right: 8px;`;

    let footnoteHtml = `<div style="${footnoteStyle}"><p style="font-weight: 600; margin-bottom: 12px; color: #333;">参考注释</p>`;
    footnoteList.forEach((text, id) => {
      footnoteHtml += `<p id="fn-${id}" style="${footnoteItemStyle}"><a href="#fnref-${id}" style="${footnoteLinkStyle}">[${id}]</a>${text}</p>`;
    });
    footnoteHtml += "</div>";
    content += footnoteHtml;
  }

  // 处理脚注引用链接样式
  const footnoteRefStyle = `color: ${primaryColor}; text-decoration: none; font-weight: 500;`;
  content = content.replace(
    /<sup class="footnote-ref"><a href="([^"]+)" id="([^"]+)">\[([^\]]+)\]<\/a><\/sup>/g,
    `<sup style="font-size: 12px;"><a href="$1" id="$2" style="${footnoteRefStyle}">[$3]</a></sup>`
  );

  // 应用自定义样式到容器
  let containerStyle = theme.styles.container;
  if (customStyles) {
    containerStyle = containerStyle
      .replace(/font-size:\s*\d+px/g, `font-size: ${customStyles.fontSize}px`)
      .replace(/line-height:\s*[\d.]+/g, `line-height: ${customStyles.lineHeight}`);
  }

  // 移除第一个元素的 margin-top，避免顶部空白
  let processedContent = content;
  // 匹配第一个带 style 的元素，在样式末尾添加 margin-top: 0（末尾才能覆盖前面的 margin 设置）
  processedContent = processedContent.replace(
    /^(\s*<[a-z][a-z0-9]*\s+style="[^"]*)(">)/i,
    '$1 margin-top: 0;$2'
  );

  return `<section style="${containerStyle}">${processedContent}</section>`;
}
