"use client";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const features = [
    {
      icon: "🎨",
      title: "18+ 精美主题",
      desc: "经典、现代、创意、极简、暗色等多种风格",
    },
    {
      icon: "✨",
      title: "自定义样式",
      desc: "自由调整主题色、字号、行高",
    },
    {
      icon: "👀",
      title: "实时预览",
      desc: "左右分栏，所见即所得",
    },
    {
      icon: "📋",
      title: "一键复制",
      desc: "直接粘贴到公众号后台",
    },
    {
      icon: "📝",
      title: "智能粘贴",
      desc: "支持从飞书等富文本编辑器粘贴",
    },
    {
      icon: "🔄",
      title: "同步滚动",
      desc: "编辑区与预览区联动滚动",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col">
      {/* 头部 */}
      <header className="py-6 px-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            WX MD Tool
          </span>
          <span className="text-2xl">✨</span>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              微信公众号
            </span>
            <br />
            <span className="text-purple-700">Markdown 排版工具</span>
          </h1>
          <p className="text-lg text-purple-400 mt-4 max-w-md mx-auto">
            让你的文章更加精美，一键复制到公众号
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-2 border-pink-100 hover:border-pink-300 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-bold text-purple-700 mb-1">{feature.title}</h3>
              <p className="text-sm text-purple-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* 开始按钮 */}
        <button
          onClick={onStart}
          className="group relative px-8 py-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <span className="flex items-center gap-2">
            开始使用
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </button>

        {/* 装饰元素 */}
        <div className="mt-8 flex items-center gap-2 text-purple-300">
          <span>免费使用</span>
          <span>•</span>
          <span>无需登录</span>
          <span>•</span>
          <span>即开即用</span>
        </div>
      </main>

      {/* 底部装饰 */}
      <footer className="py-4 text-center text-purple-300 text-sm">
        <p className="flex items-center justify-center gap-1">
          Made with <span className="text-pink-400">💕</span> by xiao阿娜
        </p>
      </footer>

      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
