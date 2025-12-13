"use client"

import { useState, useRef, useEffect, FormEvent, KeyboardEvent, ChangeEvent } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

// Emoji data - carefully curated categories
const emojiCategories = {
  "Smileys": ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😌", "😍", "🥰", "😘", "😋", "😛", "😜", "🤪", "😎", "🤓", "🥳", "😏", "😔", "😢", "😭", "🥺", "😤", "😡", "🤯"],
  "Gestures": ["👋", "🤚", "✋", "🖖", "👌", "🤌", "✌️", "🤞", "🤟", "🤘", "👈", "👉", "👆", "👇", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤝", "🙏", "💪"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  "Fire": ["🔥", "💯", "✨", "⭐", "🌟", "💫", "⚡", "💥", "🎉", "🎊", "🚀", "🏆", "🥇", "✅", "❌"],
  "Food": ["🍔", "🍕", "🍟", "🌮", "🍣", "🍜", "🍦", "🍩", "☕", "🍺", "🍷"],
  "Animals": ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐸", "🦋"],
}

const COOLDOWN_SECONDS = 3

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [activeCategory, setActiveCategory] = useState("Smileys")
  const [cooldown, setCooldown] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const cooldownRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup cooldown timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) {
        clearInterval(cooldownRef.current)
      }
    }
  }, [])

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS)
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownRef.current) {
            clearInterval(cooldownRef.current)
            cooldownRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    if (message.trim() && cooldown === 0) {
      onSendMessage(message)
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      startCooldown()
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji)
    textareaRef.current?.focus()
  }

  const isDisabled = !message.trim() || cooldown > 0

  return (
    <footer className="shrink-0 bg-black/60 backdrop-blur-2xl border-t border-white/[0.06] p-3 sm:p-4 relative z-10"
      style={{ paddingBottom: `max(env(safe-area-inset-bottom) + 0.75rem, 0.75rem)` }}>

      {/* Emoji Picker - White/Purple bloom style */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto mb-2 sm:w-[340px] bg-white rounded-2xl shadow-2xl shadow-purple-500/25 overflow-hidden animate-scale-up ring-1 ring-purple-200/60">
          {/* Purple bloom glow effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-400/40 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 right-0 w-40 h-40 bg-violet-400/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-10 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl" />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between px-4 py-3 border-b border-purple-100/80 bg-gradient-to-r from-purple-50/80 to-violet-50/60">
            <span className="text-sm font-semibold text-gray-700">Emoji</span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-purple-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Categories */}
          <div className="relative flex gap-1.5 px-3 py-2.5 border-b border-purple-100/50 overflow-x-auto scrollbar-hide bg-gradient-to-r from-white via-purple-50/30 to-white">
            {Object.keys(emojiCategories).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${activeCategory === cat
                  ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-400/40'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-purple-100/60'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="relative p-3 h-[200px] overflow-y-auto bg-gradient-to-b from-white via-white to-purple-50/50">
            <div className="grid grid-cols-8 gap-1">
              {emojiCategories[activeCategory as keyof typeof emojiCategories]?.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-9 h-9 flex items-center justify-center text-xl rounded-xl hover:bg-purple-100 hover:scale-110 active:scale-95 transition-all duration-150"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {/* Cooldown indicator */}
        {cooldown > 0 && (
          <div className="flex items-center justify-end gap-2 mb-2 animate-fade-in">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full">
              <svg className="w-3.5 h-3.5 text-orange-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-orange-400 text-xs font-medium">
                Wait {cooldown}s
              </span>
            </div>
          </div>
        )}

        <div className={`flex items-end gap-2 p-1.5 rounded-2xl transition-all duration-200 ${isFocused
          ? 'bg-white/[0.08] ring-1 ring-purple-500/30'
          : 'bg-white/[0.04]'
          }`}>
          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${showEmojiPicker
              ? 'bg-purple-500/20 text-purple-400'
              : 'text-white/30 hover:text-white/50 hover:bg-white/[0.06]'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={cooldown > 0 ? "Please wait..." : "Message..."}
            rows={1}
            className="flex-1 px-2 py-2.5 bg-transparent text-white/90 placeholder-white/30 focus:outline-none resize-none max-h-[120px] text-[15px]"
            enterKeyHint="send"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${!isDisabled
              ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95'
              : 'bg-white/[0.04] text-white/20'
              }`}
          >
            {cooldown > 0 ? (
              <span className="text-xs font-bold text-white/40">{cooldown}</span>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Hint */}
        <p className="hidden sm:block text-center text-white/20 text-[10px] mt-2 tracking-wide">
          Press <span className="text-white/30">Enter</span> to send · <span className="text-white/30">Shift + Enter</span> for new line
        </p>
      </form>

      <style jsx>{`
        @keyframes scale-up {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </footer>
  )
}

