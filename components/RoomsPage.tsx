"use client"

import { useState, useEffect } from "react"
import UserHeader from "@/components/UserHeader"
import RoomsList from "@/components/RoomsList"
import CreateRoomModal from "@/components/CreateRoomModal"
import JoinRoomModal from "@/components/JoinRoomModal"
import { roomService, mapServerMessage } from "@/lib/api-service"

type RoomsPageProps = {
  user: any
  rooms: any[]
  setRooms: (rooms: any[]) => void
  onRoomClick: (roomId: any) => void
  onLogout: () => void
}

export default function RoomsPage({ user, rooms, setRooms, onRoomClick, onLogout }: RoomsPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)

  const handleCreateRoom = async (roomName: string) => {
    try {
      const created = await roomService.createRoom(roomName, user.id)
      if (created) {
        // Ensure we keep the shape expected by client
          const userFullName = user?.firstName ? `${user.firstName} ${user.lastName}` : user?.id
          const newRoom = {
          id: created.id,
          name: created.name,
          key: created.key,
          members: created.members || [user],
          createdAt: created.created_at || new Date().toISOString(),
          messages: (created.last_messages || []).map((m: any) => {
            const mm = mapServerMessage(m)
            mm.isMine = mm.sender?.id === userFullName
            return mm
          }),
        }
        setRooms([...rooms, newRoom])
      }
    } catch (e) {
      console.error("Create room failed", e)
      alert("Failed to create room. Check server logs or network.")
    } finally {
      setShowCreateModal(false)
    }
  }

  const handleJoinRoom = async (roomKey: string) => {
    try {
      const joined = await roomService.joinRoom(roomKey, user.id)
      if (joined) {
        // replace or append the room returned by API
  const idx = rooms.findIndex((r: any) => r.id === joined.id)
  const userFullName = user?.firstName ? `${user.firstName} ${user.lastName}` : user?.id
  const clientRoom = {
          id: joined.id,
          name: joined.name,
          key: joined.key,
          members: joined.members || [user],
          createdAt: joined.created_at || new Date().toISOString(),
          messages: (joined.last_messages || []).map((m: any) => {
            const mm = mapServerMessage(m)
            mm.isMine = mm.sender?.id === userFullName
            return mm
          }),
        }
        if (idx >= 0) {
          const copy = [...rooms]
          copy[idx] = clientRoom
          setRooms(copy)
        } else {
          setRooms([...rooms, clientRoom])
        }
        setShowJoinModal(false)
      }
    } catch (e) {
      console.error("Join room failed", e)
      alert("Failed to join room. Check key or server logs.")
    }
  }

  useEffect(() => {
    // Fetch rooms from backend when user is present
    const loadRooms = async () => {
      if (!user) return
      try {
        const fetched = await roomService.getRooms(user.id)
        if (Array.isArray(fetched)) {
          const userFullName = user?.firstName ? `${user.firstName} ${user.lastName}` : user?.id
          // map to client shape
          const mapped = fetched.map((r) => ({
            id: r.id,
            name: r.name,
            key: r.key,
            members: r.members || [],
            createdAt: r.created_at || new Date().toISOString(),
            messages: (r.last_messages || []).map((m: any) => {
              const mm = mapServerMessage(m)
              mm.isMine = mm.sender?.id === userFullName
              return mm
            }),
          }))
          setRooms(mapped)
        }
      } catch (e) {
        console.error("Failed to load rooms", e)
      }
    }
    loadRooms()
  }, [user])

  return (
  <div className="min-h-screen bg-linear-to-br from-navy-950 via-navy-900 to-navy-950">
      <UserHeader user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="flex flex-col gap-3 sticky top-8">
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
            <RoomsList rooms={rooms} user={user} onRoomClick={onRoomClick} />
          </div>
        </div>
      </main>

      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} onCreateRoom={handleCreateRoom} />}

      {showJoinModal && <JoinRoomModal onClose={() => setShowJoinModal(false)} onJoinRoom={handleJoinRoom} />}
    </div>
  )
}
