"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, LogOut, Loader2 } from "lucide-react"
import { useNotes } from "@/lib/notes-context"
import { LockButton } from "@/components/ui/lock-button"
import { Lock } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, notes, isLoading, fetchNotes } = useNotes()

  useEffect(() => {
    // Redirect to login if not authenticated
    if(0){//if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // TODO: Replace with Supabase query - will fetch from database
    fetchNotes()
  }, [isAuthenticated, router, fetchNotes])

  const handleLogout = () => {
    // TODO: Replace with Supabase Auth - supabase.auth.signOut()
    logout()
    router.push("/")
  }

  if(0){// if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">NoteVault</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Your Notes</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </p>
          </div>
          <Link href="/notes/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : notes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                updatedAt={note.updated_at}
                lock_password={note.lock_password}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function NoteCard({
  id,
  title,
  content,
  updatedAt,
  lock_password,
}: {
  id: string
  title: string
  content: string
  updatedAt: string
  lock_password: string | null
}) {
  const isLocked = lock_password !== null

  const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Card className="h-full hover:border-primary/50 transition-colors relative">

      {/* Lock button — top right, stops click going to Link */}
      <div className="absolute top-3 right-3 z-10">
        <LockButton note={{ id, lock_password }} />
      </div>

      {/* Clicking the card opens the note — but only if unlocked */}
      <Link href={isLocked ? "#" : `/notes/${id}`}>
        <CardHeader className="pb-2 pr-10">
          <div className="flex items-center gap-2">
            {isLocked && <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" />}
            <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
          </div>
          <CardDescription className="text-xs">{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className={`text-sm text-muted-foreground line-clamp-3 ${
            isLocked ? "blur-sm select-none" : ""
          }`}>
            {content}
          </p>
          {isLocked && (
            <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Click the lock icon to unlock
            </p>
          )}
        </CardContent>
      </Link>

    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-medium text-foreground mb-2">No notes yet</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-sm">
        Create your first note to start organizing your thoughts and ideas.
      </p>
      <Link href="/notes/new">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Note
        </Button>
      </Link>
    </div>
  )
}
