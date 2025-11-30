"use client"

import { useState, useEffect } from "react"
import { authService, roomService } from "@/lib/api-service"
import LandingPage from "@/components/LandingPage"
import RoomsPage from "@/components/RoomsPage"
import ChatPage from "@/components/ChatPage"

export default function Home() {
  const [user, setUser] = useState<any | null>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<string>("landing")
  const [selectedRoomId, setSelectedRoomId] = useState<string | number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem("chatUser")
    if (savedUser) {
      const localUser = JSON.parse(savedUser)
      ;(async () => {
        let serverUser = localUser
        try {
          // If credentials exist, try to login
          const username = localUser.username
          const password = localUser.password
            if (username && password) {
            try {
              const resp = await authService.login(username, password)
              if (resp && resp.id) {
                serverUser = { id: resp.id, firstName: resp.first_name || localUser.firstName, lastName: resp.last_name || localUser.lastName, username: username, password }
              }
            } catch (loginErr) {
              // If login fails, try to register with these credentials
              try {
                const registered = await authService.register(username, password, localUser.firstName, localUser.lastName)
                if (registered && registered.id) {
                  serverUser = { id: registered.id, firstName: registered.first_name || localUser.firstName, lastName: registered.last_name || localUser.lastName, username: registered.username, password }
                  localUser.username = registered.username
                  localUser.password = password
                  localStorage.setItem('chatUser', JSON.stringify(localUser))
                }
              } catch (regErr: any) {
                if (regErr?.status === 409) {
                  try {
                    const logged = await authService.login(username, password)
                    if (logged && logged.id) {
                      serverUser = { id: logged.id, firstName: logged.first_name || localUser.firstName, lastName: logged.last_name || localUser.lastName, username: logged.username, password }
                    }
                  } catch (__) {
                    // ignore
                  }
                }
                // ignore other registration failure
              }
            }
          } else {
            // No credentials: generate new username/password and register to create server user
            const base = (localUser.firstName || 'user') + (localUser.lastName || '')
            const usernameBase = base.toLowerCase().replace(/[^a-z0-9]/g, '') || `user${Date.now()}`
            const generatedUsername = `${usernameBase}${Math.floor(Math.random() * 900 + 100)}`
            const generatedPassword = Math.random().toString(36).slice(2, 10)
            try {
              const registered = await authService.register(generatedUsername, generatedPassword, localUser.firstName, localUser.lastName)
              if (registered && registered.id) {
                localUser.username = generatedUsername
                localUser.password = generatedPassword
                localStorage.setItem('chatUser', JSON.stringify(localUser))
                serverUser = { id: registered.id, firstName: registered.first_name || localUser.firstName, lastName: registered.last_name || localUser.lastName, username: registered.username, password: generatedPassword }
              }
            } catch (e) {
              // ignore registration failure
            }
          }
        } catch (err) {
          // fallback: leave serverUser as localUser
        }
  setUser(serverUser)
        setCurrentPage("rooms")
        try {
          const username = serverUser.username
          const password = serverUser.password
          // If we have credentials attempt to authenticate so server id is used
          if (username && password) {
            try {
              const logged = await authService.login(username, password)
              if (logged && logged.id) serverUser = { ...serverUser, id: logged.id }
            } catch (err) {
              // ignore
            }
          }
          const rooms = await roomService.getRooms(serverUser.id)
          setRooms(rooms || [])
          localStorage.setItem("chatRooms", JSON.stringify(rooms || []))
        } catch {
          // ignore
        }
      })()
    }

    const savedRooms = localStorage.getItem("chatRooms")
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms))
    }
  }, [])

  if (!mounted) return null

  const saveUser = (userData: any) => {
    setUser(userData)
    localStorage.setItem("chatUser", JSON.stringify(userData))
    setCurrentPage("rooms")
  }

  const saveRooms = (newRooms: any[]) => {
    setRooms(newRooms)
    localStorage.setItem("chatRooms", JSON.stringify(newRooms))
  }

  const handleRoomClick = (roomId: string | number) => {
    setSelectedRoomId(roomId)
    setCurrentPage("chat")
  }

  const handleBackToRooms = () => {
    setCurrentPage("rooms")
    setSelectedRoomId(null)
  }

  const handleLogout = () => {
    setUser(null)
    setRooms([])
    setCurrentPage("landing")
    localStorage.removeItem("chatUser")
    localStorage.removeItem("chatRooms")
  }

  return (
    <main>
      {currentPage === "landing" && <LandingPage onUserSet={saveUser} />}
      {currentPage === "rooms" && user && (
        <RoomsPage
          user={user}
          rooms={rooms}
          setRooms={saveRooms}
          onRoomClick={handleRoomClick}
          onLogout={handleLogout}
        />
      )}
      {currentPage === "chat" && user && selectedRoomId && (
        <ChatPage user={user} room={rooms.find((r) => r.id === selectedRoomId)} onBackClick={handleBackToRooms} />
      )}
    </main>
  )
}
