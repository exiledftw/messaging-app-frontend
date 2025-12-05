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
      // Scroll to bottom when keyboard opens/closes
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
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 relative z-10"
    >
      <div className="max-w-3xl mx-auto w-full space-y-4 sm:space-y-5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 border border-white/20 shadow-xl shadow-purple-500/10">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">No messages yet</h3>
            <p className="text-white/50 max-w-sm text-sm sm:text-base">Start the conversation! Your messages will appear here.</p>
          </div>
        ) : (
          <>
            {messages.map((msg: any, idx: number) => (
              <div
                key={msg.id || `msg-${idx}`}
                className={`flex gap-3 sm:gap-4 animate-fade-in-up ${msg.isMine ? "flex-row-reverse" : ""}`}
                style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
              >
                {/* Avatar - Hidden for own messages on mobile for cleaner look */}
                <div className={`shrink-0 ${msg.isMine ? "hidden sm:block" : ""}`}>
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ring-2 ${msg.isMine
                    ? "bg-white text-purple-600 ring-purple-400/50 shadow-purple-500/20"
                    : "bg-gradient-to-br from-purple-500 to-violet-600 text-white ring-white/20 shadow-violet-500/30"
                    }`}>
                    {msg.sender?.initials ?? "?"}
                  </div>
                </div>

                {/* Message Content */}
                <div className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[70%]`}>
                  {/* Sender name and time */}
                  <div className={`flex items-center gap-2 mb-1.5 ${msg.isMine ? "flex-row-reverse" : ""}`}>
                    <p className={`text-xs sm:text-sm font-semibold ${msg.isMine ? "text-purple-200" : "text-white/80"}`}>
                      {msg.isMine ? "You" : `${msg.sender?.firstName || ''} ${msg.sender?.lastName || ''}`.trim() || "Anonymous"}
                    </p>
                    <span className="text-[10px] sm:text-xs text-white/40">{formatTime(msg.timestamp)}</span>
                  </div>

                  {/* Message Bubble */}
                  <div className={`group relative px-4 py-3 sm:px-5 sm:py-3.5 transition-all duration-300 ${msg.isMine
                    ? "bg-white text-purple-900 rounded-2xl rounded-tr-md shadow-xl shadow-purple-900/20 hover:shadow-purple-900/30"
                    : "bg-purple-800/40 backdrop-blur-md text-white rounded-2xl rounded-tl-md border border-purple-500/20 hover:bg-purple-800/50"
                    }`}>
                    <p className={`break-words leading-relaxed text-sm sm:text-[15px] ${msg.isMine ? "text-purple-900" : "text-white"}`}>
                      {msg.text}
                    </p>

                    {/* Subtle glow effect for own messages */}
                    {msg.isMine && (
                      <div className="absolute inset-0 rounded-2xl rounded-tr-md bg-gradient-to-br from-purple-200/20 to-transparent pointer-events-none" />
                    )}
                  </div>

                  {/* Delivery status indicator for own messages */}
                  {msg.isMine && (
                    <div className="flex items-center gap-1 mt-1 mr-1">
                      {msg.status === 'pending' ? (
                        // Sending - clock icon
                        <svg className="w-3.5 h-3.5 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        // Sent - single green checkmark
                        <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-2" />
          </>
        )}
      </div>

      {/* Inline animation styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.35s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
