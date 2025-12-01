export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-violet-950/95 via-purple-900/95 to-fuchsia-950/95 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40 animate-pulse">
                <span className="text-white font-black text-xl">Y</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-violet-950 animate-bounce"></div>
            </div>
            <span className="font-black text-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-violet-400 bg-clip-text text-transparent tracking-tight">
              Yapper
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
