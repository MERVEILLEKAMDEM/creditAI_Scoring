import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Get total applications
    const totalResult = await query("SELECT COUNT(*) as count FROM applications")
    const totalApplications = parseInt(totalResult.rows[0].count)

    // If no applications, return default values
    if (totalApplications === 0) {
      return NextResponse.json({
        totalApplications: 0,
        averageCreditScore: 0,
        approvalRate: 0,
        riskDistribution: [],
        creditScoreDistribution: [],
        monthlyTrends: []
      })
    }

    // Get average credit score
    const scoreResult = await query("SELECT AVG(credit_score) as average FROM applications")
    const averageCreditScore = parseFloat(scoreResult.rows[0].average) || 0

    // Get approval rate
    const approvalResult = await query(`
      SELECT 
        COALESCE(COUNT(CASE WHEN status = 'Approved' THEN 1 END)::float / NULLIF(COUNT(*), 0)::float, 0) as rate 
      FROM applications
    `)
    const approvalRate = parseFloat(approvalResult.rows[0].rate) || 0

    // Get risk distribution
    const riskResult = await query(`
      SELECT risk_level as name, COUNT(*) as value 
      FROM applications 
      GROUP BY risk_level
      ORDER BY risk_level
    `)
    const riskDistribution = riskResult.rows

    // Get credit score distribution
    const creditScoreResult = await query(`
      SELECT 
        CASE 
          WHEN credit_score < 580 THEN 'Poor (300-579)'
          WHEN credit_score < 670 THEN 'Fair (580-669)'
          WHEN credit_score < 740 THEN 'Good (670-739)'
          WHEN credit_score < 800 THEN 'Very Good (740-799)'
          ELSE 'Excellent (800-850)'
        END as range,
        COUNT(*) as count
      FROM applications
      WHERE credit_score IS NOT NULL
      GROUP BY range
      ORDER BY range
    `)
    const creditScoreDistribution = creditScoreResult.rows

    // Get monthly trends
    const trendsResult = await query(`
      WITH monthly_stats AS (
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as applications,
          COALESCE(COUNT(CASE WHEN status = 'Approved' THEN 1 END)::float / NULLIF(COUNT(*), 0)::float, 0) as approval_rate
        FROM applications
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
      )
      SELECT 
        TO_CHAR(month, 'Mon YYYY') as month,
        applications,
        approval_rate as "approvalRate"
      FROM monthly_stats
      ORDER BY month ASC
    `)
    const monthlyTrends = trendsResult.rows

    return NextResponse.json({
      totalApplications,
      averageCreditScore,
      approvalRate,
      riskDistribution,
      creditScoreDistribution,
      monthlyTrends
    })
  } catch (error) {
    console.error("Error fetching analysis data:", error)
    return NextResponse.json({ error: "Failed to fetch analysis data" }, { status: 500 })
  }
} 