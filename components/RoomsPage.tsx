"use client"

import { useState, useEffect } from "react"
import UserHeader from "@/components/UserHeader"
import RoomsList from "@/components/RoomsList"
import CreateRoomModal from "@/components/CreateRoomModal"
import JoinRoomModal from "@/components/JoinRoomModal"
import FeedbackModal from "@/components/FeedbackModal"
import EditProfileModal from "@/components/EditProfileModal"
import { roomService, mapServerMessage } from "@/lib/api-service"

const MAX_ROOMS_PER_USER = 3

type RoomsPageProps = {
  user: any
  rooms: any[]
  setRooms: (rooms: any[]) => void
  onRoomClick: (roomId: any) => void
  onLogout: () => void
  onUserUpdate?: (updatedUser: any) => void
}

export default function RoomsPage({ user, rooms, setRooms, onRoomClick, onLogout, onUserUpdate }: RoomsPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [roomStats, setRoomStats] = useState({ created_rooms_count: 0, max_rooms: MAX_ROOMS_PER_USER, can_create: true })
  const [isLoading, setIsLoading] = useState(false)

  // Load room stats
  const loadRoomStats = async () => {
    if (!user) return
    try {
      const stats = await roomService.getRoomStats(user.id)
      if (stats) {
        setRoomStats(stats)
      }
    } catch (e) {
      console.error("Failed to load room stats", e)
    }
  }

  const handleCreateRoom = async (roomName: string) => {
    if (!roomStats.can_create) {
      alert(`You can only create up to ${MAX_ROOMS_PER_USER} rooms. Delete an existing room to create a new one.`)
      return
    }

    setIsLoading(true)
    try {
      const created = await roomService.createRoom(roomName, user.id)
      if (created) {
        const userFullName = user?.firstName ? `${user.firstName} ${user.lastName}` : user?.id
        const newRoom = {
          id: created.id,
          name: created.name,
          key: created.key,
          creator_id: created.creator_id,
          members: created.members || [user],
          createdAt: created.created_at || new Date().toISOString(),
          messages: (created.last_messages || []).map((m: any) => {
            const mm = mapServerMessage(m)
            mm.isMine = mm.sender?.id === userFullName
            return mm
          }),
        }
        setRooms([...rooms, newRoom])
        await loadRoomStats() // Refresh stats
      }
    } catch (e: any) {
      console.error("Create room failed", e)
      alert(e.message || "Failed to create room. You may have reached the 3-room limit.")
    } finally {
      setIsLoading(false)
      setShowCreateModal(false)
    }
  }

  const handleJoinRoom = async (roomKey: string) => {
    setIsLoading(true)
    try {
      const joined = await roomService.joinRoom(roomKey, user.id)
      if (joined) {
        const idx = rooms.findIndex((r: any) => r.id === joined.id)
        const userFullName = user?.firstName ? `${user.firstName} ${user.lastName}` : user?.id
        const clientRoom = {
          id: joined.id,
          name: joined.name,
          key: joined.key,
          creator_id: joined.creator_id,
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
    } catch (e: any) {
      console.error("Join room failed", e)
      alert(e.message || "Failed to join room. Check the room key.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveRoom = async (roomId: string | number) => {
    setIsLoading(true)
    try {
      await roomService.leaveRoom(roomId, user.id)
      // Remove room from list
      setRooms(rooms.filter((r: any) => r.id !== roomId))
    } catch (e: any) {
      console.error("Leave room failed", e)
      alert(e.message || "Failed to leave room.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRoom = async (roomId: string | number) => {
    setIsLoading(true)
    try {
      await roomService.deleteRoom(roomId, user.id)
      // Remove room from list
      setRooms(rooms.filter((r: any) => r.id !== roomId))
      await loadRoomStats() // Refresh stats
    } catch (e: any) {
      console.error("Delete room failed", e)
      alert(e.message || "Failed to delete room.")
    } finally {
      setIsLoading(false)
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
            creator_id: r.creator_id,
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
    loadRoomStats()
  }, [user])

  // Calculate created rooms count from current rooms
  const createdRoomsCount = rooms.filter(r => r.creator_id === user?.id).length
  const canCreate = createdRoomsCount < MAX_ROOMS_PER_USER

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden overflow-y-auto">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-violet-600/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white">Loading...</span>
          </div>
        </div>
      )}

      <UserHeader user={user} onLogout={onLogout} onEditProfile={() => setShowEditProfileModal(true)} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="flex flex-col gap-4 sticky top-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4">
                <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">Quick Actions</h3>

                {/* Create Room Button with limit indicator */}
                <div>
                  <button
                    onClick={() => canCreate ? setShowCreateModal(true) : alert(`You've reached the maximum of ${MAX_ROOMS_PER_USER} rooms. Delete a room to create a new one.`)}
                    disabled={!canCreate}
                    className={`w-full group flex items-center justify-center gap-2 font-bold py-4 px-4 rounded-xl transition-all duration-200 ${canCreate
                      ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Room
                  </button>
                  {/* Room limit indicator */}
                  <p className={`text-xs mt-2 text-center ${canCreate ? 'text-white/40' : 'text-orange-400'}`}>
                    {createdRoomsCount}/{MAX_ROOMS_PER_USER} rooms created
                  </p>
                </div>

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
                    <span className="text-white/50 text-sm">Total Rooms</span>
                    <span className="text-white font-bold">{rooms.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Rooms Created</span>
                    <span className={`font-bold ${createdRoomsCount >= MAX_ROOMS_PER_USER ? 'text-orange-400' : 'text-white'}`}>
                      {createdRoomsCount}/{MAX_ROOMS_PER_USER}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Rooms Joined</span>
                    <span className="text-white font-bold">{rooms.length - createdRoomsCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm">Status</span>
                    <span className="text-green-400 font-medium text-sm">Online</span>
                  </div>
                </div>
              </div>

              {/* Feedback button */}
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-white/5 backdrop-blur-xl text-white/70 font-medium py-3 px-4 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200 border border-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Send Feedback
              </button>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="flex-1">
            <RoomsList
              rooms={rooms}
              user={user}
              onRoomClick={onRoomClick}
              onLeaveRoom={handleLeaveRoom}
              onDeleteRoom={handleDeleteRoom}
            />
          </div>
        </div>
      </main>

      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} onCreateRoom={handleCreateRoom} />}

      {showJoinModal && <JoinRoomModal onClose={() => setShowJoinModal(false)} onJoinRoom={handleJoinRoom} />}

      {showFeedbackModal && <FeedbackModal userId={user.id} onClose={() => setShowFeedbackModal(false)} />}

      {showEditProfileModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfileModal(false)}
          onProfileUpdate={(updatedUser) => {
            onUserUpdate?.(updatedUser)
            setShowEditProfileModal(false)
          }}
        />
      )}
    </div>
  )
}
