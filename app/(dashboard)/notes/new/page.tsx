"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, ArrowLeft, Loader2 } from "lucide-react"
import { useNotes } from "@/lib/notes-context"

export default function NewNotePage() {
  const router = useRouter()
  const { isAuthenticated, createNote } = useNotes()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    setIsSaving(true)

    // TODO: Replace with Supabase insert - supabase.from('notes').insert()
    await createNote(title.trim(), content.trim())

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg text-foreground hidden sm:block">NoteVault</span>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={!title.trim() || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Note"
            )}
          </Button>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="sr-only">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-semibold h-auto py-3 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary px-0"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="sr-only">
              Content
            </Label>
            <Textarea
              id="content"
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] resize-none border-0 focus-visible:ring-0 px-0 text-base leading-relaxed"
            />
          </div>
        </form>
      </main>
    </div>
  )
}
