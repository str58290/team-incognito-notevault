import type { Note, User } from "@/types/note"

// TODO: Replace with Supabase Auth
export const mockUser: User = {
  id: "user-1",
  email: "demo@notevault.app",
  created_at: "2024-01-15T10:00:00Z",
}

// TODO: Replace with Supabase database queries
export const mockNotes: Note[] = [
  {
    id: "note-1",
    title: "Welcome to NoteVault",
    content:
      "This is your first note. NoteVault helps you organize your thoughts and ideas in a secure, elegant way. Start writing and let your creativity flow!",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    user_id: "user-1",
  },
  {
    id: "note-2",
    title: "Meeting Notes - Q1 Planning",
    content:
      "Discussed roadmap for Q1. Key priorities: improve onboarding flow, add collaboration features, optimize performance. Follow up with design team next week.",
    created_at: "2024-01-16T14:00:00Z",
    updated_at: "2024-01-17T09:15:00Z",
    user_id: "user-1",
  },
  {
    id: "note-3",
    title: "Book Recommendations",
    content:
      "1. Atomic Habits by James Clear\n2. Deep Work by Cal Newport\n3. The Psychology of Money by Morgan Housel\n4. Thinking, Fast and Slow by Daniel Kahneman",
    created_at: "2024-01-18T08:45:00Z",
    updated_at: "2024-01-18T08:45:00Z",
    user_id: "user-1",
  },
  {
    id: "note-4",
    title: "Recipe: Pasta Primavera",
    content:
      "Ingredients:\n- 400g penne pasta\n- 2 cups mixed vegetables\n- 3 cloves garlic\n- Olive oil\n- Parmesan cheese\n- Fresh basil\n\nCook pasta, sauté vegetables with garlic, combine and top with cheese and basil.",
    created_at: "2024-01-19T19:20:00Z",
    updated_at: "2024-01-19T19:20:00Z",
    user_id: "user-1",
  },
]

// Helper to simulate async behavior like real Supabase calls
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
