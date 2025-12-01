"use client"

import { useState } from "react"

type Member = {
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
  members?: Member[]
}

type Props = {
  room: Room
  user: any
  onBackClick: () => void
}

// Helper to get member display name
const getMemberName = (member: Member): string => {
  const first = member.firstName || member.first_name || ''
  const last = member.lastName || member.last_name || ''
  if (first || last) return `${first} ${last}`.trim()
  return member.username || 'Unknown'
}

// Helper to get member initials
const getMemberInitials = (member: Member): string => {
  if (member.initials) return member.initials
  const first = member.firstName || member.first_name || ''
  const last = member.lastName || member.last_name || ''
  if (first && last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
  if (first) return first.charAt(0).toUpperCase()
  if (member.username) return member.username.charAt(0).toUpperCase()
  return '?'
}

export default function ChatHeader({ room, user, onBackClick }: Props) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <header className="shrink-0 bg-black/20 backdrop-blur-xl border-b border-white/10 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackClick} 
              className="group flex items-center gap-2 text-white/70 hover:text-white transition-all duration-200"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div className="h-8 w-px bg-white/20"></div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-white font-bold text-lg">{room.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">{room.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-sm text-white/60">{room.members?.length || 0} members online</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
              <span className="text-white/50 text-xs">Key:</span>
              <span className="text-pink-400 font-mono font-bold text-sm">{room.key}</span>
            </div>
            
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                showInfo ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expandable Info Panel */}
        <div className={`overflow-hidden transition-all duration-300 ${showInfo ? 'max-h-80 mt-4 pt-4 border-t border-white/10' : 'max-h-0'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Room Key</p>
              <div className="flex items-center gap-2">
                <p className="text-white font-mono font-bold text-lg bg-white/10 px-3 py-1.5 rounded-lg">{room.key}</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(room.key)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/60 hover:text-white transition-all"
                  title="Copy to clipboard"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Members ({room.members?.length || 0})</p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {room.members?.map((member: Member, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {getMemberInitials(member)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {getMemberName(member)}
                      </p>
                      <p className="text-white/40 text-xs">Member</p>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
