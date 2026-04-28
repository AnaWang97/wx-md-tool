// HTML 转 Markdown 工具
// 用于处理从飞书等富文本编辑器粘贴的内容

export interface ConvertResult {
  markdown: string;
}

export interface HtmlToMarkdownOptions {
  fallbackImageSources?: string[];
}

export function resolveImageSource(
  src: string,
  fallbackImageSources: string[] = []
): string {
  const trimmedSrc = src.trim();

  if (
    /^https?:\/\//i.test(trimmedSrc) ||
    /^data:image\/[a-z0-9.+-]+;base64,/i.test(trimmedSrc)
  ) {
    return trimmedSrc;
  }

  return fallbackImageSources[0] || "";
}

export function createMarkdownImage(
  src: string,
  alt: string,
  imageIndex: number
): string {
  return `\n![${alt.trim() || `图片${imageIndex}`}](${src})\n\n`;
}

function getImageSource(element: HTMLElement): string {
  const directSrc =
    element.getAttribute("src") ||
    element.getAttribute("data-src") ||
    element.getAttribute("data-original") ||
    element.getAttribute("data-url") ||
    "";

  if (directSrc.trim()) {
    return directSrc;
  }

  const srcset = element.getAttribute("srcset") || "";
  return srcset.split(",")[0]?.trim().split(/\s+/)[0] || "";
}

export function htmlToMarkdown(
  html: string,
  options: HtmlToMarkdownOptions = {}
): ConvertResult {
  let imageIndex = 0;
  let fallbackImageIndex = 0;
  const fallbackImageSources = options.fallbackImageSources || [];

  // 创建一个临时 DOM 元素来解析 HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    const children = Array.from(element.childNodes)
      .map(processNode)
      .join("");

    switch (tagName) {
      // 标题
      case "h1":
        return `\n# ${children.trim()}\n\n`;
      case "h2":
        return `\n## ${children.trim()}\n\n`;
      case "h3":
        return `\n### ${children.trim()}\n\n`;
      case "h4":
        return `\n#### ${children.trim()}\n\n`;
      case "h5":
        return `\n##### ${children.trim()}\n\n`;
      case "h6":
        return `\n###### ${children.trim()}\n\n`;

      // 段落和换行
      case "p":
        return `\n${children.trim()}\n\n`;
      case "br":
        return "\n";
      case "div":
        // 飞书的 div 通常是段落
        if (children.trim()) {
          return `\n${children.trim()}\n\n`;
        }
        return "";

      // 文本格式
      case "strong":
      case "b":
        return `**${children}**`;
      case "em":
      case "i":
        return `*${children}*`;
      case "u":
        return children; // Markdown 不支持下划线，保持原样
      case "s":
      case "strike":
      case "del":
        return `~~${children}~~`;
      case "code":
        // 检查是否是内联代码还是代码块
        if (element.parentElement?.tagName.toLowerCase() === "pre") {
          return children;
        }
        return `\`${children}\``;
      case "pre":
        const codeElement = element.querySelector("code");
        const lang = codeElement?.className?.match(/language-(\w+)/)?.[1] || "";
        const codeContent = codeElement?.textContent || children;
        return `\n\`\`\`${lang}\n${codeContent.trim()}\n\`\`\`\n\n`;

      // 链接
      case "a":
        const href = element.getAttribute("href") || "";
        if (href && children.trim()) {
          return `[${children.trim()}](${href})`;
        }
        return children;

      // 图片 - 提取图片 URL
      case "img":
        const src = getImageSource(element);
        const alt = element.getAttribute("alt") || "";
        imageIndex++;
        const fallbackImageSource = fallbackImageSources[fallbackImageIndex];
        const resolvedSrc = resolveImageSource(
          src,
          fallbackImageSource ? [fallbackImageSource] : []
        );

        if (resolvedSrc) {
          if (resolvedSrc === fallbackImageSource) {
            fallbackImageIndex++;
          }
          return createMarkdownImage(resolvedSrc, alt, imageIndex);
        }
        return `\n[图片${imageIndex}]\n\n`;

      // 列表
      case "ul":
        return `\n${children}\n`;
      case "ol":
        return `\n${children}\n`;
      case "li":
        const parent = element.parentElement;
        if (parent?.tagName.toLowerCase() === "ol") {
          // 有序列表
          const index =
            Array.from(parent.children).indexOf(element as Element) + 1;
          return `${index}. ${children.trim()}\n`;
        }
        return `- ${children.trim()}\n`;

      // 引用
      case "blockquote":
        const lines = children
          .trim()
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n");
        return `\n${lines}\n\n`;

      // 表格
      case "table":
        return `\n${children}\n`;
      case "thead":
      case "tbody":
        return children;
      case "tr":
        const cells = children.trim();
        // 检查是否是表头行
        if (element.parentElement?.tagName.toLowerCase() === "thead") {
          const cellCount = element.querySelectorAll("th, td").length;
          const separator = "|" + " --- |".repeat(cellCount);
          return `|${cells}\n${separator}\n`;
        }
        return `|${cells}\n`;
      case "th":
      case "td":
        return ` ${children.trim()} |`;

      // 水平线
      case "hr":
        return "\n---\n\n";

      // 其他容器元素
      case "span":
      case "section":
      case "article":
      case "main":
      case "header":
      case "footer":
      case "aside":
        return children;

      // 忽略的元素
      case "script":
      case "style":
      case "head":
      case "meta":
      case "link":
        return "";

      default:
        return children;
    }
  }

  let markdown = processNode(doc.body);

  const unusedFallbackImages = fallbackImageSources
    .slice(fallbackImageIndex)
    .map((src) => {
      imageIndex++;
      return createMarkdownImage(src, "", imageIndex);
    })
    .join("");

  markdown += unusedFallbackImages;

  // 清理多余的空行
  markdown = markdown
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+/, "")
    .replace(/\n+$/, "\n");

  return {
    markdown,
  };
}

// 检查剪贴板是否包含 HTML 内容
export function hasHtmlContent(clipboardData: DataTransfer): boolean {
  return clipboardData.types.includes("text/html");
}

// 从剪贴板获取 HTML 内容
export function getHtmlFromClipboard(clipboardData: DataTransfer): string {
  return clipboardData.getData("text/html");
}
