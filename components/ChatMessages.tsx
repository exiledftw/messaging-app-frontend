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
      className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-6 relative z-10"
    >
      <div className="max-w-4xl mx-auto w-full space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-white/80 font-semibold text-lg mb-2">No messages yet</h3>
            <p className="text-white/40 max-w-sm text-sm sm:text-base">Start the conversation! Your messages will appear here.</p>
          </div>
        ) : (
          <>
            {messages.map((msg: any, idx: number) => (
              <div 
                key={idx} 
                className={`flex gap-2 sm:gap-3 ${msg.isMine ? "flex-row-reverse" : ""} animate-fade-in-up`}
                style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg ${
                    msg.isMine 
                      ? "bg-gradient-to-br from-pink-500 to-violet-600 shadow-pink-500/30" 
                      : "bg-gradient-to-br from-violet-500 to-purple-700 shadow-violet-500/30"
                  }`}>
                    {msg.sender?.initials ?? "?"}
                  </div>
                </div>
                
                {/* Message Content */}
                <div className={`flex-1 flex flex-col ${msg.isMine ? "items-end" : ""} max-w-[80%] sm:max-w-[75%]`}>
                  <div className={`flex items-center gap-2 mb-1 sm:mb-1.5 ${msg.isMine ? "flex-row-reverse" : ""}`}>
                    <p className="text-xs sm:text-sm font-semibold text-white/90">
                      {msg.isMine ? "You" : `${msg.sender?.firstName || ''} ${msg.sender?.lastName || ''}`}
                    </p>
                    <span className="text-[10px] sm:text-xs text-white/40">{formatTime(msg.timestamp)}</span>
                  </div>
                  
                  <div className={`group relative px-3 py-2 sm:px-4 sm:py-3 rounded-2xl transition-all duration-200 ${
                    msg.isMine 
                      ? "bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/20" 
                      : "bg-white/10 backdrop-blur-sm text-white border border-white/10"
                  }`}>
                    <p className="break-words leading-relaxed text-sm sm:text-base">{msg.text}</p>
                    
                    {/* Decorative tail */}
                    <div className={`absolute bottom-2 sm:bottom-3 w-2 h-2 sm:w-3 sm:h-3 rotate-45 ${
                      msg.isMine 
                        ? "right-[-4px] sm:right-[-6px] bg-violet-600" 
                        : "left-[-4px] sm:left-[-6px] bg-white/10 border-l border-b border-white/10"
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-1" />
          </>
        )}
      </div>
      
      {/* Inline animation styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
