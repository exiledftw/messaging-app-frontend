export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* WhatsApp-style Chat Bubble Logo */}
            <div className="relative">
              {/* Purple glow behind */}
              <div className="absolute inset-0 bg-purple-500/50 rounded-full blur-lg scale-125" />

              {/* Chat bubble - WhatsApp style */}
              <svg viewBox="0 0 40 40" className="w-10 h-10 relative">
                <defs>
                  <linearGradient id="bubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                {/* Filled speech bubble - WhatsApp shape */}
                <path
                  d="M20 4C11.2 4 4 10.3 4 18c0 3.5 1.4 6.7 3.8 9.2L6 32l5.5-2.5c2.5 1 5.4 1.5 8.5 1.5 8.8 0 16-6.3 16-14S28.8 4 20 4z"
                  fill="url(#bubbleGradient)"
                />
                {/* Y letter inside */}
                <text
                  x="20"
                  y="20"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                >
                  Y
                </text>
              </svg>

              {/* Online dot */}
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
            </div>

            {/* Modern Wide-Spaced Font */}
            <span
              className="text-xl text-white font-medium uppercase"
              style={{
                letterSpacing: '0.35em',
                fontFamily: "'Segoe UI', 'Helvetica Neue', system-ui, sans-serif",
                fontWeight: 300,
                textShadow: '0 0 30px rgba(168, 85, 247, 0.5)'
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
