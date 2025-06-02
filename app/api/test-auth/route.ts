import { NextResponse } from "next/server"
import { query, testConnection } from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    const connectionTest = await testConnection()
    if (!connectionTest) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Test if we can query users table
    const userCount = await query("SELECT COUNT(*) as count FROM users")

    // Test if we have any users
    const sampleUser = await query("SELECT email FROM users LIMIT 1")

    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount: userCount.rows[0].count,
      hasUsers: sampleUser.rows.length > 0,
      sampleEmail: sampleUser.rows[0]?.email || "none",
    })
  } catch (error) {
    console.error("Test auth error:", error)
    return NextResponse.json(
      {
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
