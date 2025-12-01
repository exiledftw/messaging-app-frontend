"use client"

import { useState } from "react"

type User = {
  firstName: string
  lastName: string
  initials: string
  username?: string
}

type Props = {
  user: User
  onLogout: () => void
}

export default function UserHeader({ user, onLogout }: Props) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-black text-xl">Y</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">Yapper</h1>
              <p className="text-white/40 text-xs">Chat Dashboard</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user.initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-white font-semibold text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <p className="text-xs text-green-400">Online</p>
                </div>
              </div>
              <svg className={`w-4 h-4 text-white/50 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-violet-950/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-purple-500/20 border border-white/10 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-white/10">
                  <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-white/50 text-sm">@{user.username || 'user'}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  )
}
