const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8001/api"
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE || "ws://localhost:8001"

const handleApiError = (error: any) => {
  console.error("API Error:", error)
  throw error
}

// Generate or retrieve device fingerprint for login tracking
const getDeviceId = (): string => {
  if (typeof window === 'undefined') return ''

  let deviceId = localStorage.getItem('deviceFingerprint')
  if (!deviceId) {
    // Generate a unique device fingerprint
    const nav = window.navigator
    const screen = window.screen
    const fingerprint = [
      nav.userAgent,
      nav.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      nav.hardwareConcurrency || 'unknown',
      (nav as any).deviceMemory || 'unknown',
    ].join('|')

    // Create a hash-like ID from the fingerprint
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    deviceId = 'DEV-' + Math.abs(hash).toString(36).toUpperCase() + '-' + Date.now().toString(36).toUpperCase()
    localStorage.setItem('deviceFingerprint', deviceId)
  }
  return deviceId
}

export const authService = {
  register: async (username: string, password: string, firstName?: string, lastName?: string, email?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, first_name: firstName, last_name: lastName, email }),
      })
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const err: any = new Error(errBody.detail || "Registration failed")
        err.status = response.status
        throw err
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  login: async (username: string, password: string) => {
    try {
      const device_id = getDeviceId()
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, device_id }),
      })
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const err: any = new Error(errBody.detail || "Login failed")
        err.status = response.status
        throw err
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },
}

export const feedbackService = {
  submit: async (userId: string | number, content: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, content }),
      })
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const err: any = new Error(errBody.detail || "Failed to submit feedback")
        err.status = response.status
        throw err
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },
}

export const profileService = {
  updateProfile: async (
    userId: string | number,
    data: {
      first_name?: string
      last_name?: string
      email?: string
      current_password?: string
      new_password?: string
    }
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...data }),
      })
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const err: any = new Error(errBody.detail || "Failed to update profile")
        err.status = response.status
        throw err
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },
}

export const roomService = {
  createRoom: async (roomName: string, userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roomName, creator_id: userId }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Room creation failed' }))
        const err: any = new Error(errorData.detail || "Room creation failed")
        err.status = response.status
        throw err
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  joinRoom: async (roomKey: string, userId: string) => {
    try {
      console.log('Joining room with key:', roomKey, 'userId:', userId)
      const response = await fetch(`${API_BASE_URL}/rooms/join/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_key: roomKey, user_id: userId }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        console.error('Join room failed:', response.status, errorData)
        throw new Error(errorData.detail || "Failed to join room")
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  leaveRoom: async (roomId: string | number, userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/leave/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to leave room' }))
        const err: any = new Error(errorData.detail || "Failed to leave room")
        err.status = response.status
        throw err
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  deleteRoom: async (roomId: string | number, userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/delete/?user_id=${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to delete room' }))
        const err: any = new Error(errorData.detail || "Failed to delete room")
        err.status = response.status
        throw err
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  getRoomStats: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/stats/?user_id=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch room stats")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  getRooms: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/?user_id=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch rooms")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  getRoom: async (roomId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/`)
      if (!response.ok) throw new Error("Failed to fetch room")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  renameRoom: async (roomId: string | number, newName: string, performerId?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/rename/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, performer_id: performerId }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: "Failed to rename room" }))
        throw new Error(err.detail || "Failed to rename room")
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  kickMember: async (roomId: string | number, targetUserId: string | number, performerId?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/kick/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_user_id: targetUserId, performer_id: performerId }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: "Failed to kick member" }))
        throw new Error(err.detail || "Failed to kick member")
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  banMember: async (roomId: string | number, targetUserId: string | number, performerId?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/ban/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_user_id: targetUserId, performer_id: performerId }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: "Failed to ban member" }))
        throw new Error(err.detail || "Failed to ban member")
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },
}

