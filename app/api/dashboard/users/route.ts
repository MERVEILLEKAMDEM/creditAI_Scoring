import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Get all users
    const usersResult = await query(`
      SELECT 
        id,
        name,
        email,
        role,
        status,
        last_active as "lastActive"
      FROM users
      ORDER BY id DESC
    `)

    // Get user stats
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN last_active >= NOW() - INTERVAL '24 hours' THEN 1 END) as active_today,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_this_week
      FROM users
    `)

    const stats = statsResult.rows[0]

    return NextResponse.json({
      users: usersResult.rows,
      stats: {
        total: parseInt(stats.total),
        adminCount: parseInt(stats.admin_count),
        userCount: parseInt(stats.user_count),
        activeCount: parseInt(stats.active_count),
        activeToday: parseInt(stats.active_today),
        newThisWeek: parseInt(stats.new_this_week)
      }
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
} 