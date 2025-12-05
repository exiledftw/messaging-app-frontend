"use client"

type Props = {
  onStartClick: () => void
}

export default function Hero({ onStartClick }: Props) {
  return (
    <section className="min-h-[calc(100vh-64px)] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-black overflow-hidden">
        {/* Bloom orb 1 - top left */}
        <div
          className="absolute w-[600px] h-[600px] bg-purple-600/[0.12] rounded-full blur-[120px]"
          style={{
            top: '-100px',
            left: '10%',
            animation: 'floatOne 25s ease-in-out infinite'
          }}
        />
        {/* Bloom orb 2 - bottom right */}
        <div
          className="absolute w-[500px] h-[500px] bg-violet-500/[0.10] rounded-full blur-[100px]"
          style={{
            bottom: '-100px',
            right: '10%',
            animation: 'floatTwo 20s ease-in-out infinite'
          }}
        />
        {/* Bloom orb 3 - center */}
        <div
          className="absolute w-[400px] h-[400px] bg-purple-400/[0.08] rounded-full blur-[80px]"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulseCenter 12s ease-in-out infinite'
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] backdrop-blur-sm rounded-full border border-white/[0.08] text-white/70 text-sm">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            Real-time messaging
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.1] tracking-tight">
            <span className="text-white">Start</span>
            <br />
            {/* Yapping with moving glow effect */}
            <span className="relative inline-block">
              <span
                className="relative z-10"
                style={{
                  background: 'linear-gradient(90deg, #a78bfa, #c4b5fd, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(167, 139, 250, 0.5)) drop-shadow(0 0 40px rgba(167, 139, 250, 0.3))'
                }}
              >
                Yapping
              </span>
              {/* Moving shine effect */}
              <span
                className="absolute inset-0 z-20 overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%, transparent 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2.5s linear infinite'
                }}
                aria-hidden="true"
              >
                Yapping
              </span>
            </span>
            <br />
            <span className="text-white">Today</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-md mx-auto leading-relaxed font-light">
            Create rooms, invite friends, and chat in real-time.
            Secure, fast, and beautifully simple.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <button
              onClick={onStartClick}
              className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full font-medium text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Get Started
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="pt-16 flex items-center justify-center gap-12 md:gap-16">
            <div className="text-center">
              <p className="text-3xl font-medium text-white">∞</p>
              <p className="text-sm text-white/30 mt-1">Rooms</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-3xl font-medium text-white">⚡</p>
              <p className="text-sm text-white/30 mt-1">Instant</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-3xl font-medium text-white">🔒</p>
              <p className="text-sm text-white/30 mt-1">Secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global keyframes */}
      <style>{`
        @keyframes floatOne {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, 40px) scale(1.1); }
          50% { transform: translate(-40px, 80px) scale(0.95); }
          75% { transform: translate(-80px, -40px) scale(1.05); }
        }
        
        @keyframes floatTwo {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-70px, -50px) scale(1.15); }
          66% { transform: translate(60px, 60px) scale(0.9); }
        }
        
        @keyframes pulseCenter {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.4;
          }
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  )
}
