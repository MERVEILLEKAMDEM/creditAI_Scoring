import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Get total applicants
    const totalApplicantsResult = await query("SELECT COUNT(*) as count FROM applicants")
    const totalApplicants = Number.parseInt(totalApplicantsResult.rows[0].count)

    // Get approved amount
    const approvedAmountResult = await query(`
      SELECT SUM(loan_amount) as total 
      FROM applicants 
      WHERE status = 'Approved'
    `)
    const approvedAmount = Number.parseFloat(approvedAmountResult.rows[0].total || 0)

    // Get average credit score
    const avgScoreResult = await query("SELECT AVG(credit_score) as avg FROM applicants")
    const averageScore = Math.round(Number.parseFloat(avgScoreResult.rows[0].avg || 0))

    // Get high risk rate
    const highRiskResult = await query(`
      SELECT 
        COUNT(CASE WHEN risk_level = 'High' THEN 1 END) as high_risk,
        COUNT(*) as total
      FROM applicants
    `)
    const highRiskRate =
      totalApplicants > 0
        ? ((Number.parseInt(highRiskResult.rows[0].high_risk) / totalApplicants) * 100).toFixed(1)
        : "0.0"

    // Get risk distribution
    const riskDistributionResult = await query(`
      SELECT 
        risk_level,
        COUNT(*) as count
      FROM applicants
      GROUP BY risk_level
    `)

    const riskDistribution = {
      Low: 0,
      Medium: 0,
      High: 0,
    }

    riskDistributionResult.rows.forEach((row) => {
      riskDistribution[row.risk_level as keyof typeof riskDistribution] = Number.parseInt(row.count)
    })

    return NextResponse.json({
      totalApplicants,
      approvedAmount,
      averageScore,
      highRiskRate: Number.parseFloat(highRiskRate),
      riskDistribution,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
