import { marked, Renderer, Tokens } from "marked";
import hljs from "highlight.js";
import { Theme } from "./themes";

export interface CustomStyles {
  primaryColor: string;
  fontSize: number;
  titleFontSize: number;
  lineHeight: number;
  paragraphIndent: boolean;
}

// 根据自定义样式覆盖主题样式
function applyCustomStyles(
  themeStyles: Theme["styles"],
  custom: CustomStyles
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

  // 自定义样式只替换边框颜色和强调元素颜色
  // 不修改标题的文字颜色和背景色，保持主题原有的对比度设计
  const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g;

  // 只替换边框颜色
  const replaceBorderColor = (style: string) => {
    return style.replace(/border[^:]*:\s*[^;]*#[0-9a-fA-F]+[^;]*/g, (match) =>
      match.replace(colorRegex, primaryColor)
    );
  };

  styles.h1 = replaceBorderColor(styles.h1);
  styles.h2 = replaceBorderColor(styles.h2);
  styles.h3 = replaceBorderColor(styles.h3);
  styles.h4 = replaceBorderColor(styles.h4);

  // 强调和链接使用主题色
  styles.strong = styles.strong.replace(/color:\s*[^;]+;/, `color: ${primaryColor};`);
  styles.a = styles.a.replace(/color:\s*[^;]+;/, `color: ${primaryColor};`);

  // 替换引用块边框颜色
  styles.blockquote = styles.blockquote.replace(/border[^:]*:\s*[^;]*#[0-9a-fA-F]+[^;]*/g, (match) =>
    match.replace(colorRegex, primaryColor)
  );

  return styles;
}

export function createMarkdownRenderer(
  theme: Theme,
  customStyles?: CustomStyles
): Renderer {
  const renderer = new Renderer();
  const styles = customStyles
    ? applyCustomStyles(theme.styles, customStyles)
    : theme.styles;

  // 标题
  renderer.heading = function ({ tokens, depth }: Tokens.Heading): string {
    const styleMap: Record<number, string> = {
      1: styles.h1,
      2: styles.h2,
      3: styles.h3,
      4: styles.h4,
    };
    const style = styleMap[depth] || styles.h4;
    const content = this.parser.parseInline(tokens);
    return `<h${depth} style="${style}">${content}</h${depth}>`;
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

  // 代码块
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

    return `<pre style="${styles.pre}"><code>${highlightedCode}</code></pre>`;
  };

  // 列表
  renderer.list = function (token: Tokens.List): string {
    const tag = token.ordered ? "ol" : "ul";
    const style = token.ordered ? styles.ol : styles.ul;
    // 保存 parser 引用，避免 this 上下文问题
    const parser = this.parser;
    const body = token.items
      .map((item) => {
        // 使用 parser.parse 来正确处理列表项中的内联格式（如加粗、斜体等）
        const content = parser.parse(item.tokens);
        return `<li style="${styles.li}">${content}</li>`;
      })
      .join("");
    return `<${tag} style="${style}">${body}</${tag}>`;
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

  // 将全角星号转换为半角星号
  result = result.replace(/＊/g, '*');

  // 修复 `** 文字 **` 格式（星号和文字之间有空格）为 `**文字**`
  // 匹配 ** 后面有空格，或者 ** 前面有空格的情况
  result = result.replace(/\*\*\s+([^*\n]+?)\s+\*\*/g, '**$1**');

  // 修复单侧空格的情况：`** 文字**` 或 `**文字 **`
  result = result.replace(/\*\*\s+([^*\n]+?)\*\*/g, '**$1**');
  result = result.replace(/\*\*([^*\n]+?)\s+\*\*/g, '**$1**');

  return result;
}

// 后处理 HTML，清理未解析的星号
function postprocessHtml(html: string): string {
  let result = html;

  // 清理残留的 ** 符号（不在 <code> 或 <pre> 标签内的）
  // 先保护代码块内容
  const codeBlocks: string[] = [];
  result = result.replace(/<(pre|code)[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // 清理残留的星号标记
  result = result.replace(/\*\*/g, '');
  result = result.replace(/(?<!\*)\*(?!\*)/g, ''); // 单个星号

  // 恢复代码块
  codeBlocks.forEach((block, index) => {
    result = result.replace(`__CODE_BLOCK_${index}__`, block);
  });

  return result;
}

export function parseMarkdown(
  markdown: string,
  theme: Theme,
  customStyles?: CustomStyles
): string {
  const renderer = createMarkdownRenderer(theme, customStyles);

  // 使用 marked.use() 替代 setOptions，这是 marked v5+ 的正确方式
  marked.use({
    renderer,
    gfm: true,
    breaks: true,
  });

  // 预处理 Markdown，修复常见格式问题
  const processedMarkdown = preprocessMarkdown(markdown);
  const rawHtml = marked.parse(processedMarkdown) as string;
  // 后处理 HTML，清理残留的星号
  const content = postprocessHtml(rawHtml);

  // 应用自定义样式到容器
  let containerStyle = theme.styles.container;
  if (customStyles) {
    containerStyle = containerStyle
      .replace(/font-size:\s*\d+px/g, `font-size: ${customStyles.fontSize}px`)
      .replace(/line-height:\s*[\d.]+/g, `line-height: ${customStyles.lineHeight}`);
  }

  return `<section style="${containerStyle}">${content}</section>`;
}
