"use client"

import { NotesProvider } from "@/lib/notes-context"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <NotesProvider>{children}</NotesProvider>
}
