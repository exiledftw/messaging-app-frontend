"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import RoomsList from "../components/RoomsList"
import CreateRoomModal from "../components/CreateRoomModal"
import JoinRoomModal from "../components/JoinRoomModal"
import UserHeader from "../components/UserHeader"
import { roomService } from "../services/api"
import "../styles/rooms.css"

export default function RoomsPage({ user, rooms, setRooms }) {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)

  const handleCreateRoom = async (roomName) => {
    try {
      // Prefer creating the room server-side so the join key is available to other clients
      const created = await roomService.createRoom(roomName, user.id)

      const newRoom = {
        id: String(created.id),
        name: created.name,
        key: created.key,
        members: [user],
        createdAt: created.created_at,
        messages: created.last_messages || [],
      }

      setRooms((prev) => [...prev, newRoom])
      setShowCreateModal(false)
    } catch (e) {
      console.error("Failed to create room on server, falling back to local:", e)

      // fallback to local-only room so UX isn't blocked
      const newRoom = {
        id: Date.now().toString(),
        name: roomName,
        key: Math.random().toString(36).substring(2, 9).toUpperCase(),
        members: [user],
        createdAt: new Date().toISOString(),
        messages: [],
      }
      setRooms((prev) => [...prev, newRoom])
      setShowCreateModal(false)
    }
  }

  const handleJoinRoom = async (roomKey) => {
    try {
      // Call backend join endpoint which looks up room by key
      const room = await roomService.joinRoom(roomKey, user.id)

      // If backend returned a room, add it locally (if not present) and navigate
      const exists = rooms.find((r) => String(r.id) === String(room.id))
      if (!exists) {
        const newRoom = {
          id: String(room.id),
          name: room.name,
          key: room.key,
          members: [user],
          createdAt: room.created_at,
          messages: room.last_messages || [],
        }
        setRooms([...rooms, newRoom])
      }

      setShowJoinModal(false)
      navigate(`/chat/${room.id}`)
    } catch (e) {
      console.error("Failed to join room:", e)
      alert(e?.message || "Room key not found")
    }
  }

  const handleRoomClick = (roomId) => {
    navigate(`/chat/${roomId}`)
  }

  return (
  <div className="min-h-screen bg-linear-to-br from-navy-950 via-navy-900 to-navy-950">
      <UserHeader user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-white text-navy-950 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                + Create Room
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="w-full bg-navy-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-navy-700 transition-colors border border-navy-700"
              >
                Join Room
              </button>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="flex-1">
            <RoomsList rooms={rooms} user={user} onRoomClick={handleRoomClick} />
          </div>
        </div>
      </main>

      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} onCreateRoom={handleCreateRoom} />}

      {showJoinModal && <JoinRoomModal onClose={() => setShowJoinModal(false)} onJoinRoom={handleJoinRoom} />}
    </div>
  )
}
