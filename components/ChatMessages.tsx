"use client"

import { useEffect, useRef } from "react"

export default function ChatMessages({ messages, user }: { messages: any[]; user: any }) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle viewport resize (mobile keyboard open/close)
  useEffect(() => {
    const handleViewportResize = () => {
      setTimeout(scrollToBottom, 100)
    }

    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize)
      return () => window.visualViewport?.removeEventListener("resize", handleViewportResize)
    }
  }, [])

  const formatTime = (timestamp: string | undefined) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Karachi"
    })
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8 sm:py-8"
    >
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-24">
            {/* Empty state - Apple style minimal */}
            <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-white/90 font-medium text-lg tracking-tight mb-2">No messages yet</h3>
            <p className="text-white/40 text-sm max-w-xs">Start the conversation. Your messages will appear here.</p>
          </div>
        ) : (
          <>
            {messages.map((msg: any, idx: number) => (
              <div
                key={msg.id || `msg-${idx}`}
                className={`flex gap-3 animate-fade-in ${msg.isMine ? "justify-end" : "justify-start"}`}
                style={{ animationDelay: `${Math.min(idx * 20, 200)}ms` }}
              >
                {/* Message container */}
                <div className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"} max-w-[80%] sm:max-w-[65%]`}>

                  {/* Sender info - minimal */}
                  {!msg.isMine && (
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-white">{msg.sender?.initials ?? "?"}</span>
                      </div>
                      <span className="text-xs text-white/50 font-medium">
                        {`${msg.sender?.firstName || ''}`.trim() || "Anonymous"}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble - Apple style */}
                  <div className={`relative group ${msg.isMine
                      ? "bg-gradient-to-br from-purple-500 to-violet-600 text-white"
                      : "bg-white/[0.08] text-white/90 backdrop-blur-sm"
                    } px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl ${msg.isMine ? "rounded-br-md" : "rounded-bl-md"
                    } transition-all duration-200`}>

                    <p className="text-[15px] leading-relaxed break-words">
                      {msg.text}
                    </p>

                    {/* Subtle shimmer on own messages */}
                    {msg.isMine && (
                      <div className="absolute inset-0 rounded-2xl rounded-br-md bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
                    )}
                  </div>

                  {/* Time and status - minimal */}
                  <div className={`flex items-center gap-1.5 mt-1.5 ${msg.isMine ? "mr-1" : "ml-1"}`}>
                    <span className="text-[10px] text-white/30">{formatTime(msg.timestamp)}</span>

                    {msg.isMine && (
                      msg.status === 'pending' ? (
                        <div className="w-3 h-3 rounded-full border border-white/20 border-t-purple-400 animate-spin" />
                      ) : (
                        <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
