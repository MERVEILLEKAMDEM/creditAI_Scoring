import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/init"

// Use module-level variable for initialization state
let isInitialized = false

export async function GET() {
  try {
    if (!isInitialized) {
      console.log('Initializing database...')
      await initializeDatabase()
      isInitialized = true
      return NextResponse.json({ message: "Database initialized successfully" })
    }
    return NextResponse.json({ message: "Database already initialized" })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 }
    )
  }
} 