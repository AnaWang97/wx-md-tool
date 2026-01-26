export interface Theme {
  name: string;
  id: string;
  category: "classic" | "modern" | "creative" | "minimal" | "dark" | "industry";
  preview: string;
  // 是否支持自定义颜色跟随（标题背景色会随主题色变化）
  colorFollowable?: boolean;
  styles: {
    container: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    p: string;
    strong: string;
    em: string;
    a: string;
    blockquote: string;
    code: string;
    pre: string;
    ul: string;
    ol: string;
    li: string;
    img: string;
    hr: string;
    table: string;
    th: string;
    td: string;
  };
}

export const themes: Theme[] = [
  // ========== 经典系列 ==========
  // 样式1: 渐变背景 + 居中
  {
    name: "微信绿",
    id: "wechat-green",
    category: "classic",
    preview: "#07C160",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 16px; color: #3f3f3f; line-height: 1.75; padding: 20px; letter-spacing: 0.5px;",
      h1: "font-size: 22px; font-weight: bold; color: #fff; text-align: center; margin: 30px 0 25px; padding: 18px 25px; background: linear-gradient(135deg, #07C160 0%, #10b981 100%); border-radius: 8px; box-shadow: 0 4px 15px rgba(7, 193, 96, 0.3); letter-spacing: 2px;",
      h2: "font-size: 18px; font-weight: bold; color: #07C160; margin: 28px 0 18px; padding: 12px 18px 12px 20px; background: linear-gradient(to right, rgba(7, 193, 96, 0.1), transparent); border-left: 4px solid #07C160; border-radius: 0 8px 8px 0;",
      h3: "font-size: 16px; font-weight: bold; color: #07C160; margin: 22px 0 12px; padding: 8px 0 8px 15px; border-left: 3px solid #07C160;",
      h4: "font-size: 15px; font-weight: bold; color: #07C160; margin: 18px 0 10px; padding-left: 10px; border-left: 2px solid #07C160;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: bold; color: #07C160;",
      em: "font-style: italic; color: #666; padding: 0 3px;",
      a: "color: #07C160; text-decoration: none; border-bottom: 1px solid #07C160; padding-bottom: 1px;",
      blockquote:
        "margin: 20px 0; padding: 15px 20px; background: linear-gradient(to right, #f0faf5, #fff); border-left: 4px solid #07C160; border-radius: 0 8px 8px 0; color: #666; font-size: 15px;",
      code: "background: #e7f7ef; color: #07C160; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace; font-size: 14px; margin: 0 2px;",
      pre: "background: linear-gradient(145deg, #1a1a2e, #16213e); color: #eee; padding: 20px; border-radius: 10px; overflow-x: auto; margin: 20px 0; font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.7; box-shadow: 0 4px 15px rgba(0,0,0,0.1);",
      ul: "margin: 16px 0; padding-left: 10px; list-style: none;",
      ol: "margin: 16px 0; padding-left: 10px; list-style: none;",
      li: "margin: 10px 0; display: flex; align-items: flex-start; line-height: 1.8;",
      img: "max-width: 100%; border-radius: 10px; margin: 25px auto; display: block; box-shadow: 0 4px 20px rgba(7, 193, 96, 0.15);",
      hr: "border: none; height: 1px; background: linear-gradient(to right, transparent, #07C160, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; border-radius: 8px; overflow: hidden;",
      th: "background: #07C160; color: white; padding: 14px 12px; text-align: left; font-weight: bold;",
      td: "border: 1px solid #e8e8e8; padding: 12px; background: #fafafa;",
    },
  },
  // 样式2: 左侧粗线 + 底部边框
  {
    name: "商务蓝",
    id: "business-blue",
    category: "classic",
    preview: "#1677ff",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 16px; color: #333; line-height: 1.8; padding: 20px;",
      h1: "font-size: 24px; font-weight: 700; color: #1677ff; margin: 30px 0 25px; padding: 15px 0 15px 20px; border-left: 6px solid #1677ff; border-bottom: 2px solid #e6f4ff; background: linear-gradient(to right, #e6f4ff, transparent);",
      h2: "font-size: 18px; font-weight: 600; color: #1677ff; margin: 28px 0 18px; padding: 10px 0 10px 15px; border-left: 4px solid #1677ff; background: rgba(22, 119, 255, 0.05);",
      h3: "font-size: 16px; font-weight: 600; color: #1677ff; margin: 22px 0 12px; padding: 8px 0; border-bottom: 1px dashed #1677ff;",
      h4: "font-size: 15px; font-weight: 600; color: #1677ff; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #1677ff;",
      em: "font-style: italic; color: #666;",
      a: "color: #1677ff; text-decoration: none; font-weight: 500;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #f6f8fa; border-left: 4px solid #1677ff; border-radius: 0 8px 8px 0; color: #555;",
      code: "background: #e6f4ff; color: #1677ff; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #0d1b2a; color: #e0e0e0; padding: 20px; border-radius: 10px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 8px; margin: 25px auto; display: block; box-shadow: 0 4px 15px rgba(22, 119, 255, 0.15);",
      hr: "border: none; height: 2px; background: linear-gradient(to right, #1677ff, #69b1ff, #1677ff); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: linear-gradient(135deg, #1677ff, #4096ff); color: white; padding: 14px; text-align: left; font-weight: 600;",
      td: "border: 1px solid #e6e6e6; padding: 12px;",
    },
  },
  // 样式3: 经典红 - 居中标题带下划装饰
  {
    name: "经典红",
    id: "classic-red",
    category: "classic",
    preview: "#dc2626",
    styles: {
      container:
        "font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 16px; color: #333; line-height: 1.8; padding: 20px;",
      h1: "font-size: 24px; font-weight: 700; color: #dc2626; text-align: center; margin: 30px 0 25px; padding-bottom: 15px; border-bottom: 3px double #dc2626;",
      h2: "font-size: 18px; font-weight: 600; color: #dc2626; margin: 28px 0 18px; padding: 10px 15px; background: #fef2f2; border-radius: 4px; border-left: 4px solid #dc2626;",
      h3: "font-size: 16px; font-weight: 600; color: #dc2626; margin: 22px 0 12px; padding-left: 12px; border-left: 3px solid #dc2626;",
      h4: "font-size: 15px; font-weight: 600; color: #dc2626; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #dc2626;",
      em: "font-style: italic; color: #666;",
      a: "color: #dc2626; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #fef2f2; border-left: 4px solid #dc2626; color: #555;",
      code: "background: #fef2f2; color: #dc2626; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 14px;",
      pre: "background: #1f1f1f; color: #e0e0e0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 8px; margin: 25px auto; display: block;",
      hr: "border: none; height: 1px; background: #dc2626; margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: #dc2626; color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #e6e6e6; padding: 12px;",
    },
  },

  // ========== 现代系列 ==========
  // 样式4: 渐变紫 - 胶囊形状标题
  {
    name: "渐变紫",
    id: "gradient-purple",
    category: "modern",
    preview: "#8b5cf6",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #374151; line-height: 1.85; padding: 20px;",
      h1: "font-size: 22px; font-weight: 700; color: #fff; margin: 30px 0 25px; padding: 16px 30px; background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%); border-radius: 50px; text-align: center; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35);",
      h2: "font-size: 18px; font-weight: 600; color: #fff; margin: 28px 0 18px; padding: 10px 25px; background: linear-gradient(90deg, #8b5cf6, #a78bfa); border-radius: 25px; display: inline-block;",
      h3: "font-size: 16px; font-weight: 600; color: #8b5cf6; margin: 22px 0 12px; padding: 8px 20px; background: #f5f3ff; border-radius: 20px; display: inline-block;",
      h4: "font-size: 15px; font-weight: 600; color: #8b5cf6; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #8b5cf6;",
      em: "font-style: italic; color: #6b7280;",
      a: "color: #8b5cf6; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 20px 25px; background: linear-gradient(135deg, #faf5ff, #f5f3ff); border-left: 4px solid #8b5cf6; border-radius: 0 12px 12px 0; color: #555;",
      code: "background: #f5f3ff; color: #8b5cf6; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: linear-gradient(145deg, #1e1b4b, #312e81); color: #e0e7ff; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 12px; margin: 25px auto; display: block; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2);",
      hr: "border: none; height: 2px; background: linear-gradient(to right, transparent, #8b5cf6, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px; border-radius: 12px; overflow: hidden;",
      th: "background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #e5e7eb; padding: 12px; background: #faf5ff;",
    },
  },
  // 样式5: 科技青 - 方块背景标题
  {
    name: "科技青",
    id: "tech-cyan",
    category: "modern",
    preview: "#06b6d4",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #334155; line-height: 1.8; padding: 20px;",
      h1: "font-size: 22px; font-weight: 700; color: #fff; margin: 30px 0 25px; padding: 18px 25px; background: #06b6d4; position: relative; clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%);",
      h2: "font-size: 18px; font-weight: 600; color: #0e7490; margin: 28px 0 18px; padding: 12px 20px; background: linear-gradient(90deg, #ecfeff, transparent); border-left: 5px solid #06b6d4;",
      h3: "font-size: 16px; font-weight: 600; color: #0e7490; margin: 22px 0 12px; padding: 6px 12px; background: #ecfeff; display: inline-block;",
      h4: "font-size: 15px; font-weight: 600; color: #06b6d4; margin: 18px 0 10px; padding-left: 10px; border-left: 3px solid #06b6d4;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #06b6d4;",
      em: "font-style: italic; color: #64748b;",
      a: "color: #06b6d4; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #ecfeff; border-left: 4px solid #06b6d4; color: #475569;",
      code: "background: #ecfeff; color: #06b6d4; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #083344; color: #67e8f9; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 8px; margin: 25px auto; display: block;",
      hr: "border: none; height: 2px; background: linear-gradient(to right, #06b6d4, #22d3ee, #06b6d4); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: #06b6d4; color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #e2e8f0; padding: 12px; background: #f8fafc;",
    },
  },
  // 样式6: 橙色活力 - 斜切标题
  {
    name: "活力橙",
    id: "vibrant-orange",
    category: "modern",
    preview: "#f97316",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #374151; line-height: 1.8; padding: 20px;",
      h1: "font-size: 22px; font-weight: 700; color: #fff; margin: 30px 0 25px; padding: 16px 25px 16px 30px; background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); transform: skewX(-3deg); box-shadow: 4px 4px 0 #fed7aa;",
      h2: "font-size: 18px; font-weight: 600; color: #c2410c; margin: 28px 0 18px; padding: 10px 0 10px 20px; border-left: 5px solid #f97316; background: linear-gradient(to right, #fff7ed, transparent);",
      h3: "font-size: 16px; font-weight: 600; color: #c2410c; margin: 22px 0 12px; padding: 5px 15px; background: #fff7ed; border-bottom: 2px solid #f97316; display: inline-block;",
      h4: "font-size: 15px; font-weight: 600; color: #f97316; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #f97316;",
      em: "font-style: italic; color: #6b7280;",
      a: "color: #f97316; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #fff7ed; border-left: 4px solid #f97316; color: #555;",
      code: "background: #fff7ed; color: #f97316; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #431407; color: #fed7aa; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 8px; margin: 25px auto; display: block;",
      hr: "border: none; height: 2px; background: linear-gradient(to right, transparent, #f97316, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: #f97316; color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #e5e7eb; padding: 12px;",
    },
  },

  // ========== 创意系列 ==========
  // 样式7: 樱花粉 - 圆点装饰标题
  {
    name: "樱花粉",
    id: "sakura-pink",
    category: "creative",
    preview: "#ec4899",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #374151; line-height: 1.85; padding: 20px;",
      h1: "font-size: 22px; font-weight: 700; color: #ec4899; text-align: center; margin: 30px 0 25px; padding: 15px 20px; position: relative; border-top: 3px solid #ec4899; border-bottom: 3px solid #ec4899;",
      h2: "font-size: 18px; font-weight: 600; color: #ec4899; margin: 28px 0 18px; padding: 8px 15px 8px 35px; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%23ec4899\"><circle cx=\"12\" cy=\"12\" r=\"8\"/></svg>') no-repeat left center; background-size: 24px;",
      h3: "font-size: 16px; font-weight: 600; color: #ec4899; margin: 22px 0 12px; padding: 6px 12px 6px 28px; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%23ec4899\"><circle cx=\"12\" cy=\"12\" r=\"5\"/></svg>') no-repeat left center; background-size: 18px;",
      h4: "font-size: 15px; font-weight: 600; color: #ec4899; margin: 18px 0 10px; padding-left: 20px; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%23ec4899\"><circle cx=\"12\" cy=\"12\" r=\"4\"/></svg>') no-repeat left center; background-size: 14px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #ec4899;",
      em: "font-style: italic; color: #6b7280;",
      a: "color: #ec4899; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: linear-gradient(135deg, #fdf2f8, #fce7f3); border-left: 4px solid #ec4899; border-radius: 0 12px 12px 0; color: #555;",
      code: "background: #fdf2f8; color: #ec4899; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #500724; color: #fbcfe8; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 12px; margin: 25px auto; display: block; box-shadow: 0 4px 20px rgba(236, 72, 153, 0.2);",
      hr: "border: none; height: 2px; background: linear-gradient(to right, transparent, #ec4899, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px; border-radius: 12px; overflow: hidden;",
      th: "background: linear-gradient(135deg, #ec4899, #f472b6); color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #fce7f3; padding: 12px; background: #fdf2f8;",
    },
  },
  // 样式8: 森林绿 - 引号装饰标题
  {
    name: "森林绿",
    id: "forest-green",
    category: "creative",
    preview: "#059669",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #374151; line-height: 1.8; padding: 20px;",
      h1: "font-size: 22px; font-weight: 700; color: #047857; text-align: center; margin: 30px 0 25px; padding: 20px 30px; position: relative; background: #ecfdf5;",
      h2: "font-size: 18px; font-weight: 600; color: #047857; margin: 28px 0 18px; padding: 12px 20px; background: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0;",
      h3: "font-size: 16px; font-weight: 600; color: #047857; margin: 22px 0 12px; padding-left: 15px; border-left: 4px solid #059669;",
      h4: "font-size: 15px; font-weight: 600; color: #059669; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #059669;",
      em: "font-style: italic; color: #6b7280;",
      a: "color: #059669; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #ecfdf5; border-left: 4px solid #059669; color: #555;",
      code: "background: #ecfdf5; color: #059669; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #064e3b; color: #a7f3d0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 8px; margin: 25px auto; display: block;",
      hr: "border: none; height: 1px; background: #059669; margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: #059669; color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #d1fae5; padding: 12px; background: #ecfdf5;",
    },
  },
  // 样式9: 金色奢华 - 双线框标题
  {
    name: "金色奢华",
    id: "luxury-gold",
    category: "creative",
    preview: "#d97706",
    styles: {
      container:
        "font-family: 'PingFang SC', 'Microsoft YaHei', Georgia, serif; font-size: 16px; color: #44403c; line-height: 1.85; padding: 20px;",
      h1: "font-size: 24px; font-weight: 700; color: #92400e; text-align: center; margin: 30px 0 25px; padding: 20px 30px; border: 3px double #d97706; background: linear-gradient(to bottom, #fffbeb, #fef3c7);",
      h2: "font-size: 18px; font-weight: 600; color: #92400e; margin: 28px 0 18px; padding: 12px 20px; border-left: 5px solid #d97706; border-right: 5px solid #d97706; background: #fffbeb;",
      h3: "font-size: 16px; font-weight: 600; color: #92400e; margin: 22px 0 12px; padding: 8px 15px; border-bottom: 2px solid #d97706;",
      h4: "font-size: 15px; font-weight: 600; color: #d97706; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #d97706;",
      em: "font-style: italic; color: #78716c;",
      a: "color: #d97706; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #fffbeb; border-left: 4px solid #d97706; color: #555; font-style: italic;",
      code: "background: #fffbeb; color: #d97706; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #451a03; color: #fcd34d; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 4px; margin: 25px auto; display: block; border: 2px solid #d97706;",
      hr: "border: none; height: 2px; background: linear-gradient(to right, transparent, #d97706, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px; border: 2px solid #d97706;",
      th: "background: linear-gradient(to bottom, #d97706, #b45309); color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #fde68a; padding: 12px; background: #fffbeb;",
    },
  },

  // ========== 极简系列 ==========
  // 样式10: 极简灰 - 无装饰纯文字
  {
    name: "极简灰",
    id: "minimal-gray",
    category: "minimal",
    preview: "#6b7280",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #374151; line-height: 1.9; padding: 20px; max-width: 680px; margin: 0 auto;",
      h1: "font-size: 26px; font-weight: 700; color: #111827; margin: 40px 0 25px; letter-spacing: -0.5px;",
      h2: "font-size: 20px; font-weight: 600; color: #1f2937; margin: 35px 0 18px;",
      h3: "font-size: 17px; font-weight: 600; color: #374151; margin: 28px 0 12px;",
      h4: "font-size: 15px; font-weight: 600; color: #4b5563; margin: 22px 0 10px;",
      p: "margin: 18px 0; text-align: justify;",
      strong: "font-weight: 600; color: #111827;",
      em: "font-style: italic;",
      a: "color: #6b7280; text-decoration: underline;",
      blockquote:
        "margin: 25px 0; padding: 0 0 0 25px; border-left: 2px solid #d1d5db; color: #6b7280; font-style: italic;",
      code: "background: #f3f4f6; color: #374151; padding: 2px 6px; border-radius: 3px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #1f2937; color: #e5e7eb; padding: 20px; border-radius: 6px; overflow-x: auto; margin: 25px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 18px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 18px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 8px 0;",
      img: "max-width: 100%; margin: 30px auto; display: block;",
      hr: "border: none; height: 1px; background: #e5e7eb; margin: 40px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;",
      th: "background: #f9fafb; color: #374151; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;",
      td: "border-bottom: 1px solid #e5e7eb; padding: 12px;",
    },
  },
  // 样式11: 简约黑 - 粗线条分隔
  {
    name: "简约黑",
    id: "simple-black",
    category: "minimal",
    preview: "#18181b",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #27272a; line-height: 1.85; padding: 20px;",
      h1: "font-size: 28px; font-weight: 800; color: #18181b; margin: 35px 0 20px; padding-bottom: 15px; border-bottom: 4px solid #18181b;",
      h2: "font-size: 20px; font-weight: 700; color: #18181b; margin: 30px 0 15px; padding-bottom: 10px; border-bottom: 2px solid #18181b;",
      h3: "font-size: 17px; font-weight: 600; color: #18181b; margin: 25px 0 12px;",
      h4: "font-size: 15px; font-weight: 600; color: #3f3f46; margin: 20px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 700; color: #18181b;",
      em: "font-style: italic;",
      a: "color: #18181b; text-decoration: underline;",
      blockquote:
        "margin: 22px 0; padding: 15px 20px; background: #fafafa; border-left: 4px solid #18181b; color: #52525b;",
      code: "background: #f4f4f5; color: #18181b; padding: 2px 6px; border-radius: 3px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #18181b; color: #fafafa; padding: 20px; border-radius: 4px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: square;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 8px 0;",
      img: "max-width: 100%; margin: 25px auto; display: block;",
      hr: "border: none; height: 2px; background: #18181b; margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: #18181b; color: white; padding: 12px; text-align: left;",
      td: "border: 1px solid #e4e4e7; padding: 12px;",
    },
  },
  // 样式12: 清新蓝 - 底部渐变线
  {
    name: "清新蓝",
    id: "fresh-blue",
    category: "minimal",
    preview: "#3b82f6",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #334155; line-height: 1.85; padding: 20px;",
      h1: "font-size: 24px; font-weight: 700; color: #1e40af; margin: 35px 0 20px; padding-bottom: 12px; border-bottom: 3px solid; border-image: linear-gradient(to right, #3b82f6, #93c5fd) 1;",
      h2: "font-size: 19px; font-weight: 600; color: #1e40af; margin: 28px 0 15px; padding-bottom: 8px; border-bottom: 2px solid #93c5fd;",
      h3: "font-size: 16px; font-weight: 600; color: #3b82f6; margin: 22px 0 12px;",
      h4: "font-size: 15px; font-weight: 600; color: #3b82f6; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #1e40af;",
      em: "font-style: italic; color: #64748b;",
      a: "color: #3b82f6; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 15px 20px; background: #eff6ff; border-left: 3px solid #3b82f6; color: #475569;",
      code: "background: #eff6ff; color: #3b82f6; padding: 2px 6px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #1e293b; color: #93c5fd; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 8px 0;",
      img: "max-width: 100%; border-radius: 8px; margin: 25px auto; display: block;",
      hr: "border: none; height: 2px; background: linear-gradient(to right, #3b82f6, #93c5fd, #3b82f6); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: #3b82f6; color: white; padding: 12px; text-align: left;",
      td: "border: 1px solid #dbeafe; padding: 12px; background: #f8fafc;",
    },
  },

  // ========== 暗色系列 ==========
  // 样式13: 暗夜模式 - 发光标题
  {
    name: "暗夜模式",
    id: "dark-mode",
    category: "dark",
    preview: "#a78bfa",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #e2e8f0; line-height: 1.85; padding: 25px; background: #0f172a;",
      h1: "font-size: 24px; font-weight: 700; color: #a78bfa; text-align: center; margin: 30px 0 25px; padding: 18px 25px; background: rgba(167, 139, 250, 0.1); border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 8px; text-shadow: 0 0 20px rgba(167, 139, 250, 0.5);",
      h2: "font-size: 19px; font-weight: 600; color: #a78bfa; margin: 28px 0 18px; padding: 10px 0 10px 20px; border-left: 4px solid #a78bfa; background: linear-gradient(to right, rgba(167, 139, 250, 0.1), transparent);",
      h3: "font-size: 16px; font-weight: 600; color: #c4b5fd; margin: 22px 0 12px; padding-left: 15px; border-left: 3px solid #a78bfa;",
      h4: "font-size: 15px; font-weight: 600; color: #c4b5fd; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #a78bfa;",
      em: "font-style: italic; color: #94a3b8;",
      a: "color: #a78bfa; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: rgba(167, 139, 250, 0.1); border-left: 4px solid #a78bfa; color: #cbd5e1;",
      code: "background: rgba(167, 139, 250, 0.2); color: #c4b5fd; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #1e1b4b; color: #e0e7ff; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7; border: 1px solid rgba(167, 139, 250, 0.2);",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 8px; margin: 25px auto; display: block; border: 1px solid rgba(167, 139, 250, 0.3);",
      hr: "border: none; height: 1px; background: linear-gradient(to right, transparent, #a78bfa, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: rgba(167, 139, 250, 0.3); color: #e2e8f0; padding: 14px; text-align: left;",
      td: "border: 1px solid rgba(167, 139, 250, 0.2); padding: 12px; background: rgba(15, 23, 42, 0.5);",
    },
  },
  // 样式14: 深海蓝 - 渐变边框
  {
    name: "深海蓝",
    id: "deep-ocean",
    category: "dark",
    preview: "#22d3ee",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #e2e8f0; line-height: 1.85; padding: 25px; background: #0c1929;",
      h1: "font-size: 24px; font-weight: 700; color: #22d3ee; margin: 30px 0 25px; padding: 18px 25px; background: linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(6, 182, 212, 0.05)); border: 2px solid transparent; border-image: linear-gradient(135deg, #22d3ee, #06b6d4) 1; text-align: center;",
      h2: "font-size: 19px; font-weight: 600; color: #22d3ee; margin: 28px 0 18px; padding: 12px 20px; background: rgba(34, 211, 238, 0.1); border-radius: 0 8px 8px 0; border-left: 4px solid #22d3ee;",
      h3: "font-size: 16px; font-weight: 600; color: #67e8f9; margin: 22px 0 12px; padding-left: 15px; border-left: 3px solid #22d3ee;",
      h4: "font-size: 15px; font-weight: 600; color: #67e8f9; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #22d3ee;",
      em: "font-style: italic; color: #94a3b8;",
      a: "color: #22d3ee; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: rgba(34, 211, 238, 0.1); border-left: 4px solid #22d3ee; color: #cbd5e1;",
      code: "background: rgba(34, 211, 238, 0.2); color: #67e8f9; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #042f2e; color: #5eead4; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 8px; margin: 25px auto; display: block;",
      hr: "border: none; height: 2px; background: linear-gradient(to right, transparent, #22d3ee, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: rgba(34, 211, 238, 0.3); color: #e2e8f0; padding: 14px; text-align: left;",
      td: "border: 1px solid rgba(34, 211, 238, 0.2); padding: 12px;",
    },
  },
  // 样式15: 暗红玫瑰 - 优雅暗色
  {
    name: "暗红玫瑰",
    id: "dark-rose",
    category: "dark",
    preview: "#fb7185",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 16px; color: #fecdd3; line-height: 1.85; padding: 25px; background: #1c1017;",
      h1: "font-size: 24px; font-weight: 700; color: #fb7185; text-align: center; margin: 30px 0 25px; padding: 18px 30px; border-top: 2px solid #fb7185; border-bottom: 2px solid #fb7185;",
      h2: "font-size: 19px; font-weight: 600; color: #fb7185; margin: 28px 0 18px; padding: 10px 20px; background: rgba(251, 113, 133, 0.1); border-left: 4px solid #fb7185;",
      h3: "font-size: 16px; font-weight: 600; color: #fda4af; margin: 22px 0 12px; padding-left: 15px; border-left: 3px solid #fb7185;",
      h4: "font-size: 15px; font-weight: 600; color: #fda4af; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #fb7185;",
      em: "font-style: italic; color: #9ca3af;",
      a: "color: #fb7185; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: rgba(251, 113, 133, 0.1); border-left: 4px solid #fb7185; color: #fecdd3;",
      code: "background: rgba(251, 113, 133, 0.2); color: #fda4af; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #3f0d1a; color: #fecdd3; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 8px; margin: 25px auto; display: block;",
      hr: "border: none; height: 1px; background: linear-gradient(to right, transparent, #fb7185, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: rgba(251, 113, 133, 0.3); color: #fecdd3; padding: 14px; text-align: left;",
      td: "border: 1px solid rgba(251, 113, 133, 0.2); padding: 12px;",
    },
  },

  // ========== 更多独特风格 ==========
  // 样式16: 杂志风 - 大字报标题
  {
    name: "杂志风",
    id: "magazine",
    category: "creative",
    preview: "#000000",
    styles: {
      container:
        "font-family: 'Georgia', 'PingFang SC', serif; font-size: 17px; color: #1a1a1a; line-height: 1.9; padding: 25px;",
      h1: "font-size: 36px; font-weight: 900; color: #000; margin: 40px 0 30px; line-height: 1.2; letter-spacing: -1px; text-transform: uppercase;",
      h2: "font-size: 24px; font-weight: 700; color: #000; margin: 35px 0 20px; padding-bottom: 10px; border-bottom: 3px solid #000;",
      h3: "font-size: 18px; font-weight: 700; color: #333; margin: 28px 0 15px; font-style: italic;",
      h4: "font-size: 16px; font-weight: 600; color: #333; margin: 22px 0 12px;",
      p: "margin: 18px 0; text-align: justify;",
      strong: "font-weight: 700; color: #000;",
      em: "font-style: italic;",
      a: "color: #000; text-decoration: underline;",
      blockquote:
        "margin: 30px 40px; padding: 0; border: none; font-size: 22px; font-style: italic; color: #333; line-height: 1.6;",
      code: "background: #f5f5f5; color: #333; padding: 2px 6px; font-family: 'Courier New', monospace; font-size: 15px;",
      pre: "background: #1a1a1a; color: #f5f5f5; padding: 25px; margin: 25px 0; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.6;",
      ul: "margin: 18px 0; padding-left: 30px; list-style-type: square;",
      ol: "margin: 18px 0; padding-left: 30px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; margin: 30px auto; display: block;",
      hr: "border: none; height: 3px; background: #000; margin: 40px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 15px;",
      th: "background: #000; color: white; padding: 15px; text-align: left; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;",
      td: "border: 1px solid #ddd; padding: 12px;",
    },
  },
  // 样式17: 手账风 - 手写体感觉
  {
    name: "手账风",
    id: "journal",
    category: "creative",
    preview: "#7c3aed",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif; font-size: 16px; color: #374151; line-height: 2; padding: 25px; background: #fefce8;",
      h1: "font-size: 26px; font-weight: 700; color: #7c3aed; margin: 30px 0 25px; padding: 15px 25px; background: #f5f3ff; border: 2px dashed #7c3aed; border-radius: 12px; text-align: center; transform: rotate(-1deg);",
      h2: "font-size: 20px; font-weight: 600; color: #7c3aed; margin: 28px 0 18px; padding: 8px 15px; background: linear-gradient(transparent 60%, #ddd6fe 60%); display: inline-block;",
      h3: "font-size: 17px; font-weight: 600; color: #7c3aed; margin: 22px 0 12px; padding-left: 30px; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%237c3aed\"><path d=\"M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z\"/></svg>') no-repeat left center; background-size: 22px;",
      h4: "font-size: 15px; font-weight: 600; color: #7c3aed; margin: 18px 0 10px;",
      p: "margin: 16px 0;",
      strong: "font-weight: 600; color: #7c3aed; background: linear-gradient(transparent 50%, #fef08a 50%);",
      em: "font-style: italic; color: #6b7280;",
      a: "color: #7c3aed; text-decoration: none; border-bottom: 2px dotted #7c3aed;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #fff; border: 2px solid #e5e7eb; border-radius: 8px; color: #555; transform: rotate(0.5deg);",
      code: "background: #f5f3ff; color: #7c3aed; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #1e1b4b; color: #e0e7ff; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: none;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0; padding-left: 25px; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%237c3aed\"><path d=\"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z\"/></svg>') no-repeat left center; background-size: 18px;",
      img: "max-width: 100%; border-radius: 12px; margin: 25px auto; display: block; border: 3px solid #e5e7eb; transform: rotate(1deg);",
      hr: "border: none; height: 2px; background: repeating-linear-gradient(90deg, #7c3aed 0px, #7c3aed 5px, transparent 5px, transparent 10px); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px; border: 2px solid #7c3aed; border-radius: 8px;",
      th: "background: #f5f3ff; color: #7c3aed; padding: 14px; text-align: left;",
      td: "border: 1px solid #e5e7eb; padding: 12px;",
    },
  },
  // 样式18: 技术文档 - 专业严谨
  {
    name: "技术文档",
    id: "tech-doc",
    category: "minimal",
    preview: "#0ea5e9",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'PingFang SC', sans-serif; font-size: 15px; color: #334155; line-height: 1.75; padding: 20px;",
      h1: "font-size: 28px; font-weight: 700; color: #0f172a; margin: 35px 0 20px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;",
      h2: "font-size: 22px; font-weight: 600; color: #0f172a; margin: 30px 0 15px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;",
      h3: "font-size: 18px; font-weight: 600; color: #1e293b; margin: 25px 0 12px;",
      h4: "font-size: 16px; font-weight: 600; color: #334155; margin: 20px 0 10px;",
      p: "margin: 14px 0;",
      strong: "font-weight: 600; color: #0f172a;",
      em: "font-style: italic; color: #64748b;",
      a: "color: #0ea5e9; text-decoration: none;",
      blockquote:
        "margin: 20px 0; padding: 12px 16px; background: #f8fafc; border-left: 4px solid #0ea5e9; color: #475569; font-size: 14px;",
      code: "background: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-family: 'SF Mono', 'Fira Code', Menlo, monospace; font-size: 13px;",
      pre: "background: #0f172a; color: #e2e8f0; padding: 16px 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0; font-family: 'SF Mono', 'Fira Code', Menlo, monospace; font-size: 13px; line-height: 1.6;",
      ul: "margin: 14px 0; padding-left: 24px; list-style-type: disc;",
      ol: "margin: 14px 0; padding-left: 24px; list-style-type: decimal;",
      li: "margin: 6px 0;",
      img: "max-width: 100%; margin: 20px auto; display: block; border: 1px solid #e2e8f0; border-radius: 8px;",
      hr: "border: none; height: 1px; background: #e2e8f0; margin: 30px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;",
      th: "background: #f8fafc; color: #0f172a; padding: 10px 12px; text-align: left; border: 1px solid #e2e8f0; font-weight: 600;",
      td: "border: 1px solid #e2e8f0; padding: 10px 12px;",
    },
  },

  // ========== 行业系列 ==========
  // 样式19: 科技互联网
  {
    name: "科技互联网",
    id: "tech-internet",
    category: "industry",
    preview: "#6366f1",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif; font-size: 16px; color: #334155; line-height: 1.8; padding: 20px;",
      h1: "font-size: 24px; font-weight: 700; color: #fff; margin: 30px 0 25px; padding: 18px 25px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);",
      h2: "font-size: 18px; font-weight: 600; color: #6366f1; margin: 28px 0 18px; padding: 12px 20px; background: linear-gradient(90deg, rgba(99, 102, 241, 0.1), transparent); border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0;",
      h3: "font-size: 16px; font-weight: 600; color: #6366f1; margin: 22px 0 12px; padding: 8px 15px; background: #eef2ff; border-radius: 6px; display: inline-block;",
      h4: "font-size: 15px; font-weight: 600; color: #6366f1; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #6366f1;",
      em: "font-style: italic; color: #64748b;",
      a: "color: #6366f1; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: linear-gradient(135deg, #eef2ff, #faf5ff); border-left: 4px solid #6366f1; border-radius: 0 12px 12px 0; color: #475569;",
      code: "background: #eef2ff; color: #6366f1; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: linear-gradient(145deg, #1e1b4b, #312e81); color: #e0e7ff; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 12px; margin: 25px auto; display: block; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);",
      hr: "border: none; height: 2px; background: linear-gradient(to right, transparent, #6366f1, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px; border-radius: 12px; overflow: hidden;",
      th: "background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #e5e7eb; padding: 12px; background: #fafafa;",
    },
  },
  // 样式20: 金融商务
  {
    name: "金融商务",
    id: "finance-business",
    category: "industry",
    preview: "#0f4c81",
    styles: {
      container:
        "font-family: 'Georgia', 'PingFang SC', 'Microsoft YaHei', serif; font-size: 16px; color: #1e293b; line-height: 1.85; padding: 20px;",
      h1: "font-size: 24px; font-weight: 700; color: #0f4c81; text-align: center; margin: 30px 0 25px; padding: 20px 30px; border: 2px solid #0f4c81; position: relative;",
      h2: "font-size: 18px; font-weight: 600; color: #0f4c81; margin: 28px 0 18px; padding: 12px 20px; background: #f0f7ff; border-left: 5px solid #0f4c81;",
      h3: "font-size: 16px; font-weight: 600; color: #0f4c81; margin: 22px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #0f4c81;",
      h4: "font-size: 15px; font-weight: 600; color: #0f4c81; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #0f4c81;",
      em: "font-style: italic; color: #64748b;",
      a: "color: #0f4c81; text-decoration: none; border-bottom: 1px solid #0f4c81;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #f8fafc; border-left: 4px solid #0f4c81; color: #475569; font-style: italic;",
      code: "background: #f0f7ff; color: #0f4c81; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #0f172a; color: #94a3b8; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 4px; margin: 25px auto; display: block; border: 1px solid #e2e8f0;",
      hr: "border: none; height: 1px; background: #0f4c81; margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: #0f4c81; color: white; padding: 14px; text-align: left; font-weight: 600;",
      td: "border: 1px solid #cbd5e1; padding: 12px;",
    },
  },
  // 样式21: 医疗健康
  {
    name: "医疗健康",
    id: "medical-health",
    category: "industry",
    preview: "#10b981",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 16px; color: #334155; line-height: 1.85; padding: 20px;",
      h1: "font-size: 24px; font-weight: 700; color: #fff; margin: 30px 0 25px; padding: 18px 25px; background: linear-gradient(135deg, #10b981 0%, #34d399 100%); border-radius: 12px; text-align: center;",
      h2: "font-size: 18px; font-weight: 600; color: #059669; margin: 28px 0 18px; padding: 12px 20px; background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 0 8px 8px 0;",
      h3: "font-size: 16px; font-weight: 600; color: #059669; margin: 22px 0 12px; padding: 8px 15px; background: #ecfdf5; border-radius: 20px; display: inline-block;",
      h4: "font-size: 15px; font-weight: 600; color: #10b981; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #059669;",
      em: "font-style: italic; color: #64748b;",
      a: "color: #10b981; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 0 8px 8px 0; color: #475569;",
      code: "background: #ecfdf5; color: #059669; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #064e3b; color: #a7f3d0; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 12px; margin: 25px auto; display: block;",
      hr: "border: none; height: 2px; background: linear-gradient(to right, transparent, #10b981, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px; border-radius: 12px; overflow: hidden;",
      th: "background: #10b981; color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #d1fae5; padding: 12px; background: #f0fdf4;",
    },
  },
  // 样式22: 教育学术
  {
    name: "教育学术",
    id: "education-academic",
    category: "industry",
    preview: "#f59e0b",
    styles: {
      container:
        "font-family: 'Georgia', 'PingFang SC', 'Microsoft YaHei', serif; font-size: 16px; color: #292524; line-height: 1.9; padding: 20px;",
      h1: "font-size: 26px; font-weight: 700; color: #92400e; text-align: center; margin: 30px 0 25px; padding: 15px 20px; border-bottom: 3px double #f59e0b;",
      h2: "font-size: 18px; font-weight: 600; color: #92400e; margin: 28px 0 18px; padding: 10px 15px; background: #fffbeb; border-left: 4px solid #f59e0b;",
      h3: "font-size: 16px; font-weight: 600; color: #b45309; margin: 22px 0 12px; padding-left: 15px; border-left: 3px solid #f59e0b;",
      h4: "font-size: 15px; font-weight: 600; color: #f59e0b; margin: 18px 0 10px;",
      p: "margin: 18px 0; text-align: justify;",
      strong: "font-weight: 600; color: #92400e;",
      em: "font-style: italic; color: #78716c;",
      a: "color: #f59e0b; text-decoration: none; border-bottom: 1px dashed #f59e0b;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #fffbeb; border-left: 4px solid #f59e0b; color: #57534e; font-style: italic;",
      code: "background: #fffbeb; color: #92400e; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #451a03; color: #fcd34d; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 18px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 18px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 4px; margin: 25px auto; display: block; border: 2px solid #fde68a;",
      hr: "border: none; height: 1px; background: #f59e0b; margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: #f59e0b; color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #fde68a; padding: 12px; background: #fffbeb;",
    },
  },
  // 样式23: 电商零售
  {
    name: "电商零售",
    id: "ecommerce-retail",
    category: "industry",
    preview: "#e11d48",
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif; font-size: 16px; color: #334155; line-height: 1.8; padding: 20px;",
      h1: "font-size: 24px; font-weight: 700; color: #fff; margin: 30px 0 25px; padding: 18px 25px; background: linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%); border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(225, 29, 72, 0.3);",
      h2: "font-size: 18px; font-weight: 600; color: #e11d48; margin: 28px 0 18px; padding: 12px 20px; background: linear-gradient(90deg, #fff1f2, transparent); border-left: 4px solid #e11d48; border-radius: 0 8px 8px 0;",
      h3: "font-size: 16px; font-weight: 600; color: #be123c; margin: 22px 0 12px; padding: 8px 20px; background: #fff1f2; border-radius: 20px; display: inline-block;",
      h4: "font-size: 15px; font-weight: 600; color: #e11d48; margin: 18px 0 10px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #e11d48;",
      em: "font-style: italic; color: #64748b;",
      a: "color: #e11d48; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #fff1f2; border-left: 4px solid #e11d48; border-radius: 0 8px 8px 0; color: #475569;",
      code: "background: #fff1f2; color: #e11d48; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #4c0519; color: #fda4af; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 12px; margin: 25px auto; display: block; box-shadow: 0 4px 20px rgba(225, 29, 72, 0.15);",
      hr: "border: none; height: 2px; background: linear-gradient(to right, transparent, #e11d48, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px; border-radius: 12px; overflow: hidden;",
      th: "background: linear-gradient(135deg, #e11d48, #f43f5e); color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #fecdd3; padding: 12px; background: #fff1f2;",
    },
  },
  // 样式24: 法律政务
  {
    name: "法律政务",
    id: "legal-government",
    category: "industry",
    preview: "#7c2d12",
    styles: {
      container:
        "font-family: 'SimSun', 'PingFang SC', 'Microsoft YaHei', serif; font-size: 16px; color: #1c1917; line-height: 2; padding: 20px;",
      h1: "font-size: 24px; font-weight: 700; color: #7c2d12; text-align: center; margin: 30px 0 25px; padding: 15px 30px; border: 2px solid #7c2d12; letter-spacing: 2px;",
      h2: "font-size: 18px; font-weight: 600; color: #7c2d12; margin: 28px 0 18px; padding: 10px 15px; background: #fef3c7; border-left: 4px solid #7c2d12;",
      h3: "font-size: 16px; font-weight: 600; color: #92400e; margin: 22px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #7c2d12;",
      h4: "font-size: 15px; font-weight: 600; color: #7c2d12; margin: 18px 0 10px;",
      p: "margin: 18px 0; text-align: justify; text-indent: 2em;",
      strong: "font-weight: 600; color: #7c2d12;",
      em: "font-style: italic; color: #78716c;",
      a: "color: #7c2d12; text-decoration: underline;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: #fefce8; border-left: 4px solid #7c2d12; color: #44403c;",
      code: "background: #fef3c7; color: #7c2d12; padding: 3px 8px; border-radius: 2px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #292524; color: #fef3c7; padding: 20px; border-radius: 4px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 18px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 18px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; margin: 25px auto; display: block; border: 1px solid #d6d3d1;",
      hr: "border: none; height: 1px; background: #7c2d12; margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: #7c2d12; color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #d6d3d1; padding: 12px;",
    },
  },
  // 样式25: 读书笔记 - 胶囊标题
  {
    name: "读书笔记",
    id: "reading-notes",
    category: "creative",
    preview: "#1e3a5f",
    colorFollowable: true,
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 16px; color: #333; line-height: 1.9; padding: 20px;",
      h1: "font-size: 20px; font-weight: 600; color: #fff; text-align: center; margin: 35px auto 25px; padding: 16px 40px; background: #1e3a5f; border-radius: 50px; display: table; box-shadow: 0 2px 10px rgba(30, 58, 95, 0.2);",
      h2: "font-size: 18px; font-weight: 600; color: #fff; text-align: center; margin: 30px auto 20px; padding: 14px 35px; background: #2d5a87; border-radius: 50px; display: table;",
      h3: "font-size: 16px; font-weight: 600; color: #1e3a5f; margin: 25px 0 15px; padding: 10px 20px; background: #e8f0f8; border-radius: 8px; display: inline-block;",
      h4: "font-size: 15px; font-weight: 600; color: #1e3a5f; margin: 20px 0 12px; padding-left: 12px; border-left: 3px solid #1e3a5f;",
      p: "margin: 18px 0; text-align: justify; text-indent: 2em;",
      strong: "font-weight: 600; color: #1e3a5f;",
      em: "font-style: italic; color: #666; background: linear-gradient(transparent 60%, #fef08a 60%); padding: 0 2px;",
      a: "color: #1e3a5f; text-decoration: none; border-bottom: 1px solid #1e3a5f;",
      blockquote:
        "margin: 25px 0; padding: 20px 25px; background: #f8fafc; border-left: 4px solid #1e3a5f; border-radius: 0 8px 8px 0; color: #475569; font-style: italic;",
      code: "background: #e8f0f8; color: #1e3a5f; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 18px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 18px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 12px 0;",
      img: "max-width: 100%; border-radius: 8px; margin: 25px auto; display: block; box-shadow: 0 2px 10px rgba(0,0,0,0.1);",
      hr: "border: none; height: 1px; background: linear-gradient(to right, transparent, #1e3a5f, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px;",
      th: "background: #1e3a5f; color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #e2e8f0; padding: 12px;",
    },
  },
  // 样式26: 知识卡片 - 圆角卡片风格
  {
    name: "知识卡片",
    id: "knowledge-card",
    category: "creative",
    preview: "#3b82f6",
    colorFollowable: true,
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif; font-size: 16px; color: #334155; line-height: 1.85; padding: 20px;",
      h1: "font-size: 20px; font-weight: 600; color: #fff; text-align: center; margin: 35px auto 25px; padding: 16px 50px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 50px; display: table; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);",
      h2: "font-size: 18px; font-weight: 600; color: #fff; text-align: center; margin: 30px auto 20px; padding: 12px 30px; background: #3b82f6; border-radius: 30px; display: table;",
      h3: "font-size: 16px; font-weight: 600; color: #1d4ed8; margin: 25px 0 15px; padding: 8px 16px; background: #eff6ff; border-radius: 6px; display: inline-block;",
      h4: "font-size: 15px; font-weight: 600; color: #3b82f6; margin: 20px 0 12px;",
      p: "margin: 16px 0; text-align: justify;",
      strong: "font-weight: 600; color: #1d4ed8;",
      em: "font-style: italic; color: #64748b;",
      a: "color: #3b82f6; text-decoration: none;",
      blockquote:
        "margin: 22px 0; padding: 18px 22px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 12px; color: #475569; border-left: 4px solid #3b82f6;",
      code: "background: #eff6ff; color: #1d4ed8; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px;",
      pre: "background: #1e3a8a; color: #bfdbfe; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 16px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 16px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 10px 0;",
      img: "max-width: 100%; border-radius: 12px; margin: 25px auto; display: block; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.15);",
      hr: "border: none; height: 2px; background: linear-gradient(to right, transparent, #3b82f6, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px; border-radius: 12px; overflow: hidden;",
      th: "background: #3b82f6; color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #dbeafe; padding: 12px; background: #f8fafc;",
    },
  },
  // 样式27: 成长日记 - 温暖风格
  {
    name: "成长日记",
    id: "growth-diary",
    category: "creative",
    preview: "#ea580c",
    colorFollowable: true,
    styles: {
      container:
        "font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif; font-size: 16px; color: #422006; line-height: 1.9; padding: 20px; background: #fffbeb;",
      h1: "font-size: 20px; font-weight: 600; color: #fff; text-align: center; margin: 35px auto 25px; padding: 16px 40px; background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); border-radius: 50px; display: table; box-shadow: 0 4px 15px rgba(234, 88, 12, 0.25);",
      h2: "font-size: 18px; font-weight: 600; color: #fff; text-align: center; margin: 30px auto 20px; padding: 12px 30px; background: #f97316; border-radius: 30px; display: table;",
      h3: "font-size: 16px; font-weight: 600; color: #c2410c; margin: 25px 0 15px; padding: 8px 16px; background: #fff; border-radius: 8px; display: inline-block; border: 1px solid #fed7aa;",
      h4: "font-size: 15px; font-weight: 600; color: #ea580c; margin: 20px 0 12px;",
      p: "margin: 18px 0; text-align: justify;",
      strong: "font-weight: 600; color: #c2410c;",
      em: "font-style: italic; color: #78716c; background: linear-gradient(transparent 60%, #fef08a 60%); padding: 0 2px;",
      a: "color: #ea580c; text-decoration: none;",
      blockquote:
        "margin: 25px 0; padding: 20px 25px; background: #fff; border-left: 4px solid #f97316; border-radius: 0 12px 12px 0; color: #57534e;",
      code: "background: #fff; color: #c2410c; padding: 3px 8px; border-radius: 4px; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 14px; border: 1px solid #fed7aa;",
      pre: "background: #431407; color: #fed7aa; padding: 20px; border-radius: 12px; overflow-x: auto; margin: 22px 0; font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 13px; line-height: 1.7;",
      ul: "margin: 18px 0; padding-left: 25px; list-style-type: disc;",
      ol: "margin: 18px 0; padding-left: 25px; list-style-type: decimal;",
      li: "margin: 12px 0;",
      img: "max-width: 100%; border-radius: 12px; margin: 25px auto; display: block; border: 2px solid #fed7aa;",
      hr: "border: none; height: 2px; background: linear-gradient(to right, transparent, #f97316, transparent); margin: 35px 0;",
      table: "width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 14px; border-radius: 12px; overflow: hidden;",
      th: "background: #f97316; color: white; padding: 14px; text-align: left;",
      td: "border: 1px solid #fed7aa; padding: 12px; background: #fff;",
    },
  },
];

// 分类定义
export const categories = [
  { id: "classic", name: "经典" },
  { id: "modern", name: "现代" },
  { id: "creative", name: "创意" },
  { id: "minimal", name: "极简" },
  { id: "dark", name: "暗色" },
  { id: "industry", name: "行业" },
];
