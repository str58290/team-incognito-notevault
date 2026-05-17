"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          router.push("/login?error=auth_failed")
        } else {
          router.push("/dashboard")
        }
      })
    } else {
      router.push("/login")
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Completing sign in...</p>
    </div>
  )
}
