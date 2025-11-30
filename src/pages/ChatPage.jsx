"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ChatHeader from "../components/ChatHeader"
import ChatMessages from "../components/ChatMessages"
import ChatInput from "../components/ChatInput"
import "../styles/chat.css"
import { messageService, createWebSocketConnection } from "../services/api"

export default function ChatPage({ user, rooms }) {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const room = rooms.find((r) => r.id === roomId)
  const [messages, setMessages] = useState(room?.messages || [])
  const socketRef = useRef(null)

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-3xl font-bold mb-4">Room not found</h1>
          <button
            onClick={() => navigate("/rooms")}
            className="bg-white text-navy-950 px-6 py-2 rounded-lg hover:bg-gray-100"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    )
  }

  const handleSendMessage = (messageText) => {
    const optimistic = {
      id: Date.now().toString(),
      sender: user,
      text: messageText,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, optimistic])

    // Prefer WS send, otherwise fallback to REST
    const socket = socketRef.current
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({ user: user.id || `${user.firstName} ${user.lastName}`, content: messageText }))
        return
      } catch (e) {
        console.error("WS send failed, falling back to REST:", e)
      }
    }

    messageService.sendMessage(roomId, user.id || `${user.firstName} ${user.lastName}`, messageText).catch((e) => {
      console.error("Failed to send message via REST:", e)
    })
  }

  const normalizeIncoming = (msg) => {
    const userName = msg.user_name || msg.user || msg.userId || msg.user_id || msg.sender || null
    const content = msg.content || msg.text || msg.body || ""
    const createdAt = msg.created_at || msg.timestamp || msg.createdAt || new Date().toISOString()

    const parts = (typeof userName === "string" ? userName : "").split(" ").filter(Boolean)
    const firstName = parts[0] || (typeof userName === "string" ? userName : "User")
    const lastName = parts.slice(1).join(" ") || ""
    const initials = (firstName.charAt(0) + (lastName.charAt(0) || "")).toUpperCase()

    return {
      id: msg.id ? String(msg.id) : Date.now().toString(),
      sender: {
        id: msg.user_id || msg.user || userName || "anon",
        firstName,
        lastName,
        initials,
      },
      text: content,
      timestamp: createdAt,
    }
  }

  useEffect(() => {
    if (!room) return

    let mounted = true
    ;(async () => {
      try {
        const data = await messageService.getMessages(roomId)
        if (!mounted) return
        const normalized = (data || []).map(normalizeIncoming)
        setMessages(normalized)
      } catch (e) {
        console.error("Failed to load messages:", e)
      }
    })()

    socketRef.current = createWebSocketConnection(roomId, (incoming) => {
      const normalized = normalizeIncoming(incoming)
      setMessages((prev) => [...prev, normalized])
    })

    return () => {
      mounted = false
      try {
        socketRef.current?.close()
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, room])

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex flex-col">
      <ChatHeader room={room} user={user} onBackClick={() => navigate("/rooms")} />
      <ChatMessages messages={messages} user={user} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}
