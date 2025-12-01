"use client"

import { useState } from "react"
import { authService } from "@/lib/api-service"
import React from "react"

type UserData = {
  id: string | number
  firstName: string
  lastName: string
  initials?: string
  joinedAt?: string
}

type Props = {
  onClose: () => void
  onUserSet: (user: UserData) => void
}

export default function UserSetupModal({ onClose, onUserSet }: Props) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLogin, setIsLogin] = useState(true) // Start with login mode

  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username.trim() || !password) {
      setError("Please enter a username and password")
      return
    }

    // Try login or register depending on the modal mode. If register fails with username taken, prompt to login.
    try {
      if (isLogin) {
        const logged = await authService.login(username.trim(), password)
        if (logged) {
          const userFirstName = logged.first_name || firstName.trim() || ''
          const userLastName = logged.last_name || lastName.trim() || ''
          const userData = {
            id: logged.id,
            username: logged.username,
            password: password,
            firstName: userFirstName,
            lastName: userLastName,
            initials: getInitials(userFirstName, userLastName) || username.charAt(0).toUpperCase(),
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
        // fallback
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
    } catch (err: any) {
      console.error("User registration/login failed", err)
      // When username already exists, prompt user to login instead of silently falling back
      if (!isLogin && err?.status === 409) {
        setError("Username already taken. Please login instead.")
        setIsLogin(true)
        return
      }
      // For login errors, show a friendly message
      if (isLogin) {
        setError("Invalid username or password. Try again or register a new account.")
        return
      }
      // generic fallback behavior
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 rounded-3xl shadow-2xl shadow-purple-500/30 max-w-md w-full overflow-hidden animate-scale-in">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl"></div>
        
        {/* Close button */}
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 z-20 cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-2xl shadow-lg shadow-purple-500/40 mb-4">
              <span className="text-white font-black text-2xl">Y</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{isLogin ? "Welcome back!" : "Join Yapper"}</h2>
            <p className="text-white/60 text-sm">{isLogin ? "Sign in to continue your conversations" : "Create your account to get started"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {isLogin ? 'Sign in' : 'Create Account'}
            </button>

            <div className="text-center pt-2">
              {isLogin ? (
                <p className="text-white/60 text-sm">
                  Don't have an account?{' '}
                  <button type="button" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors" onClick={() => { setIsLogin(false); setError("") }}>
                    Register
                  </button>
                </p>
              ) : (
                <p className="text-white/60 text-sm">
                  Already have an account?{' '}
                  <button type="button" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors" onClick={() => { setIsLogin(true); setError("") }}>
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </form>

          {/* Profile preview for registration */}
          {!isLogin && (firstName || lastName) && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-xs text-white/50 mb-3">Profile preview</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {firstName && lastName ? getInitials(firstName, lastName) : "?"}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {firstName || "Your"} {lastName || "Name"}
                  </p>
                  <p className="text-xs text-white/50">@{username || "username"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
