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

// WebSocket helper for real-time messaging
export const createWebSocketConnection = (roomId: string, onMessageReceived: (data: any) => void) => {
  // Use WS_BASE_URL that we defined at the top of the file
  let wsBase = WS_BASE_URL.replace(/\/$/, "")
  
  // Convert http/https to ws/wss
  if (wsBase.startsWith("https://")) wsBase = wsBase.replace(/^https:/, "wss:")
  else if (wsBase.startsWith("http://")) wsBase = wsBase.replace(/^http:/, "ws:")

  const wsUrl = `${wsBase}/ws/chat/${roomId}/`
  console.info("WebSocket connecting to:", wsUrl)
  const socket = new WebSocket(wsUrl)

  socket.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      console.log("WebSocket message received:", data)
      onMessageReceived(data)
    } catch (e) {
      console.error("Invalid WS message", e)
    }
  }

  socket.onerror = (error) => {
    console.error("WebSocket error:", error)
  }

  socket.onopen = () => {
    console.info("WebSocket open", wsUrl)
  }

  socket.onclose = (event) => {
    console.warn("WebSocket closed", { code: event.code, reason: event.reason, wasClean: event.wasClean, url: wsUrl })
  }

  return socket
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
