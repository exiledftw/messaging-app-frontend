"use client"

import { useState } from "react"
import Navigation from "../components/Navigation"
import UserSetupModal from "../components/UserSetupModal"
import Hero from "../components/Hero"

export default function LandingPage({ onUserSet }) {
  const [showModal, setShowModal] = useState(false)

  const handleStartClick = () => {
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero onStartClick={handleStartClick} />
      {showModal && <UserSetupModal onClose={() => setShowModal(false)} onUserSet={onUserSet} />}
    </div>
  )
}
