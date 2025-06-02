"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState("")

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const validateLogin = () => {
    const newErrors = {
      email: "",
      password: "",
    }

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!loginData.password) {
      newErrors.password = "Password is required"
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError("")

    if (!validateLogin()) {
      return
    }

    setIsLoading(true)

    try {
      console.log("Starting login process...")

      const response = await fetch("/api/auth", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email.trim(),
          password: loginData.password,
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      let data
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json()
        } catch (jsonError) {
          console.error("Failed to parse JSON response:", jsonError)
          throw new Error("Invalid response format from server")
        }
      } else {
        const textResponse = await response.text()
        console.error("Non-JSON response:", textResponse)
        throw new Error("Server returned an invalid response")
      }

      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`)
      }

      if (data.token && data.user) {
        console.log("Login successful, storing auth data...")

        // Store authentication data
        login(data.token, data.user)

        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.name}!`,
        })

        console.log("Redirecting to dashboard...")
        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        console.error("Invalid response structure:", data)
        throw new Error("Invalid response from server - missing token or user data")
      }
    } catch (error) {
      console.error("Login error:", error)

      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"

      setServerError(errorMessage)

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={loginData.email}
            onChange={(e) => {
              setLoginData((prev) => ({ ...prev, email: e.target.value }))
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: "" }))
              }
              if (serverError) {
                setServerError("")
              }
            }}
            className={errors.email ? "border-red-500" : ""}
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={loginData.password}
              onChange={(e) => {
                setLoginData((prev) => ({ ...prev, password: e.target.value }))
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: "" }))
                }
                if (serverError) {
                  setServerError("")
                }
              }}
              className={errors.password ? "border-red-500" : ""}
              disabled={isLoading}
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <p className="font-semibold">Debug Info:</p>
          <p>Email: {loginData.email}</p>
          <p>Password length: {loginData.password.length}</p>
        </div>
      )}
    </div>
  )
}
