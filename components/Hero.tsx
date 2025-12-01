"use client"

type Props = {
  onStartClick: () => void
}

export default function Hero({ onStartClick }: Props) {
  return (
    <section className="min-h-[calc(100vh-64px)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Real-time messaging platform
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
            <span className="text-white">Start</span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
              Yapping
            </span>
            <br />
            <span className="text-white">Today</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto leading-relaxed">
            Create rooms, invite friends, and chat in real-time. 
            <span className="text-pink-400 font-semibold"> Secure, fast, and beautifully simple.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartClick}
              className="group px-10 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 text-white rounded-full font-bold text-lg shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Get Started
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="pt-16 grid grid-cols-3 gap-6 md:gap-12">
            <div className="group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-pink-500/50 transition-colors">
                <span className="text-3xl">∞</span>
              </div>
              <p className="text-white font-bold text-lg">Unlimited</p>
              <p className="text-white/50 text-sm mt-1">Rooms</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-colors">
                <span className="text-3xl">⚡</span>
              </div>
              <p className="text-white font-bold text-lg">Instant</p>
              <p className="text-white/50 text-sm mt-1">Messaging</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-violet-500/50 transition-colors">
                <span className="text-3xl">🔒</span>
              </div>
              <p className="text-white font-bold text-lg">Secure</p>
              <p className="text-white/50 text-sm mt-1">& Private</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
