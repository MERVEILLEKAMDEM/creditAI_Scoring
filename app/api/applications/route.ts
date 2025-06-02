import { NextResponse } from "next/server"
import { query } from "@/lib/db"

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

    return NextResponse.json(result.rows)
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

    // Simulate AI credit scoring
    let creditScore: number
    switch (creditHistory) {
      case "excellent":
        creditScore = generateCreditScore(750, 850)
        break
      case "good":
        creditScore = generateCreditScore(700, 749)
        break
      case "fair":
        creditScore = generateCreditScore(650, 699)
        break
      case "poor":
        creditScore = generateCreditScore(600, 649)
        break
      case "bad":
        creditScore = generateCreditScore(500, 599)
        break
      case "no-history":
        creditScore = generateCreditScore(550, 650)
        break
      default:
        creditScore = generateCreditScore(600, 700)
    }

    // Determine risk level and status
    const riskLevel = determineRiskLevel(creditScore)
    const status = determineStatus(riskLevel)

    // Insert application into database
    const result = await query(
      `INSERT INTO applications (
        application_id, first_name, last_name, email, phone, address, 
        employment_status, annual_income, loan_amount, loan_purpose, 
        credit_history, additional_notes, credit_score, risk_level, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        applicationId,
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
        creditScore,
        riskLevel,
        status,
      ],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}