export const messageService = {
  sendMessage: async (roomId: string, userId: string, messageText: string, userFullName?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: roomId, user_id: userId, user: userFullName || userId, content: messageText }),
      })
      if (!response.ok) throw new Error("Failed to send message")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  getMessages: async (roomId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/messages/`)
      if (!response.ok) throw new Error("Failed to fetch messages")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },
}

// WebSocket helper for real-time messaging with auto-reconnect and presence tracking
export const createWebSocketConnection = (
  roomId: string,
  onMessageReceived: (data: any) => void,
  userId?: string | number,
  userName?: string,
  onPresenceUpdate?: (data: any) => void
) => {
  let socket: WebSocket | null = null
  let reconnectAttempts = 0
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let pingInterval: ReturnType<typeof setInterval> | null = null
  let isClosedManually = false

  const MAX_RECONNECT_ATTEMPTS = 10
  const INITIAL_RECONNECT_DELAY = 1000
  const MAX_RECONNECT_DELAY = 30000
  const PING_INTERVAL = 25000 // Send ping every 25 seconds to keep connection alive

  // Build WebSocket URL
  let wsBase = WS_BASE_URL.replace(/\/$/, "")
  if (wsBase.startsWith("https://")) wsBase = wsBase.replace(/^https:/, "wss:")
  else if (wsBase.startsWith("http://")) wsBase = wsBase.replace(/^http:/, "ws:")
  const wsUrl = `${wsBase}/ws/chat/${roomId}/`

  const getReconnectDelay = () => {
    return Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY)
  }

  const connect = () => {
    if (isClosedManually) return
    if (socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) {
      return
    }

    console.info(`🔌 WebSocket connecting to: ${wsUrl} (attempt ${reconnectAttempts + 1})`)

    try {
      socket = new WebSocket(wsUrl)
    } catch (error) {
      console.error("Failed to create WebSocket:", error)
      scheduleReconnect()
      return
    }

    socket.onopen = () => {
      console.info("✅ WebSocket connected successfully to:", wsUrl)
      reconnectAttempts = 0

      // Announce presence when connected
      if (userId && socket?.readyState === WebSocket.OPEN) {
        try {
          const presenceMsg = {
            type: "user_connected",
            user_id: userId,
            user_name: userName || `User ${userId}`
          }
          console.info("👋 Sending presence announcement:", presenceMsg)
          socket.send(JSON.stringify(presenceMsg))
        } catch (e) {
          console.error("Failed to send presence announcement:", e)
        }
      } else {
        console.warn("⚠️ Cannot send presence - userId:", userId, "socket ready:", socket?.readyState === WebSocket.OPEN)
      }

      // Start ping interval to keep connection alive
      if (pingInterval) clearInterval(pingInterval)
      pingInterval = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) {
          try {
            socket.send(JSON.stringify({ type: "ping" }))
          } catch (e) {
            console.error("Ping failed:", e)
          }
        }
      }, PING_INTERVAL)
    }

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        const msgType = data.type

        // Ignore pong responses
        if (msgType === "pong") return

        // Handle presence updates
        if (msgType === "presence_update") {
          console.log("👥 Presence update:", data)
          if (onPresenceUpdate) {
            onPresenceUpdate(data)
          }
          return
        }

        // Handle regular messages
        console.log("📨 WebSocket message received:", data)
        onMessageReceived(data)
      } catch (e) {
        console.error("Invalid WebSocket message:", e)
      }
    }

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error)
    }

    socket.onclose = (event) => {
      console.warn("🔌 WebSocket closed:", { code: event.code, reason: event.reason, wasClean: event.wasClean })

      if (pingInterval) {
        clearInterval(pingInterval)
        pingInterval = null
      }

      if (!isClosedManually && !event.wasClean) {
        scheduleReconnect()
      }
    }
  }

  const scheduleReconnect = () => {
    if (isClosedManually || reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error("❌ Max reconnection attempts reached. Please refresh the page.")
      }
      return
    }

    const delay = getReconnectDelay()
    reconnectAttempts++
    console.info(`🔄 Reconnecting in ${delay / 1000}s... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`)

    reconnectTimer = setTimeout(() => {
      connect()
    }, delay)
  }

  // Initial connection
  connect()

  // Return an object that looks like a WebSocket but with extra methods
  return {
    get readyState() { return socket?.readyState ?? WebSocket.CLOSED },
    send: (data: string) => socket?.send(data),
    close: () => {
      isClosedManually = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (pingInterval) clearInterval(pingInterval)
      socket?.close()
    },
    reconnect: () => {
      isClosedManually = false
      reconnectAttempts = 0
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (socket) socket.close()
      connect()
    }
  }
}

// Convert server message shape into UI message shape expected by ChatMessages
export const mapServerMessage = (m: any, currentUserId?: string) => {
  const userFull = m.user_name || m.user || "Anonymous"
  const userId = m.user_id || m.userId || null
  const parts = userFull.split(" ")
  const firstName = parts[0] || ""
  const lastName = parts.slice(1).join(" ")
  const initials = ((firstName[0] || "").toUpperCase() + (parts[1] ? parts[1][0].toUpperCase() : "")) || "A"
  return {
    id: m.id,
    sender: { id: userId || userFull, firstName, lastName, initials },
    text: m.content || m.text,
    timestamp: m.created_at || m.timestamp,
    isMine: currentUserId ? (String(userId || userFull) === String(currentUserId)) : undefined,
    status: 'sent' // Messages from server are already sent
  }
}
