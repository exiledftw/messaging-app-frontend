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
      {showModal && <UserSetupModal onClose={() => setShowModal(false)} onUserSet={onUserSet} />}
    </div>
  )
}
