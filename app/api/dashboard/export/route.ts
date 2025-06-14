import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import * as XLSX from "xlsx"
import { PDFDocument, rgb } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const { type, format, dateRange, fields } = await request.json()

    // Get data based on type
    let data = []
    switch (type) {
      case "applications":
        data = await getApplicationsData(dateRange)
        break
      case "analytics":
        data = await getAnalyticsData()
        break
      case "custom":
        data = await getCustomData(fields)
        break
      default:
        throw new Error("Invalid export type")
    }

    // Generate file based on format
    let file: Buffer
    let fileName: string
    let contentType: string

    switch (format) {
      case "csv":
        file = generateCSV(data)
        fileName = `export_${type}_${new Date().toISOString()}.csv`
        contentType = "text/csv"
        break
      case "xlsx":
        file = generateXLSX(data)
        fileName = `export_${type}_${new Date().toISOString()}.xlsx`
        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        break
      case "pdf":
        file = await generatePDF(data)
        fileName = `export_${type}_${new Date().toISOString()}.pdf`
        contentType = "application/pdf"
        break
      case "json":
        file = Buffer.from(JSON.stringify(data, null, 2))
        fileName = `export_${type}_${new Date().toISOString()}.json`
        contentType = "application/json"
        break
      default:
        throw new Error("Invalid export format")
    }

    // Return file
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    )
  }
}

async function getApplicationsData(dateRange: { from: string; to: string }) {
  const { from, to } = dateRange
  const result = await query(`
    SELECT 
      a.id,
      a.applicant_name,
      a.email,
      a.loan_amount,
      a.loan_purpose,
      a.credit_score,
      a.risk_level,
      a.status,
      a.created_at,
      a.updated_at
    FROM applications a
    WHERE a.created_at BETWEEN $1 AND $2
    ORDER BY a.created_at DESC
  `, [from, to])

  return result.rows
}

async function getAnalyticsData() {
  const result = await query(`
    SELECT 
      risk_level,
      COUNT(*) as count,
      AVG(credit_score) as avg_credit_score,
      AVG(loan_amount) as avg_loan_amount
    FROM applications
    GROUP BY risk_level
    ORDER BY risk_level
  `)

  return result.rows
}

async function getCustomData(fields: string[]) {
  const columns = fields.join(", ")
  const result = await query(`
    SELECT ${columns}
    FROM applications
    ORDER BY created_at DESC
  `)

  return result.rows
}

function generateCSV(data: any[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "csv" }))
}

function generateXLSX(data: any[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }))
}

async function generatePDF(data: any[]): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const fontSize = 12

  // Add title
  page.drawText("Export Report", {
    x: 50,
    y: height - 50,
    size: 20,
    color: rgb(0, 0, 0),
  })

  // Add data
  let y = height - 100
  for (const item of data) {
    const text = JSON.stringify(item)
    if (y > 50) { // Ensure we don't write below the page
      page.drawText(text, {
        x: 50,
        y,
        size: fontSize,
        color: rgb(0, 0, 0),
      })
      y -= fontSize + 10
    }
  }

  return Buffer.from(await pdfDoc.save())
} 