"use client"

export default function Hero({ onStartClick }) {
  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-20 bg-white">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold text-navy-950 leading-tight">
          Connect instantly.
          <br />
          <span className="bg-gradient-to-r from-navy-950 to-navy-600 bg-clip-text text-transparent">
            Chat seamlessly.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
          Experience real-time conversations with friends and colleagues. Create rooms, share keys, and start chatting
          in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={onStartClick}
            className="px-8 py-3 bg-navy-950 text-white rounded-full font-semibold hover:bg-navy-800 transition-colors"
          >
            Get Started
          </button>
          <button className="px-8 py-3 bg-gray-100 text-navy-950 rounded-full font-semibold hover:bg-gray-200 transition-colors">
            Learn More
          </button>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-4 md:gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-navy-950">∞</p>
            <p className="text-sm text-gray-600 mt-2">Unlimited Rooms</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-navy-950">⚡</p>
            <p className="text-sm text-gray-600 mt-2">Instant Messaging</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-navy-950">🔒</p>
            <p className="text-sm text-gray-600 mt-2">Secure & Private</p>
          </div>
        </div>
      </div>
    </section>
  )
}
