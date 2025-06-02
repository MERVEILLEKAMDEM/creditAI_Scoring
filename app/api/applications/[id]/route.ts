import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// Get a specific application by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await query("SELECT * FROM applications WHERE application_id = $1", [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

// Update application status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status } = await request.json()

    const result = await query(
      "UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE application_id = $2 RETURNING *",
      [status, id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}
