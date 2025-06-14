import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { analyzeCreditRisk } from "@/lib/ml-model"

interface Application {
  annual_income: number;
  loan_amount: number;
  [key: string]: any;
}

// Generate a random credit score between min and max
function generateCreditScore(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Determine risk level based on credit score
function determineRiskLevel(score: number): string {
  if (score >= 700) return "Low"
  if (score >= 600) return "Medium"
  return "High"
}

// Determine application status based on risk level
function determineStatus(riskLevel: string): string {
  if (riskLevel === "Low") return "Approved"
  if (riskLevel === "Medium") return "Review"
  return "Declined"
}

// Generate a unique application ID
function generateApplicationId(): string {
  const prefix = "APP"
  const randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `${prefix}${randomDigits}`
}

// Get all applications
export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM applications 
      ORDER BY created_at DESC
    `)

    // Convert currency to XOF
    const applications = result.rows.map((app: Application) => ({
      ...app,
      annual_income: app.annual_income * 600, // USD to XOF conversion
      loan_amount: app.loan_amount * 600 // USD to XOF conversion
    }))

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

// Create a new application
export async function POST(request: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      employmentStatus,
      annualIncome,
      loanAmount,
      loanPurpose,
      creditHistory,
      additionalNotes,
    } = await request.json()

    // Generate application ID
    const applicationId = generateApplicationId()

    // Use ML model for credit scoring
    const modelResult = await analyzeCreditRisk({
      employment_status: employmentStatus,
      annual_income: Number(annualIncome),
      loan_amount: Number(loanAmount),
      loan_purpose: loanPurpose,
      credit_history: creditHistory
    })

    // Determine status based on risk level
    const status = determineStatus(modelResult.risk_level)

    // Insert application into database (store amounts in XOF)
    const result = await query(
      `INSERT INTO applications (
        application_id, first_name, last_name, email, phone, address, 
        employment_status, annual_income, loan_amount, loan_purpose, 
        credit_history, additional_notes, credit_score, risk_level, status,
        risk_probability, recommendations
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        applicationId,
        firstName,
        lastName,
        email,
        phone,
        address,
        employmentStatus,
        Number(annualIncome) * 600, // Convert to XOF
        Number(loanAmount) * 600, // Convert to XOF
        loanPurpose,
        creditHistory,
        additionalNotes,
        modelResult.credit_score,
        modelResult.risk_level,
        status,
        modelResult.probability,
        JSON.stringify(modelResult.recommendations)
      ],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}
