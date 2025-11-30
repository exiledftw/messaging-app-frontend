"use client"

import { useState } from "react"

export default function UserHeader({ user, onLogout }) {
  const [showLogout, setShowLogout] = useState(false)

  return (
    <header className="bg-navy-900/50 backdrop-blur-md border-b border-navy-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-navy-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.initials}
            </div>
            <div>
              <p className="text-white font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowLogout(!showLogout)}
              className="text-gray-400 hover:text-white transition-colors text-lg"
            >
              ⚙️
            </button>
            {showLogout && (
              <div className="absolute right-0 mt-2 w-48 bg-navy-800 rounded-lg shadow-lg border border-navy-700">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-navy-700 hover:text-white transition-colors rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
