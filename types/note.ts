export interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  category_id?: string | null
}

export interface User {
  id: string
  email: string
  created_at: string
}
