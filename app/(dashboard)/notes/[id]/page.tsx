"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FileText, ArrowLeft, Loader2, Trash2 } from "lucide-react"
import { useNotes } from "@/lib/notes-context"

export default function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated, notes, getNote, updateNote, deleteNote, fetchNotes } = useNotes()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if(0){//if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Fetch notes if not already loaded
    if (notes.length === 0) {
      fetchNotes().then(() => setIsLoaded(true))
    } else {
      setIsLoaded(true)
    }
  }, [isAuthenticated, router, notes.length, fetchNotes])

  useEffect(() => {
    if (isLoaded) {
      // TODO: Replace with Supabase query - supabase.from('notes').select('*').eq('id', id).single()
      const note = getNote(id)
      if (note) {
        setTitle(note.title)
        setContent(note.content)
      } else {
        // Note not found, redirect to dashboard
        router.push("/dashboard")
      }
    }
  }, [isLoaded, id, getNote, router])

  if(0){//if (!isAuthenticated || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleSave = async () => {
    if (!title.trim()) return

    setIsSaving(true)

    // TODO: Replace with Supabase update - supabase.from('notes').update().eq('id', id)
    await updateNote(id, title.trim(), content.trim())

    setIsSaving(false)
    router.push("/dashboard")
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    // TODO: Replace with Supabase delete - supabase.from('notes').delete().eq('id', id)
    await deleteNote(id)

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
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                  <span className="ml-2 hidden sm:inline">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your note.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-white hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={handleSave} disabled={!title.trim() || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="space-y-6">
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
        </div>
      </main>
    </div>
  )
}
