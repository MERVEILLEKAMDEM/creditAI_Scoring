import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sign } from "jsonwebtoken"

// This is a development-only endpoint for quick testing
export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    const { email } = await request.json()

    // Find user by email
    const userResult = await query("SELECT * FROM users WHERE email = $1", [email])

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userResult.rows[0]

    // Create JWT token
    const token = sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "1d",
    })

    return NextResponse.json({
      message: "Test login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    console.error("Test login error:", error)
    return NextResponse.json({ error: "An error occurred during test login" }, { status: 500 })
  }
}
