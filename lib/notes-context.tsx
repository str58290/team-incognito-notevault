"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react"
import type { Note, User } from "@/types/note"
import { supabase } from "@/lib/supabase"
import { hashLockPassword, verifyLockPassword } from "@/lib/lock-utils"

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
  lockNote: (id: string, password: string) => Promise<void>
  verifyNote: (id: string, password: string) => Promise<boolean>
  removeLock: (id: string) => Promise<void>
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = user !== null

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Auth initialization error:", error)
          return
        }
        if (data.session?.user) {
          // Ensure user exists in users table
          await supabase
            .from('users')
            .upsert({
              id: data.session.user.id,
              email: data.session.user.email || "",
              created_at: new Date().toISOString(),
            })

          setUser({
            id: data.session.user.id,
            email: data.session.user.email || "",
            created_at: data.session.user.created_at,
          })
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err)
      }
    }
    initializeAuth()
  }, [])

  // Login with Supabase Auth
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!email || !password) {
        return { success: false, error: "Email and password are required" }
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error("Login error:", error)
          // Map Supabase error messages to user-friendly messages
          if (error.message?.includes("Invalid login credentials")) {
            return { success: false, error: "Invalid login credentials. Please check your email and password." }
          }
          if (error.message?.includes("User not found")) {
            return { success: false, error: "Invalid login credentials" }
          }
          if (error.message?.includes("Network error")) {
            return { success: false, error: "Network error. Please check your connection and try again." }
          }
          return { success: false, error: error.message || "Login failed" }
        }

        if (data.user) {
          // Ensure user exists in users table
          const { error: upsertError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email || "",
              created_at: new Date().toISOString(),
            })

          if (upsertError) {
            console.error("Error updating user in database:", upsertError)
          }

          setUser({
            id: data.user.id,
            email: data.user.email || "",
            created_at: data.user.created_at,
          })
          return { success: true }
        }

        return { success: false, error: "Login failed" }
      } catch (err: any) {
        console.error("Login exception:", err)
        const errorMessage = err?.message || err?.toString() || "An error occurred during login"
        if (errorMessage.includes("fetch")) {
          return { success: false, error: "Failed to connect to server. Please check your internet connection." }
        }
        return { success: false, error: errorMessage }
      }
    },
    []
  )

  // Signup with Supabase Auth
  const signup = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!email || !password) {
        return { success: false, error: "Email and password are required" }
      }

      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" }
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          console.error("Signup error:", error)
          // Map Supabase error messages to user-friendly messages
          if (error.message?.includes("already registered")) {
            return { success: false, error: "This email is already registered. Please log in." }
          }
          if (error.message?.includes("User already exists")) {
            return { success: false, error: "This email is already registered. Please log in." }
          }
          if (error.message?.includes("Network error")) {
            return { success: false, error: "Network error. Please check your connection and try again." }
          }
          return { success: false, error: error.message || "Signup failed" }
        }

        if (data.user) {
          // Also insert into users table
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email || "",
              created_at: new Date().toISOString(),
            })

          if (insertError) {
            console.error("Error inserting user into database:", insertError)
            // Still succeed even if table insert fails - user can still login
          }

          setUser({
            id: data.user.id,
            email: data.user.email || "",
            created_at: data.user.created_at,
          })
          return { success: true }
        }

        return { success: false, error: "Signup failed" }
      } catch (err: any) {
        console.error("Signup exception:", err)
        const errorMessage = err?.message || err?.toString() || "An error occurred during signup"
        if (errorMessage.includes("fetch")) {
          return { success: false, error: "Failed to connect to server. Please check your internet connection." }
        }
        return { success: false, error: errorMessage }
      }
    },
    []
  )

  // Logout with Supabase Auth
  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setNotes([])
  }, [])

  // Fetch notes from Supabase
  const fetchNotes = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error fetching notes:", error)
        return
      }

      setNotes(
        data.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          user_id: note.user_id,
          created_at: note.created_at,
          updated_at: note.updated_at,
          lock_password: note.lock_password ?? null,
        }))
      )
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const getNote = useCallback(
    (id: string): Note | undefined => {
      return notes.find((note) => note.id === id)
    },
    [notes]
  )

  // Create note in Supabase
  const createNote = useCallback(
    async (title: string, content: string): Promise<Note> => {
      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase.from("notes").insert({
        title,
        content,
        user_id: user.id,
      }).select().single()

      if (error) {
        console.error("Error creating note:", error)
        throw error
      }

      const newNote: Note = {
        id: data.id,
        title: data.title,
        content: data.content,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        lock_password: null,
      }

      setNotes((prev) => [newNote, ...prev])
      return newNote
    },
    [user]
  )

  // Update note in Supabase
  const updateNote = useCallback(
    async (id: string, title: string, content: string): Promise<Note> => {
      if (!user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("notes")
        .update({
          title,
          content,
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating note:", error)
        throw error
      }

      const updatedNote: Note = {
        id: data.id,
        title: data.title,
        content: data.content,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        lock_password: data.lock_password ?? null, // preserve existing lock, never reset it
      }

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      )
      return updatedNote
    },
    [user]
  )

  // Delete note from Supabase
  const deleteNote = useCallback(
    async (id: string): Promise<void> => {
      if (!user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error deleting note:", error)
        throw error
      }

      setNotes((prev) => prev.filter((note) => note.id !== id))
    },
    [user]
  )

  // Lock a note — hashes password and saves to lock_password column
  const lockNote = useCallback(
    async (id: string, password: string): Promise<void> => {
      if (!user) throw new Error("User not authenticated")

      const hashedPassword = await hashLockPassword(password)

      const { error } = await supabase
        .from("notes")
        .update({ lock_password: hashedPassword })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      // Update local state so UI reflects lock immediately
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, lock_password: hashedPassword } : note
        )
      )
    },
    [user]
  )

  // Verify password — returns true/false, does NOT change DB
  const verifyNote = useCallback(
    async (id: string, password: string): Promise<boolean> => {
      const { data, error } = await supabase
        .from("notes")
        .select("lock_password")
        .eq("id", id)
        .single()

      if (error || !data?.lock_password) return false
      return verifyLockPassword(password, data.lock_password)
    },
    []
  )

  // Remove lock — sets lock_password back to null
  const removeLock = useCallback(
    async (id: string): Promise<void> => {
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("notes")
        .update({ lock_password: null })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) throw error

      // Update local state so UI reflects unlock immediately
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, lock_password: null } : note
        )
      )
    },
    [user]
  )

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
        lockNote,
        verifyNote,
        removeLock,
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
