"use client"

import { useState, useRef, useEffect, FormEvent, KeyboardEvent, ChangeEvent } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle mobile keyboard - scroll to input when focused
  useEffect(() => {
    const handleResize = () => {
      if (isFocused && textareaRef.current) {
        // Small delay to let keyboard fully open
        setTimeout(() => {
          textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
        }, 100)
      }
    }

    // Listen for visual viewport changes (mobile keyboard)
    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize)
      return () => window.visualViewport?.removeEventListener("resize", handleResize)
    }
  }, [isFocused])

  const handleFocus = () => {
    setIsFocused(true)
    // Scroll to input on mobile when keyboard opens
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, 300)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  return (
    <footer 
      ref={containerRef}
      className="shrink-0 bg-black/20 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4 relative z-10 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className={`flex gap-2 sm:gap-3 items-end p-2 rounded-2xl transition-all duration-300 ${
          isFocused 
            ? 'bg-white/10 shadow-lg shadow-purple-500/10 ring-2 ring-purple-500/30' 
            : 'bg-white/5'
        }`}>
          {/* Emoji/Attachment button (decorative) */}
          <button
            type="button"
            className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent text-white placeholder-white/40 focus:outline-none resize-none max-h-[120px] text-base"
            enterKeyHint="send"
            autoComplete="off"
            autoCorrect="on"
          />
          
          <button
            type="submit"
            disabled={!message.trim()}
            className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ${
              message.trim() 
                ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30 hover:scale-105 hover:shadow-purple-500/50 active:scale-95' 
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <svg className={`w-5 h-5 transition-transform duration-200 ${message.trim() ? 'translate-x-0.5' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        {/* Typing hint - hidden on mobile */}
        <p className="hidden sm:block text-center text-white/30 text-xs mt-3">
          Press <span className="text-white/50 font-medium">Enter</span> to send • <span className="text-white/50 font-medium">Shift + Enter</span> for new line
        </p>
      </form>
    </footer>
  )
}
