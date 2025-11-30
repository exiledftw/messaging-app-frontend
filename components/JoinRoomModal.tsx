"use client"

import { useState } from "react"

export default function JoinRoomModal({ onClose, onJoinRoom }) {
  const [roomKey, setRoomKey] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!roomKey.trim()) {
      setError("Please enter a room key")
      return
    }

    onJoinRoom(roomKey.trim().toUpperCase())
    setRoomKey("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-navy-800 rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 border border-navy-700">
        <div>
          <h2 className="text-2xl font-bold text-white">Join a Room</h2>
          <p className="text-gray-400 mt-2">Enter the room key to join</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Room Key</label>
            <input
              type="text"
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
              placeholder="ABC123XY"
              className="w-full px-4 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center font-mono text-lg tracking-wider"
              autoFocus
              maxLength={8}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-navy-700 text-white font-semibold py-2 rounded-lg hover:bg-navy-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition-colors"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
