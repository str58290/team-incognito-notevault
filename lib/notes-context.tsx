"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type { Note, User } from "@/types/note"
import { mockNotes, mockUser, delay } from "@/lib/mock-data"

interface NotesContextType {
  // Auth state
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void

  // Notes state
  notes: Note[]
  isLoading: boolean
  fetchNotes: () => Promise<void>
  getNote: (id: string) => Note | undefined
  createNote: (title: string, content: string) => Promise<Note>
  updateNote: (id: string, title: string, content: string) => Promise<Note>
  deleteNote: (id: string) => Promise<void>
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = user !== null

  // TODO: Replace with Supabase Auth - supabase.auth.signInWithPassword()
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      await delay(500) // Simulate network delay

      // Mock validation
      if (!email || !password) {
        return { success: false, error: "Email and password are required" }
      }

      if (password.length < 6) {
        return { success: false, error: "Invalid credentials" }
      }

      // Mock successful login
      setUser({ ...mockUser, email })
      return { success: true }
    },
    []
  )

  // TODO: Replace with Supabase Auth - supabase.auth.signUp()
  const signup = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      await delay(500) // Simulate network delay

      // Mock validation
      if (!email || !password) {
        return { success: false, error: "Email and password are required" }
      }

      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" }
      }

      // Mock successful signup
      setUser({
        id: `user-${Date.now()}`,
        email,
        created_at: new Date().toISOString(),
      })
      return { success: true }
    },
    []
  )

  // TODO: Replace with Supabase Auth - supabase.auth.signOut()
  const logout = useCallback(() => {
    setUser(null)
    setNotes([])
  }, [])

  // TODO: Replace with Supabase query - supabase.from('notes').select('*').eq('user_id', user.id)
  const fetchNotes = useCallback(async () => {
    setIsLoading(true)
    await delay(300) // Simulate network delay
    setNotes(mockNotes)
    setIsLoading(false)
  }, [])

  const getNote = useCallback(
    (id: string): Note | undefined => {
      return notes.find((note) => note.id === id)
    },
    [notes]
  )

  // TODO: Replace with Supabase insert - supabase.from('notes').insert()
  const createNote = useCallback(
    async (title: string, content: string): Promise<Note> => {
      await delay(300) // Simulate network delay

      const newNote: Note = {
        id: `note-${Date.now()}`,
        title,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user?.id || "user-1",
      }

      setNotes((prev) => [newNote, ...prev])
      return newNote
    },
    [user]
  )

  // TODO: Replace with Supabase update - supabase.from('notes').update().eq('id', id)
  const updateNote = useCallback(
    async (id: string, title: string, content: string): Promise<Note> => {
      await delay(300) // Simulate network delay

      const updatedNote: Note = {
        id,
        title,
        content,
        created_at: notes.find((n) => n.id === id)?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user?.id || "user-1",
      }

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      )
      return updatedNote
    },
    [notes, user]
  )

  // TODO: Replace with Supabase delete - supabase.from('notes').delete().eq('id', id)
  const deleteNote = useCallback(async (id: string): Promise<void> => {
    await delay(300) // Simulate network delay
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }, [])

  return (
    <NotesContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        notes,
        isLoading,
        fetchNotes,
        getNote,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider")
  }
  return context
}
