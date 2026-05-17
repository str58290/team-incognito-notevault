import { supabase } from "./supabase"

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  if (error) throw error
  return data
}

export async function createCategory(name: string, color: string): Promise<Category> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, color, user_id: user!.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCategory(id: string, name: string, color: string): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update({ name, color, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) throw error
}
