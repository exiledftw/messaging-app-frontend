"use client"

import { useState, useRef, useEffect, FormEvent, KeyboardEvent, ChangeEvent } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

// Emoji data organized by category
const emojiCategories = {
  "😀 Smileys": [
    "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘",
    "😗", "😙", "😚", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐",
    "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮",
    "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️",
    "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞",
    "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺"
  ],
  "👋 Gestures": [
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆",
    "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️",
    "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀",
    "👁️", "👅", "👄", "💋", "🩸", "👶", "👧", "🧒", "👦", "👩", "🧑", "👨", "👩‍🦱", "🧑‍🦱", "👨‍🦱", "👩‍🦰"
  ],
  "❤️ Hearts": [
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖",
    "💘", "💝", "💟", "♥️", "💌", "💐", "🌹", "🥀", "🌺", "🌸", "💮", "🏵️", "🌻", "🌼", "🌷", "🪻"
  ],
  "🎉 Celebration": [
    "🎉", "🎊", "🎈", "🎁", "🎀", "🎂", "🍰", "🧁", "🥂", "🍾", "✨", "🎆", "🎇", "🧨", "🎄", "🎃",
    "🎅", "🤶", "🧑‍🎄", "🦌", "🍪", "🥛", "🔔", "🎵", "🎶", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺"
  ],
  "🔥 Popular": [
    "🔥", "💯", "✅", "❌", "⭐", "🌟", "💫", "⚡", "💥", "💢", "💦", "💨", "🕳️", "💣", "💬", "👁️‍🗨️",
    "🗨️", "🗯️", "💭", "💤", "🎵", "🎶", "🚀", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "📍", "🔒", "🔓"
  ],
  "🍔 Food": [
    "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🥣", "🥗", "🍿",
    "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮",
    "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰"
  ],
  "⚽ Sports": [
    "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍",
    "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌"
  ],
  "🐶 Animals": [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵",
    "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗",
    "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞", "🐜", "🪰", "🪲", "🪳", "🦟", "🦗", "🕷️", "🦂"
  ],
  "🚗 Travel": [
    "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵",
    "🚲", "🛴", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄",
    "✈️", "🛫", "🛬", "🛩️", "💺", "🛰️", "🚀", "🛸", "🚁", "🛶", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚢"
  ],
  "💻 Objects": [
    "💻", "🖥️", "🖨️", "⌨️", "🖱️", "🖲️", "💽", "💾", "💿", "📀", "📱", "📲", "☎️", "📞", "📟", "📠",
    "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋", "🔌", "💡",
    "🔦", "🕯️", "🧯", "🛢️", "💸", "💵", "💴", "💶", "💷", "🪙", "💰", "💳", "💎", "⚖️", "🪜", "🧰"
  ]
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [activeCategory, setActiveCategory] = useState("😀 Smileys")
  const [emojiSearch, setEmojiSearch] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // Handle mobile keyboard - adjust position when keyboard appears
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.visualViewport) {
        const viewport = window.visualViewport
        // Calculate keyboard height (difference between window height and viewport height)
        const kbHeight = window.innerHeight - viewport.height
        setKeyboardHeight(kbHeight > 0 ? kbHeight : 0)

        if (isFocused && textareaRef.current && kbHeight > 0) {
          // Small delay to let keyboard fully open
          setTimeout(() => {
            textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
          }, 100)
        }
      }
    }

    // Listen for visual viewport changes (mobile keyboard)
    if (typeof window !== "undefined" && window.visualViewport) {
      handleResize() // Initial check
      window.visualViewport.addEventListener("resize", handleResize)
      window.visualViewport.addEventListener("scroll", handleResize)
      return () => {
        window.visualViewport?.removeEventListener("resize", handleResize)
        window.visualViewport?.removeEventListener("scroll", handleResize)
      }
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

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji)
    // Focus the textarea after adding emoji
    textareaRef.current?.focus()
  }

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev)
    setEmojiSearch("")
  }

  const closeEmojiPicker = () => {
    setShowEmojiPicker(false)
    setEmojiSearch("")
  }

  // Get filtered emojis based on search
  const getFilteredEmojis = () => {
    if (!emojiSearch.trim()) {
      return emojiCategories[activeCategory as keyof typeof emojiCategories] || []
    }
    // Search across all categories
    const allEmojis: string[] = []
    Object.values(emojiCategories).forEach(emojis => {
      allEmojis.push(...emojis)
    })
    return allEmojis
  }

  return (
    <footer
      ref={containerRef}
      className="shrink-0 bg-black/40 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4 relative z-10 transition-all duration-200"
      style={{
        paddingBottom: keyboardHeight > 0
          ? `${Math.max(keyboardHeight + 16, 80)}px` // When keyboard is open, add extra padding
          : `max(env(safe-area-inset-bottom) + 1rem, 1rem)`, // Normal padding when keyboard is closed
      }}
    >
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[340px] sm:w-[400px] max-w-[calc(100vw-2rem)] bg-gradient-to-br from-violet-950/95 via-purple-900/95 to-fuchsia-950/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl shadow-purple-500/30 overflow-hidden animate-scale-in z-50"
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">Emojis</h3>
            <button
              type="button"
              onClick={closeEmojiPicker}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
              aria-label="Close emoji picker"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              value={emojiSearch}
              onChange={(e) => setEmojiSearch(e.target.value)}
              placeholder="Search emojis..."
              className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            />
          </div>

          {/* Category tabs */}
          <div className="flex overflow-x-auto p-2 gap-1 border-b border-white/10 scrollbar-hide">
            {Object.keys(emojiCategories).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category)
                  setEmojiSearch("")
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeCategory === category && !emojiSearch
                    ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
              >
                {category.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="p-2 h-[200px] overflow-y-auto">
            <div className="grid grid-cols-8 gap-1">
              {getFilteredEmojis().map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-9 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-white/20 active:scale-90 transition-all duration-150"
                >
                  {emoji}
                </button>
              ))}
            </div>
            {getFilteredEmojis().length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-white/50">
                <span className="text-3xl mb-2">🔍</span>
                <p className="text-sm">No emojis found</p>
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className={`flex gap-2 sm:gap-3 items-end p-2 rounded-2xl transition-all duration-300 ${isFocused
            ? 'bg-white/10 shadow-lg shadow-purple-500/10 ring-2 ring-purple-500/30'
            : 'bg-white/5'
          }`}>
          {/* Emoji button */}
          <button
            type="button"
            onClick={toggleEmojiPicker}
            className={`w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-xl transition-all duration-200 ${showEmojiPicker
                ? 'bg-gradient-to-br from-pink-500 to-violet-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
              }`}
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
            className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ${message.trim()
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

      {/* Animation styles */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: translateX(-50%) scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) scale(1) translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </footer>
  )
}
