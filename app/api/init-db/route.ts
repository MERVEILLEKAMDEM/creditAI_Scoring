import { NextResponse } from "next/server"
import { initializeDatabase, testConnection } from "@/lib/db"

export async function POST() {
  try {
    // Test connection first
    const connectionTest = await testConnection()
    if (!connectionTest) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Initialize database
    await initializeDatabase()

    return NextResponse.json({
      message: "Database initialized successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const connectionTest = await testConnection()

    return NextResponse.json({
      connected: connectionTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
