"use client"

import { useState } from "react"
import { Lock, LockOpen, X } from "lucide-react"
import { useNotes } from "@/lib/notes-context"

interface LockButtonProps {
  note: {
    id: string
    lock_password: string | null
  }
}

export function LockButton({ note }: LockButtonProps) {
  const { lockNote, verifyNote, removeLock } = useNotes()

  const [showPrompt, setShowPrompt] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isLocked = note.lock_password !== null

  // What mode is the prompt in
  // "lock" = setting a new password
  // "unlock" = entering password to remove lock
  const [mode, setMode] = useState<"lock" | "unlock">("lock")

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()  // prevent opening the note
    e.preventDefault()
    setPassword("")
    setError("")
    setMode(isLocked ? "unlock" : "lock")
    setShowPrompt(true)
  }

  const handleSubmit = async () => {
    if (password.length < 4) {
      setError("Password must be at least 4 characters")
      return
    }

    setIsLoading(true)
    try {
      if (mode === "lock") {
        // Setting a new lock
        await lockNote(note.id, password)
        setShowPrompt(false)
      } else {
        // Removing an existing lock
        const correct = await verifyNote(note.id, password)
        if (correct) {
          await removeLock(note.id)
          setShowPrompt(false)
        } else {
          setError("Incorrect password")
        }
      }
    } catch (err) {
      setError("Something went wrong. Try again.")
    } finally {
      setIsLoading(false)
      setPassword("")
    }
  }

  return (
    <>
      {/* Lock/unlock icon — import this wherever your note card is */}
      <button
        onClick={handleIconClick}
        className="p-1 rounded hover:bg-gray-100 transition-colors"
        title={isLocked ? "Unlock note" : "Lock note"}
      >
        {isLocked
          ? <Lock className="w-4 h-4 text-amber-500" />
          : <LockOpen className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        }
      </button>

      {/* Password prompt modal */}
      {showPrompt && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPrompt(false)}  // click outside to close
        >
          <div
            className="bg-white rounded-xl p-6 w-80 shadow-xl"
            onClick={(e) => e.stopPropagation()}  // don't close when clicking inside
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {mode === "lock"
                  ? <Lock className="w-5 h-5 text-amber-500" />
                  : <LockOpen className="w-5 h-5 text-amber-500" />
                }
                <h3 className="font-semibold text-lg">
                  {mode === "lock" ? "Lock this note" : "Unlock this note"}
                </h3>
              </div>
              <button onClick={() => setShowPrompt(false)}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {mode === "lock"
                ? "Set a password to protect this note."
                : "Enter your password to remove the lock."
              }
            </p>

            {/* Password input */}
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full border rounded-lg px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              autoFocus
            />

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-xs mb-3">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isLoading
                  ? "Please wait..."
                  : mode === "lock" ? "Lock Note" : "Remove Lock"
                }
              </button>
              <button
                onClick={() => { setShowPrompt(false); setPassword(""); setError("") }}
                className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}