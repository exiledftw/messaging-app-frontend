export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Unique Logo Icon - Stylized Y with speech bubble */}
            <div className="relative group">
              <div className="w-11 h-11 relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 rounded-2xl opacity-80 blur-sm group-hover:blur-md group-hover:opacity-100 transition-all duration-300" />

                {/* Main icon container */}
                <div className="relative w-full h-full bg-gradient-to-br from-purple-500 via-violet-500 to-purple-700 rounded-2xl flex items-center justify-center overflow-hidden">
                  {/* Inner highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl" />

                  {/* Stylized Y as a chat/speech symbol */}
                  <svg viewBox="0 0 32 32" className="w-6 h-6 relative z-10">
                    {/* Speech bubble outline */}
                    <path
                      d="M16 4C9.4 4 4 8.5 4 14c0 3 1.5 5.7 4 7.5V28l5-3.5c1 .3 2 .5 3 .5 6.6 0 12-4.5 12-10S22.6 4 16 4z"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-60"
                    />
                    {/* Y letter inside */}
                    <text
                      x="16"
                      y="17"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="system-ui"
                      fontStyle="italic"
                    >
                      Y
                    </text>
                  </svg>
                </div>
              </div>

              {/* Pulse dot */}
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-40" />
                <div className="relative w-full h-full bg-green-400 rounded-full border-2 border-black" />
              </div>
            </div>

            {/* Neon Italic Modern Typography */}
            <div className="relative">
              <span
                className="font-black text-2xl italic tracking-tight"
                style={{
                  fontFamily: "'Segoe UI', system-ui, sans-serif",
                  background: 'linear-gradient(135deg, #ffffff 0%, #e8d5ff 50%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))',
                  letterSpacing: '-0.02em'
                }}
              >
                Yapper
              </span>
            </div>
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
