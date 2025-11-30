const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api"

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error("API Error:", error)
  throw error
}

// Auth Services
export const authService = {
  register: async (username, password, firstName, lastName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, first_name: firstName, last_name: lastName }),
      })
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const err = new Error(errBody.detail || "Registration failed")
        err.status = response.status
        throw err
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const err = new Error(errBody.detail || "Login failed")
        err.status = response.status
        throw err
      }
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },
}

// Room Services
export const roomService = {
  createRoom: async (roomName, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roomName, creator_id: userId }),
      })
      if (!response.ok) throw new Error("Room creation failed")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  joinRoom: async (roomKey, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/join/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_key: roomKey, user_id: userId }),
      })
      if (!response.ok) throw new Error("Failed to join room")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  getRooms: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/?user_id=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch rooms")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  getRoom: async (roomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/`)
      if (!response.ok) throw new Error("Failed to fetch room")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },
}

// Message Services
export const messageService = {
  sendMessage: async (roomId, userId, messageText, user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: roomId, user_id: userId, user: user && (user.firstName ? `${user.firstName} ${user.lastName}` : user.id), content: messageText }),
      })
      if (!response.ok) throw new Error("Failed to send message")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },

  getMessages: async (roomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/messages/`)
      if (!response.ok) throw new Error("Failed to fetch messages")
      return await response.json()
    } catch (error) {
      handleApiError(error)
    }
  },
}

// WebSocket Service for real-time messaging (optional)
export const createWebSocketConnection = (roomId, onMessageReceived) => {
  // Prefer explicit WS env var, otherwise derive from API base
  const envWs = import.meta.env.VITE_WS_URL
  const apiBase = API_BASE_URL.replace(/\/$/, "")
  let wsBase = envWs ? envWs.replace(/\/$/, "") : apiBase.replace(/\/api$/, "")
  if (!envWs) {
    if (wsBase.startsWith("https://")) wsBase = wsBase.replace(/^https:/, "wss:")
    else if (wsBase.startsWith("http://")) wsBase = wsBase.replace(/^http:/, "ws:")
  }

  const wsUrl = `${wsBase}/ws/chat/${roomId}/`

  console.info("WebSocket connecting to:", wsUrl)
  const socket = new WebSocket(wsUrl)

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessageReceived(data)
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

export const mapServerMessage = (m, currentUser) => {
  const userFull = m.user_name || m.user || "Anonymous"
  const userId = m.user_id || m.userId || null
  const parts = userFull.split(" ")
  const firstName = parts[0] || ""
  const lastName = parts.slice(1).join(" ")
  const initials = ((firstName[0] || "").toUpperCase() + (parts[1] ? parts[1][0].toUpperCase() : "")) || "A"
  const msg = {
    id: m.id,
    sender: { id: userId || userFull, firstName, lastName, initials },
    text: m.content || m.text,
    timestamp: m.created_at || m.timestamp,
  }
  msg.isMine = currentUser ? (String(msg.sender.id) === (currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.id)) : undefined
  return msg
}
