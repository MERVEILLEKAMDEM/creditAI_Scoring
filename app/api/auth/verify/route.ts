import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { authenticator } from "otplib"
import { query } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: Request) {
  try {
    // Get session token from Authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      )
    }

    const sessionToken = authHeader.substring(7)

    // Verify session token
    let decoded
    try {
      decoded = jwt.verify(sessionToken, JWT_SECRET) as {
        userId: number
        email: string
        type: string
      }
    } catch (err) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      )
    }

    // Verify it's a session token
    if (decoded.type !== "session") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 401 }
      )
    }

    const { mfaCode } = await req.json()

    // Get user and their MFA secret
    const result = await query(
      "SELECT * FROM users WHERE id = $1",
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const user = result.rows[0]

    // Verify MFA code
    const isValid = authenticator.verify({
      token: mfaCode,
      secret: user.mfa_secret
    })

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid MFA code" },
        { status: 400 }
      )
    }

    // Create final authentication token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    )

    // Update last active timestamp
    await query(
      "UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $1",
      [user.id]
    )

    // Return user data (excluding sensitive information)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }

    return NextResponse.json({ token, user: userData })
  } catch (error) {
    console.error("MFA verification error:", error)
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    )
  }
} 