"use client"

import { useState } from "react"
import { authService } from "../services/api"

export default function UserSetupModal({ onClose, onUserSet }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLogin, setIsLogin] = useState(false)

  const getInitials = (first, last) => {
    return `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

        if (!username.trim() || !password) {
          setError("Please enter both username and password")
      return
    }

    try {
      if (isLogin) {
        const logged = await authService.login(username.trim(), password)
        if (logged) {
          const userData = {
            id: logged.id,
            username: logged.username,
            password: password,
            firstName: logged.first_name || firstName.trim(),
            lastName: logged.last_name || lastName.trim(),
            initials: getInitials(firstName, lastName),
            joinedAt: new Date().toISOString(),
          }
          onUserSet(userData)
        } else {
          setError("Login failed. Please check your credentials.")
          return
        }
  } else {
  const registered = await authService.register(username.trim(), password, firstName.trim(), lastName.trim())
      if (registered) {
        const userData = {
          id: registered.id,
          username: registered.username,
          password: password,
          firstName: registered.first_name || firstName.trim(),
          lastName: registered.last_name || lastName.trim(),
          initials: getInitials(firstName, lastName),
          joinedAt: new Date().toISOString(),
        }
        onUserSet(userData)
      } else {
        const userData = {
          id: Date.now().toString(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          initials: getInitials(firstName, lastName),
          joinedAt: new Date().toISOString(),
        }
        onUserSet(userData)
      }
    }
    } catch (err) {
      console.error("User registration/login failed", err)
      if (!isLogin && err?.status === 409) {
        setError("Username already taken. Please login instead.")
        setIsLogin(true)
        return
      }
      const userData = {
        id: Date.now().toString(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        initials: getInitials(firstName, lastName),
        joinedAt: new Date().toISOString(),
      }
      onUserSet(userData)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-950">{isLogin ? "Sign in" : "Welcome to Chatter"}</h2>
          <p className="text-gray-600 mt-2">{isLogin ? "Enter your credentials to sign in" : "Let's set up your profile"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-950 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-950 focus:border-transparent"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-950 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-950 focus:border-transparent"
              autoComplete="new-password"
            />
          </div>
          <div className={isLogin ? 'hidden' : ''}>
            <label className="block text-sm font-semibold text-navy-950 mb-2">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-950 focus:border-transparent"
            />
          </div>

          <div className={isLogin ? 'hidden' : ''}>
            <label className="block text-sm font-semibold text-navy-950 mb-2">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-950 focus:border-transparent"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="text-xs text-gray-500">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button type="button" className="text-blue-600 underline" onClick={() => { setIsLogin(false); setError("") }}>
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button type="button" className="text-blue-600 underline" onClick={() => { setIsLogin(true); setError("") }}>
                  Login
                </button>
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-2">Your profile will look like:</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-navy-950 to-navy-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {firstName && lastName ? getInitials(firstName, lastName) : "JD"}
              </div>
              <div>
                <p className="font-semibold text-navy-950">
                  {firstName || "John"} {lastName || "Doe"}
                </p>
                <p className="text-xs text-gray-500">Member</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-navy-950 text-white font-semibold py-2 rounded-lg hover:bg-navy-800 transition-colors"
          >
            {isLogin ? 'Sign in' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
