"use client"

import { useEffect, useRef } from "react"

export default function ChatMessages({ messages, user }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-6xl mx-auto w-full">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center py-12">
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.sender.id === user.id ? "flex-row-reverse" : ""}`}>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-navy-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {msg.sender.initials}
                </div>
              </div>
              <div className={`flex-1 flex flex-col ${msg.sender.id === user.id ? "items-end" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-200">
                    {msg.sender.firstName} {msg.sender.lastName}
                  </p>
                  <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
                    msg.sender.id === user.id ? "bg-blue-600 text-white" : "bg-navy-800 text-gray-100"
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}
