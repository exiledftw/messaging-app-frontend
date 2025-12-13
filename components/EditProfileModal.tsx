"use client"

import { useState } from "react"
import { profileService } from "@/lib/api-service"

type User = {
    id: string | number
    firstName: string
    lastName: string
    email?: string
    username?: string
}

type Props = {
    user: User
    onClose: () => void
    onProfileUpdate: (updatedUser: Partial<User>) => void
}

export default function EditProfileModal({ user, onClose, onProfileUpdate }: Props) {
    const [firstName, setFirstName] = useState(user.firstName || "")
    const [lastName, setLastName] = useState(user.lastName || "")
    const [email, setEmail] = useState(user.email || "")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    // Email validation
    const validateEmail = (email: string): boolean => {
        if (!email) return true // Optional
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|io|co|info|biz|me|us|uk|ca|au|in|pk)$/i
        return pattern.test(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validate email if provided
        if (email && !validateEmail(email)) {
            setError("Please enter a valid email address")
            return
        }

        // Validate password confirmation
        if (newPassword && newPassword !== confirmPassword) {
            setError("New passwords do not match")
            return
        }

        // Check if changing password requires current password
        if (newPassword && !currentPassword) {
            setError("Current password is required to change password")
            return
        }

        setIsSubmitting(true)

        try {
            const updateData: any = {}

            if (firstName !== user.firstName) updateData.first_name = firstName
            if (lastName !== user.lastName) updateData.last_name = lastName
            if (email && email !== user.email) updateData.email = email
            if (newPassword) {
                updateData.current_password = currentPassword
                updateData.new_password = newPassword
            }

            // Only update if there are changes
            if (Object.keys(updateData).length === 0) {
                setError("No changes to save")
                setIsSubmitting(false)
                return
            }

            const result = await profileService.updateProfile(user.id, updateData)

            if (result) {
                // Update parent state
                onProfileUpdate({
                    firstName: result.first_name,
                    lastName: result.last_name,
                    email: result.email,
                })
                setSuccess(true)
                setTimeout(() => {
                    onClose()
                }, 1500)
            }
        } catch (err: any) {
            console.error("Failed to update profile:", err)
            setError(err.message || "Failed to update profile")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="relative bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 rounded-2xl shadow-2xl shadow-purple-500/30 max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/20 rounded-full blur-3xl"></div>

                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 z-20"
                    aria-label="Close"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Edit Profile</h2>
                            <p className="text-white/50 text-xs">Update your information</p>
                        </div>
                    </div>

                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-green-400 font-medium">Profile updated!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-200 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-200 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-200 text-sm"
                                />
                            </div>

                            {/* Password section */}
                            <div className="pt-2 border-t border-white/10">
                                <p className="text-white/50 text-xs mb-3">Leave empty to keep current password</p>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-200 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-200 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all duration-200 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                                    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-300 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
        </div>
    )
}
