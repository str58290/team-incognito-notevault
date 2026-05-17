import { supabase } from "./supabase"
import type { Note } from "@/types/note"

// supabase.auth.getUser to see their own notes
export async function getNotes(): Promise<Note[]> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function createNote(title: string, content: string): Promise<Note> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("notes")
    .insert({ title, content, user_id: user!.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateNote(id: string, title: string, content: string): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", id)
  if (error) throw error
}
