"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { NotesProvider } from "@/lib/notes-context"
import { supabase } from "@/lib/supabase"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login")
    })
  }, [router])

  return <NotesProvider>{children}</NotesProvider>
}
