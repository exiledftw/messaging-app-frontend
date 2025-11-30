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
  <div className="min-h-screen bg-linear-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-3xl font-bold mb-4">Room not found</h1>
          <button onClick={onBackClick} className="bg-white text-navy-950 px-6 py-2 rounded-lg hover:bg-gray-100">
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
  <div className="min-h-screen bg-linear-to-br from-navy-950 via-navy-900 to-navy-950 flex flex-col">
      <ChatHeader room={room} user={user} onBackClick={onBackClick} />
      <ChatMessages messages={messages} user={user} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}
