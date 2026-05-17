"use client"

import { useState } from "react"

export default function DebugPage() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")

  const testConnection = async () => {
    setLoading(true)
    setResponse("Testing Supabase connection...\n")

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setResponse((prev) => prev + `\n✓ URL: ${url}\n✓ Key: ${key ? "SET" : "NOT SET"}\n`)

      if (!url || !key) {
        setResponse((prev) => prev + "\n❌ Missing environment variables!")
        setLoading(false)
        return
      }

      // Test basic fetch to Supabase
      const testResponse = await fetch(`${url}/auth/v1/health`, {
        headers: {
          "apikey": key,
        },
      })

      const data = await testResponse.json()
      setResponse(
        (prev) =>
          prev +
          `\n✓ Supabase Health Check: ${testResponse.status}\n${JSON.stringify(data, null, 2)}`
      )
    } catch (err: any) {
      setResponse(
        (prev) =>
          prev + `\n❌ Error: ${err?.message || err}\n\nTroubleshooting:\n1. Check if URL is correct\n2. Verify project exists in Supabase dashboard\n3. Check F12 DevTools Network tab for details`
      )
    }

    setLoading(false)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>

      <button
        onClick={testConnection}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
      >
        {loading ? "Testing..." : "Test Connection"}
      </button>

      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-sm">
        {response || "Click 'Test Connection' to start"}
      </pre>

      <div className="mt-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <h2 className="font-bold mb-2">Troubleshooting Checklist:</h2>
        <ul className="text-sm space-y-1">
          <li>☐ Project exists at https://app.supabase.com</li>
          <li>☐ .env.local has correct URL and key</li>
          <li>☐ Dev server restarted after .env.local changes</li>
          <li>☐ CORS added for localhost:3000 in Supabase settings</li>
          <li>☐ Check F12 DevTools Console for errors</li>
        </ul>
      </div>
    </div>
  )
}
