export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Beautiful Logo Icon */}
            <div className="relative">
              {/* Glow effect behind */}
              <div className="absolute inset-0 bg-purple-500/40 rounded-2xl blur-xl" />

              {/* Main icon */}
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40">
                {/* Chat bubble with Y */}
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
                  {/* Speech bubble */}
                  <path
                    d="M12 3C7 3 3 6.5 3 11c0 2.5 1.2 4.7 3 6.2V21l3.5-2.1c.8.2 1.6.3 2.5.3 5 0 9-3.5 9-8s-4-8-9-8z"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Y letter */}
                  <text
                    x="12"
                    y="13"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="9"
                    fontWeight="600"
                    fontStyle="italic"
                  >
                    Y
                  </text>
                </svg>
              </div>

              {/* Online indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-[3px] border-black" />
            </div>

            {/* Script/Cursive Style Text */}
            <span
              className="text-3xl text-white italic"
              style={{
                fontFamily: "'Brush Script MT', 'Segoe Script', 'Bradley Hand', cursive",
                fontWeight: 400,
                letterSpacing: '0.02em',
                textShadow: '0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)'
              }}
            >
              Yapper
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] rounded-full border border-white/[0.08]">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/60 text-sm font-light">Online</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
