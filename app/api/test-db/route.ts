import { NextResponse } from "next/server"
import { query, testConnection } from "@/lib/db"

export async function GET() {
  try {
    console.log("Testing database connection...")

    // Test basic connection
    const connectionTest = await testConnection()
    if (!connectionTest) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Test users table exists
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `)

    const usersTableExists = tableCheck.rows[0].exists

    // Get user count if table exists
    let userCount = 0
    if (usersTableExists) {
      const countResult = await query("SELECT COUNT(*) as count FROM users")
      userCount = Number.parseInt(countResult.rows[0].count)
    }

    // Test environment variables
    const envCheck = {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasDbHost: !!process.env.POSTGRES_HOST,
      hasDbUser: !!process.env.POSTGRES_USER,
      hasDbPassword: !!process.env.POSTGRES_PASSWORD,
      hasDbName: !!process.env.POSTGRES_DATABASE,
    }

    return NextResponse.json({
      status: "ok",
      database: {
        connected: true,
        usersTableExists,
        userCount,
      },
      environment: envCheck,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
