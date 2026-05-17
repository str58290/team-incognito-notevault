"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { Note, User } from "@/types/note"
import { supabase } from "./supabase"
import * as notesService from "./notes"

interface NotesContextType {
  // Auth state
  user: User | null
  isAuthenticated: boolean
  authLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>

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
  const [authLoading, setAuthLoading] = useState(true)

  const isAuthenticated = user !== null

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          created_at: session.user.created_at,
        })
      }
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          created_at: session.user.created_at,
        })
      } else {
        setUser(null)
        setNotes([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { success: false, error: error.message }
      return { success: true }
    },
    []
  )

  const signup = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) return { success: false, error: error.message }
      return { success: true }
    },
    []
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const fetchNotes = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await notesService.getNotes()
      setNotes(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getNote = useCallback(
    (id: string): Note | undefined => {
      return notes.find((note) => note.id === id)
    },
    [notes]
  )

  const createNote = useCallback(async (title: string, content: string): Promise<Note> => {
    const newNote = await notesService.createNote(title, content)
    setNotes((prev) => [newNote, ...prev])
    return newNote
  }, [])

  const updateNote = useCallback(async (id: string, title: string, content: string): Promise<Note> => {
    const updated = await notesService.updateNote(id, title, content)
    setNotes((prev) => prev.map((note) => (note.id === id ? updated : note)))
    return updated
  }, [])

  const deleteNote = useCallback(async (id: string): Promise<void> => {
    await notesService.deleteNote(id)
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }, [])

  return (
    <NotesContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
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
