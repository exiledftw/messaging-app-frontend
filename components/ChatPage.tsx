"use client"

import { useState, useEffect, useRef } from "react"
import ChatHeader from "@/components/ChatHeader"
import ChatMessages from "@/components/ChatMessages"
import ChatInput from "@/components/ChatInput"
import { messageService, createWebSocketConnection, mapServerMessage } from "@/lib/api-service"

export default function ChatPage({ user, room, onBackClick }: any) {
  const userFullName = user?.firstName ? `${user.firstName} ${user.lastName}` : user?.id
  const initialMessages = (room?.messages || []).map((rm: any) => {
    const mm = mapServerMessage(rm)
    mm.isMine = mm.sender?.id === userFullName
    return mm
  })
  const [messages, setMessages] = useState<any[]>(initialMessages || [])
  const socketRef = useRef<WebSocket | null>(null)

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 flex items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
            <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
          <h1 className="text-white text-3xl font-bold mb-3">Room not found</h1>
          <p className="text-white/50 mb-6">This room may have been deleted or doesn't exist.</p>
          <button 
            onClick={onBackClick} 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Rooms
          </button>
        </div>
      </div>
    )
  }

  const handleSendMessage = async (messageText: string) => {
    try {
      // send over REST - backend will broadcast via websocket
  const sent = await messageService.sendMessage(room.id, user.id, messageText, userFullName)
  console.info("Message POST response:", sent)
      // If the websocket broadcast arrives, we'll get the message from it. If WS is not available,
      // the REST response `sent` will be used; we dedupe by id before appending.
      if (sent) {
        const uiMsg = mapServerMessage(sent)
        uiMsg.isMine = uiMsg.sender?.id === userFullName
        setMessages((prev) => (prev.some((m) => m.id === uiMsg.id) ? prev : [...prev, uiMsg]))
      }
    } catch (e) {
      console.error("Send message failed", e)
    }
  }

  useEffect(() => {
    // load initial messages for room
    const load = async () => {
      if (!room) return
      try {
        const fetched = await messageService.getMessages(room.id)
        if (Array.isArray(fetched))
          setMessages(
            fetched.map((m: any) => {
              const msg = mapServerMessage(m)
                  msg.isMine = msg.sender?.id === userFullName
              return msg
            })
          )
      } catch (e) {
        console.error("Could not load messages", e)
      }
    }
    load()

    // connect websocket for live messages
    if (room) {
      try {
            const s = createWebSocketConnection(room.id, (data) => {
              // the backend sends a small message payload {id, user_name, content, created_at}
              const serverMessage = data
              // If the backend wraps, prefer the message key
              const payload = serverMessage.message || serverMessage
              if (payload) {
                const uiMsg = mapServerMessage(payload)
                uiMsg.isMine = uiMsg.sender?.id === userFullName
                setMessages((prev) => (prev.some((m) => m.id === uiMsg.id) ? prev : [...prev, uiMsg]))
              }
            })
        socketRef.current = s
      } catch (e) {
        console.error("WS connection failed", e)
      }
    }

    return () => {
      try {
        socketRef.current?.close()
      } catch (e) {
        /* ignore */
      }
    }
  }, [room?.id])

  // mapServerMessage is now imported from lib/api-service

  return (
    <div className="h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <ChatHeader room={room} user={user} onBackClick={onBackClick} />
      <ChatMessages messages={messages} user={user} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}
