"use client"

import { useState } from "react"

export default function ChatHeader({ room, user, onBackClick }) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <header className="bg-navy-900/50 backdrop-blur-md border-b border-navy-800/50 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBackClick} className="text-gray-400 hover:text-white transition-colors">
              ← Back
            </button>
            <div>
              <h1 className="text-white font-semibold text-lg">{room.name}</h1>
              <p className="text-sm text-gray-400">{room.members.length} members</p>
            </div>
          </div>

          <button onClick={() => setShowInfo(!showInfo)} className="text-gray-400 hover:text-white transition-colors">
            ℹ️
          </button>
        </div>

        {showInfo && (
          <div className="mt-4 pt-4 border-t border-navy-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Room Key</p>
                <p className="text-white font-mono font-semibold">{room.key}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Members</p>
                <div className="flex gap-2 mt-1">
                  {room.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 bg-gradient-to-br from-blue-400 to-navy-600 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                      title={`${member.firstName} ${member.lastName}`}
                    >
                      {member.initials}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
