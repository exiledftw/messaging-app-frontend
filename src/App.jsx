"use client"

import { useState, useEffect } from "react"
import { roomService, authService } from "./services/api"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import RoomsPage from "./pages/RoomsPage"
import ChatPage from "./pages/ChatPage"
import "./App.css"

export default function App() {
  const [user, setUser] = useState(null)
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem("chatUser")
    if (savedUser) {
      const localUser = JSON.parse(savedUser)
      ;(async () => {
        let serverUser = localUser
        try {
          const username = localUser.username
          const password = localUser.password
          if (username && password) {
            try {
              const resp = await authService.login(username, password)
              if (resp && resp.id) serverUser = { id: resp.id, firstName: resp.first_name || localUser.firstName, lastName: resp.last_name || localUser.lastName, username: resp.username, password }
            } catch (loginErr) {
              // login failed, try to register using provided credentials
              try {
                const registered = await authService.register(username, password, localUser.firstName, localUser.lastName)
                if (registered && registered.id) {
                  serverUser = { id: registered.id, firstName: registered.first_name || localUser.firstName, lastName: registered.last_name || localUser.lastName, username: registered.username, password }
                  localUser.username = username
                  localUser.password = password
                  localStorage.setItem('chatUser', JSON.stringify(localUser))
                }
              } catch (regErr) {
                // If register failed due to already-taken username, try logging in again (maybe it was registered already)
                if (regErr?.status === 409) {
                  try {
                    const maybe = await authService.login(username, password)
                    if (maybe && maybe.id) serverUser = { id: maybe.id, firstName: maybe.first_name || localUser.firstName, lastName: maybe.last_name || localUser.lastName, username: maybe.username, password }
                  } catch (__) {
                    // ignore
                  }
                }
                // ignore registration failure
              }
            }
          } else {
            // no credentials: generate and register
            const base = (localUser.firstName || 'user') + (localUser.lastName || '')
            const usernameBase = base.toLowerCase().replace(/[^a-z0-9]/g, '') || `user${Date.now()}`
            const genUsername = `${usernameBase}${Math.floor(Math.random() * 900 + 100)}`
            const genPassword = Math.random().toString(36).slice(2, 10)
            try {
              const registered = await authService.register(genUsername, genPassword, localUser.firstName, localUser.lastName)
              if (registered && registered.id) {
                localUser.username = genUsername
                localUser.password = genPassword
                localStorage.setItem('chatUser', JSON.stringify(localUser))
                serverUser = { id: registered.id, firstName: registered.first_name || localUser.firstName, lastName: registered.last_name || localUser.lastName, username: registered.username, password: genPassword }
              }
            } catch (_) {
              // ignore
            }
          }
        } catch (err) {
          // ignore and keep serverUser as localUser
        }
        setUser(serverUser)
          // fetch rooms from backend using serverUser id
          try {
            const roomsData = await roomService.getRooms(serverUser.id)
            setRooms(roomsData || [])
            localStorage.setItem("chatRooms", JSON.stringify(roomsData || []))
          } catch (e) {
            const savedRooms = localStorage.getItem("chatRooms")
            if (savedRooms) setRooms(JSON.parse(savedRooms))
          }
        })()
    }
    
  }, [])

  const saveUser = (userData) => {
    setUser(userData)
    localStorage.setItem("chatUser", JSON.stringify(userData))

    // fetch rooms from backend for new user
    ;(async () => {
      try {
        const username = userData.username
        const password = userData.password
        // Try to log in and confirm server user id if possible
        let serverUser = userData
        try {
          const logged = await authService.login(username, password)
          if (logged && logged.id) serverUser = { id: logged.id, firstName: logged.first_name || userData.firstName, lastName: logged.last_name || userData.lastName, username: logged.username }
        } catch (err) {
          // ignore login failure here; keep userData
        }
        const roomsData = await roomService.getRooms(serverUser.id)
        setRooms(roomsData || [])
        localStorage.setItem("chatRooms", JSON.stringify(roomsData || []))
      } catch (e) {
        // ignore and leave rooms as is
      }
    })()
  }

  const saveRooms = (newRooms) => {
    setRooms(newRooms)
    localStorage.setItem("chatRooms", JSON.stringify(newRooms))
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !user ? <LandingPage onUserSet={saveUser} /> : <RoomsPage user={user} rooms={rooms} setRooms={saveRooms} />
          }
        />
        <Route
          path="/chat/:roomId"
          element={user ? <ChatPage user={user} rooms={rooms} /> : <LandingPage onUserSet={saveUser} />}
        />
        <Route
          path="/rooms"
          element={
            user ? <RoomsPage user={user} rooms={rooms} setRooms={saveRooms} /> : <LandingPage onUserSet={saveUser} />
          }
        />
      </Routes>
    </Router>
  )
}
