const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8001/api"
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE || "ws://localhost:8001"

const handleApiError = (error: any) => {
  console.error("API Error:", error)
  throw error
}

export const authService = {
  register: async (username: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, first_name: firstName, last_name: lastName }),
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
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
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

// WebSocket helper for real-time messaging with auto-reconnect
export const createWebSocketConnection = (roomId: string, onMessageReceived: (data: any) => void) => {
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
        // Ignore pong responses
        if (data.type === "pong") return
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
  }
}
