"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import UserSetupModal from "@/components/UserSetupModal"

type UserData = {
  id: string | number
  firstName: string
  lastName: string
  initials?: string
  joinedAt?: string
}

type Props = {
  onUserSet: (user: UserData) => void
}

export default function LandingPage({ onUserSet }: Props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <Hero onStartClick={() => setShowModal(true)} />

      {/* Copyright Footer */}
      <footer className="py-6 text-center">
        <p className="text-white/20 text-xs font-light tracking-wider">
          © {new Date().getFullYear()} Yapper Inc. All rights reserved.
        </p>
      </footer>

      {showModal && <UserSetupModal onClose={() => setShowModal(false)} onUserSet={onUserSet} />}
    </div>
  )
}
