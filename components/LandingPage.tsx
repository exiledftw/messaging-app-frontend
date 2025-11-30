"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import UserSetupModal from "@/components/UserSetupModal"

export default function LandingPage({ onUserSet }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero onStartClick={() => setShowModal(true)} />
      {showModal && <UserSetupModal onClose={() => setShowModal(false)} onUserSet={onUserSet} />}
    </div>
  )
}
