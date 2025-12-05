export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-white font-bold text-xl">Y</span>
              </div>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Yapper
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] rounded-full">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-white/60 text-sm">Online</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
