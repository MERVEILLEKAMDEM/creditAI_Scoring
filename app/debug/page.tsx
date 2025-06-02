"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function DebugPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testEmail, setTestEmail] = useState("")

  const testDatabase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-auth")
      const data = await response.json()
      setResults({ type: "Database Test", data })
    } catch (error) {
      setResults({ type: "Database Test", error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const testDatabaseDetailed = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()
      setResults({ type: "Detailed Database Test", data })
    } catch (error) {
      setResults({ type: "Detailed Database Test", error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const testInitDB = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/init-db", { method: "POST" })
      const data = await response.json()
      setResults({ type: "Init DB", data })
    } catch (error) {
      setResults({ type: "Init DB", error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const checkEnvironmentVars = () => {
    setResults({
      type: "Environment Variables",
      data: {
        hasJwtSecret: !!process.env.NEXT_PUBLIC_JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        // Note: Don't expose sensitive environment variables
        message: "Check server logs for detailed environment variable status",
      },
    })
  }

  const handleTestLogin = async () => {
    if (!testEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/test-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: testEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setResults({ type: "Test Login", data })

        if (data.token && data.user) {
          login(data.token, data.user)
          toast({
            title: "Test login successful",
            description: "You are now logged in as " + data.user.name,
          })
          router.push("/dashboard")
        }
      } else {
        setResults({ type: "Test Login Error", data })
        toast({
          title: "Test login failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        })
      }
    } catch (error) {
      setResults({ type: "Test Login Error", error: error.message })
      toast({
        title: "Test login failed",
        description: "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={testDatabase} disabled={isLoading} className="w-full">
              Test Database Connection
            </Button>
            <Button onClick={testDatabaseDetailed} disabled={isLoading} className="w-full" variant="secondary">
              Detailed Database Test
            </Button>
            <Button onClick={testInitDB} disabled={isLoading} className="w-full" variant="outline">
              Initialize Database
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={checkEnvironmentVars} disabled={isLoading} className="w-full">
              Check Environment Variables
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Test Login (Development Only)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="testEmail" className="sr-only">
                  Email
                </Label>
                <Input
                  id="testEmail"
                  placeholder="Enter email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleTestLogin} disabled={isLoading}>
                Test Login
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This bypasses MFA for testing purposes. Only available in development mode.
            </p>
          </CardContent>
        </Card>
      </div>

      {results && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Results: {results.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(results.data || results.error, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
