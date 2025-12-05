"use client"

import { useState } from "react"

type Member = {
  id?: number
  firstName?: string
  lastName?: string
  first_name?: string
  last_name?: string
  initials?: string
  username?: string
}

type Room = {
  id: string | number
  name: string
  key: string
  creator_id?: number
  members?: Member[]
}

type Props = {
  room: Room
  user: any
  onBackClick: () => void
  onlineUsers?: string[]
}

const getMemberName = (member: Member): string => {
  const first = member.firstName || member.first_name || ''
  const last = member.lastName || member.last_name || ''
  if (first || last) return `${first} ${last}`.trim()
  return member.username || 'Unknown'
}

const getMemberInitials = (member: Member): string => {
  if (member.initials) return member.initials
  const first = member.firstName || member.first_name || ''
  const last = member.lastName || member.last_name || ''
  if (first && last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
  if (first) return first.charAt(0).toUpperCase()
  if (member.username) return member.username.charAt(0).toUpperCase()
  return '?'
}

export default function ChatHeader({ room, user, onBackClick, onlineUsers = [] }: Props) {
  const [showInfo, setShowInfo] = useState(false)
  const [copied, setCopied] = useState(false)

  const isOwner = user && room.creator_id && Number(user.id) === Number(room.creator_id)

  const isMemberOnline = (member: Member): boolean => {
    const memberId = member.id || (typeof member === 'object' && 'user' in member ? (member as { user: { id: number } }).user?.id : null)
    if (!memberId) return false
    return onlineUsers.includes(String(memberId))
  }

  const onlineCount = room.members?.filter(m => isMemberOnline(m)).length || 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(room.key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  const handleRename = async () => {
    const newName = prompt('Enter new room name:', room.name)
    if (!newName || newName.trim() === '' || newName === room.name) return
    try {
      const { roomService } = await import('@/lib/api-service')
      await roomService.renameRoom(room.id, newName.trim(), user?.id)
      window.location.reload()
    } catch (e: any) {
      alert(e.message || 'Could not rename room')
    }
  }

  const handleKick = async (memberId: number) => {
    if (!confirm('Remove this member?')) return
    try {
      const { roomService } = await import('@/lib/api-service')
      await roomService.kickMember(room.id, memberId, user?.id)
      window.location.reload()
    } catch (e: any) {
      alert(e.message || 'Could not remove member')
    }
  }

  const handleBan = async (memberId: number) => {
    if (!confirm('Ban this member?')) return
    try {
      const { roomService } = await import('@/lib/api-service')
      await roomService.banMember(room.id, memberId, user?.id)
      window.location.reload()
    } catch (e: any) {
      alert(e.message || 'Could not ban member')
    }
  }

  return (
    <>
      {/* Header - Apple style minimal */}
      <header className="shrink-0 bg-black/40 backdrop-blur-2xl border-b border-white/[0.06] z-40 pt-[env(safe-area-inset-top)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">

            {/* Left section */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBackClick}
                className="group flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium hidden sm:inline">Back</span>
              </button>

              <div className="w-px h-6 bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-3">
                {/* Room avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <span className="text-white font-semibold text-sm">{room.name.charAt(0).toUpperCase()}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-white font-semibold text-base tracking-tight">{room.name}</h1>
                    {isOwner && (
                      <button
                        onClick={handleRename}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Rename"
                      >
                        <svg className="w-3 h-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${onlineCount > 0 ? 'bg-green-400' : 'bg-white/20'}`} />
                    <span className="text-xs text-white/40">
                      {onlineCount} online · {room.members?.length || 0} members
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Room key badge */}
              <button
                onClick={handleCopy}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] rounded-lg border border-white/[0.06] transition-all group"
              >
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Key</span>
                <span className="text-xs font-mono text-purple-400 font-medium">{room.key}</span>
                {copied ? (
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

              {/* Info button */}
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${showInfo
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Info panel - slide down */}
      <div className={`overflow-hidden transition-all duration-300 ease-out bg-black/20 backdrop-blur-xl border-b border-white/[0.06] ${showInfo ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Room Key section */}
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Room Key</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono text-purple-400 bg-white/[0.04] px-3 py-1.5 rounded-lg">{room.key}</code>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Members section */}
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Members · {room.members?.length || 0}</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {room.members?.map((member: Member, idx: number) => {
                  const memberId = member.id || (typeof member === 'object' && 'user' in member ? (member as { user: { id: number } }).user?.id : null)
                  const memberIsOwner = memberId && String(memberId) === String(room.creator_id)
                  const isOnline = isMemberOnline(member)

                  return (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition-colors group">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/80 to-violet-600/80 flex items-center justify-center">
                          <span className="text-[10px] font-semibold text-white">{getMemberInitials(member)}</span>
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black ${isOnline ? 'bg-green-400' : 'bg-white/20'
                          }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 font-medium truncate flex items-center gap-1.5">
                          {getMemberName(member)}
                          {memberIsOwner && <span className="text-[10px] text-purple-400">Owner</span>}
                          {isOnline && String(memberId) === String(user?.id) && (
                            <span className="text-[10px] text-white/30">You</span>
                          )}
                        </p>
                        <p className="text-[10px] text-white/30">{isOnline ? 'Online' : 'Offline'}</p>
                      </div>

                      {isOwner && !memberIsOwner && memberId && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleKick(memberId)}
                            className="px-2 py-1 text-[10px] text-orange-400 hover:bg-orange-500/10 rounded transition-colors"
                          >
                            Kick
                          </button>
                          <button
                            onClick={() => handleBan(memberId)}
                            className="px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            Ban
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
