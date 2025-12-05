"use client"

type Props = {
  onStartClick: () => void
}

export default function Hero({ onStartClick }: Props) {
  return (
    <section className="min-h-[calc(100vh-64px)] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/[0.08] rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/[0.06] rounded-full blur-[100px] animate-float-medium" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[80px] animate-pulse-slow" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] backdrop-blur-sm rounded-full border border-white/[0.08] text-white/70 text-sm">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            Real-time messaging
          </div>

          {/* Main heading - Apple style */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.1] tracking-tight">
            <span className="text-white">Start</span>
            <br />
            <span className="relative inline-block">
              {/* Neon glow text */}
              <span className="neon-text bg-gradient-to-r from-purple-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
                Yapping
              </span>
              {/* Moving glow overlay */}
              <span className="absolute inset-0 neon-glow bg-gradient-to-r from-transparent via-purple-400/80 to-transparent bg-clip-text text-transparent" aria-hidden="true">
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

          {/* Stats - minimal */}
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

      {/* Neon glow animation styles */}
      <style jsx>{`
        .neon-text {
          filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.4)) 
                  drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))
                  drop-shadow(0 0 40px rgba(168, 85, 247, 0.2));
        }
        
        .neon-glow {
          animation: neon-sweep 3s ease-in-out infinite;
          background-size: 200% 100%;
        }
        
        @keyframes neon-sweep {
          0%, 100% {
            background-position: -100% 0;
            opacity: 0;
          }
          50% {
            background-position: 200% 0;
            opacity: 1;
          }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -20px) scale(1.05);
          }
          50% {
            transform: translate(-20px, 30px) scale(0.95);
          }
          75% {
            transform: translate(-30px, -10px) scale(1.02);
          }
        }
        
        @keyframes float-medium {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-40px, 20px) scale(1.08);
          }
          66% {
            transform: translate(30px, -30px) scale(0.92);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }
      `}</style>
    </section>
  )
}

