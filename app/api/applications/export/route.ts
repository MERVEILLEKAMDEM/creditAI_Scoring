import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import * as XLSX from "xlsx"
import PDFDocument from "pdfkit"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const currency = searchParams.get("currency") || "XOF"

    // Fetch applications data
    const result = await query(`
      SELECT 
        application_id,
        first_name,
        last_name,
        email,
        phone,
        employment_status,
        annual_income,
        loan_amount,
        loan_purpose,
        credit_history,
        credit_score,
        risk_level,
        status,
        created_at
      FROM applications 
      ORDER BY created_at DESC
    `)

    // Convert currency if needed
    const applications = result.rows.map(app => ({
      ...app,
      annual_income: currency === "XOF" ? app.annual_income : app.annual_income / 600,
      loan_amount: currency === "XOF" ? app.loan_amount : app.loan_amount / 600
    }))

    // Format data based on requested format
    switch (format) {
      case "csv": {
        const worksheet = XLSX.utils.json_to_sheet(applications)
        const csvContent = XLSX.utils.sheet_to_csv(worksheet)
        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="applications_${new Date().toISOString()}.csv"`
          }
        })
      }

      case "xlsx": {
        const worksheet = XLSX.utils.json_to_sheet(applications)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applications")
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="applications_${new Date().toISOString()}.xlsx"`
          }
        })
      }

      case "pdf": {
        const doc = new PDFDocument()
        const chunks: Buffer[] = []

        doc.on("data", (chunk: Buffer) => chunks.push(chunk))
        
        // Add content to PDF
        doc.fontSize(16).text("Credit Applications Report", { align: "center" })
        doc.moveDown()
        
        applications.forEach(app => {
          doc.fontSize(12).text(`Application ID: ${app.application_id}`)
          doc.fontSize(10).text(`Applicant: ${app.first_name} ${app.last_name}`)
          doc.text(`Email: ${app.email}`)
          doc.text(`Credit Score: ${app.credit_score}`)
          doc.text(`Risk Level: ${app.risk_level}`)
          doc.text(`Status: ${app.status}`)
          doc.text(`Annual Income: ${currency} ${app.annual_income.toLocaleString()}`)
          doc.text(`Loan Amount: ${currency} ${app.loan_amount.toLocaleString()}`)
          doc.moveDown()
        })

        doc.end()

        return new Promise((resolve) => {
          doc.on("end", () => {
            const buffer = Buffer.concat(chunks)
            resolve(new NextResponse(buffer, {
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="applications_${new Date().toISOString()}.pdf"`
              }
            }))
          })
        })
      }

      default:
        return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error exporting applications:", error)
    return NextResponse.json({ error: "Failed to export applications" }, { status: 500 })
  }
} 