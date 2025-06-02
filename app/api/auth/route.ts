import { NextResponse } from "next/server"
import { hash, compare } from "bcryptjs"
import { query } from "@/lib/db"
import { sign } from "jsonwebtoken"
import { sendWelcomeEmail } from "@/lib/email"

// Register a new user
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await query("SELECT * FROM users WHERE email = $1", [email])
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Insert the new user
    const result = await query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword],
    )

    return NextResponse.json(
      { message: "Signup successful!", user: result.rows[0] },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}

// Login user - Simplified without MFA
export async function PUT(request: Request) {
  try {
    console.log("=== LOGIN ATTEMPT START ===")

    // Parse request body
    let requestData
    try {
      requestData = await request.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const { email, password } = requestData
    console.log("Login attempt for email:", email)

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check JWT secret
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not set")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Query database for user
    console.log("Querying database for user...")
    let userResult
    try {
      userResult = await query("SELECT * FROM users WHERE email = $1", [email])
    } catch (dbError) {
      console.error("Database query error:", dbError)
      return NextResponse.json({ error: "Database connection error" }, { status: 500 })
    }

    console.log("Database query completed. Users found:", userResult.rows.length)

    if (userResult.rows.length === 0) {
      console.log("User not found for email:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = userResult.rows[0]
    console.log("User found:", { id: user.id, email: user.email, name: user.name })

    // Verify password
    console.log("Verifying password...")
    let passwordMatch
    try {
      passwordMatch = await compare(password, user.password_hash)
    } catch (bcryptError) {
      console.error("Password comparison error:", bcryptError)
      return NextResponse.json({ error: "Authentication error" }, { status: 500 })
    }

    console.log("Password verification result:", passwordMatch)

    if (!passwordMatch) {
      console.log("Password mismatch for user:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    console.log("Generating JWT token...")
    let token
    try {
      token = sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        jwtSecret,
        { expiresIn: "7d" },
      )
    } catch (jwtError) {
      console.error("JWT generation error:", jwtError)
      return NextResponse.json({ error: "Token generation error" }, { status: 500 })
    }

    console.log("JWT token generated successfully")

    const responseData = {
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    }

    console.log("=== LOGIN SUCCESSFUL ===")
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("=== LOGIN ERROR ===")
    console.error("Unexpected login error:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        error: "An unexpected error occurred during login",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
