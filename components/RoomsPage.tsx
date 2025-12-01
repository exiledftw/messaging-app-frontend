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
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <UserHeader user={user} onLogout={onLogout} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="flex flex-col gap-4 sticky top-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4">
                <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">Quick Actions</h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 text-white font-bold py-4 px-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Room
                </button>
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold py-4 px-4 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Join Room
                </button>
              </div>
              
              {/* Stats card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">Your Stats</span>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Active Rooms</span>
                    <span className="text-white font-bold">{rooms.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Status</span>
                    <span className="text-green-400 font-medium text-sm">Online</span>
                  </div>
                </div>
              </div>
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
