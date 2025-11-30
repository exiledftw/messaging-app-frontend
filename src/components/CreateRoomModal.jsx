"use client"

import { useState } from "react"

export default function CreateRoomModal({ onClose, onCreateRoom }) {
  const [roomName, setRoomName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!roomName.trim()) {
      setError("Please enter a room name")
      return
    }

    onCreateRoom(roomName.trim())
    setRoomName("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-navy-800 rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 border border-navy-700">
        <div>
          <h2 className="text-2xl font-bold text-white">Create a Room</h2>
          <p className="text-gray-400 mt-2">Give your room a name to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Design Team"
              className="w-full px-4 py-2 bg-navy-900 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              autoFocus
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <p className="text-sm text-gray-400">You'll get a unique key to share with others</p>

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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
