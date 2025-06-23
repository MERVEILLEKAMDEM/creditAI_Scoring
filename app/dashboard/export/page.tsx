'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { predictionStorage, Prediction } from "@/lib/predictions"
import { Download, FileText, BarChart2 } from "lucide-react"

// Note: PDF export will not work until these packages are installed.
// You can install them by running: pnpm install jspdf jspdf-autotable
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

type ExportFormat = "csv" | "json" | "pdf"

export default function ExportPage() {
  const [predictionsFormat, setPredictionsFormat] = useState<ExportFormat>("csv")
  const [analyticsFormat, setAnalyticsFormat] = useState<ExportFormat>("json")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [allChecked, setAllChecked] = useState(false)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [analyticsAllChecked, setAnalyticsAllChecked] = useState(false)
  const [analyticsSelectedIds, setAnalyticsSelectedIds] = useState<string[]>([])

  useEffect(() => {
    setPredictions(predictionStorage.getAllPredictions())
  }, [])

  const handleSelectAll = () => {
    if (allChecked) {
      setSelectedIds([])
      setAllChecked(false)
    } else {
      setSelectedIds(predictions.map(p => p.id))
      setAllChecked(true)
    }
  }

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleSingleExport = (prediction: Prediction) => {
    setIsLoading(true)
    const data = [{
      'ID': prediction.id.substring(0, 8),
      'Date': new Date(prediction.timestamp).toISOString().split('T')[0],
      'Age': prediction.input.age,
      'Income': prediction.input.income,
      'Loan Amount': prediction.input.loan_amount,
      'Int. Rate': prediction.input.interest_rate,
      'Turnover': prediction.input.turnover,
      'Cust. Tenure': prediction.input.customer_tenure,
      'Late Payments': prediction.input.num_late_payments_current,
      'Unpaid Amt': prediction.input.unpaid_amount,
      'Industry': prediction.input.industry_sector,
      'Credit Type': prediction.input.credit_type,
      'Guarantee': prediction.input.has_guarantee ? 'Yes' : 'No',
      'Guarantee Type': prediction.input.guarantee_type,
      'Repay Freq.': prediction.input.repayment_frequency,
      'Risk': prediction.result.prediction === 1 ? 'High' : 'Low',
      'P(Good)': prediction.result.probability_good.toFixed(3),
      'P(Bad)': prediction.result.probability_bad.toFixed(3),
      'Explanation': generateExplanation(prediction)
    }]
    if (predictionsFormat === "csv") {
      const headers = Object.keys(data[0]).join(',')
      const rows = data.map(row => Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      const csvContent = [headers, ...rows].join('\n')
      exportToFile(csvContent, 'text/csv;charset=utf-8;', `prediction_${prediction.id}.csv`)
    } else if (predictionsFormat === "json") {
      const jsonContent = JSON.stringify(data, null, 2)
      exportToFile(jsonContent, 'application/json', `prediction_${prediction.id}.json`)
    } else if (predictionsFormat === "pdf") {
      const doc = new jsPDF({ orientation: "landscape" })
      doc.text("Prediction Data", 14, 15)
      doc.setFontSize(8)
      doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 20)
      autoTable(doc, {
        head: [Object.keys(data[0])],
        body: data.map(row => Object.values(row)),
        startY: 25,
        styles: { fontSize: 6.5, cellPadding: 1.5, overflow: 'linebreak' },
        headStyles: { fontSize: 7, fontStyle: 'bold', fillColor: '#3B82F6' },
        columnStyles: {
          'Explanation': { cellWidth: 60 },
          'ID': { cellWidth: 18 },
          'Date': { cellWidth: 18 },
          'Age': { cellWidth: 10 },
          'P(Good)': { cellWidth: 15 },
          'P(Bad)': { cellWidth: 15 },
          'Risk': { cellWidth: 10 },
        },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages()
          doc.setFontSize(8)
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10)
        }
      })
      doc.save(`prediction_${prediction.id}.pdf`)
    }
    setIsLoading(false)
  }

  const handlePredictionsExport = () => {
    setIsLoading(true)
    const allPredictions = predictionStorage.getAllPredictions()
    let filtered = allPredictions
    if (selectedIds.length > 0) {
      filtered = allPredictions.filter(p => selectedIds.includes(p.id))
    }
    if (filtered.length === 0) {
      alert("No prediction data to export.")
      setIsLoading(false)
      return
    }
    const data = filtered.map(p => ({
      'ID': p.id.substring(0, 8),
      'Date': new Date(p.timestamp).toISOString().split('T')[0],
      'Age': p.input.age,
      'Income': p.input.income,
      'Loan Amount': p.input.loan_amount,
      'Int. Rate': p.input.interest_rate,
      'Turnover': p.input.turnover,
      'Cust. Tenure': p.input.customer_tenure,
      'Late Payments': p.input.num_late_payments_current,
      'Unpaid Amt': p.input.unpaid_amount,
      'Industry': p.input.industry_sector,
      'Credit Type': p.input.credit_type,
      'Guarantee': p.input.has_guarantee ? 'Yes' : 'No',
      'Guarantee Type': p.input.guarantee_type,
      'Repay Freq.': p.input.repayment_frequency,
      'Risk': p.result.prediction === 1 ? 'High' : 'Low',
      'P(Good)': p.result.probability_good.toFixed(3),
      'P(Bad)': p.result.probability_bad.toFixed(3),
      'Explanation': generateExplanation(p)
    }))

    if (predictionsFormat === "csv") {
      const headers = Object.keys(data[0]).join(',')
      const rows = data.map(row => Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      const csvContent = [headers, ...rows].join('\n')
      exportToFile(csvContent, 'text/csv;charset=utf-8;', `predictions_${new Date().toISOString()}.csv`)
    } else if (predictionsFormat === "json") {
      const jsonContent = JSON.stringify(data, null, 2)
      exportToFile(jsonContent, 'application/json', `predictions_${new Date().toISOString()}.json`)
    } else if (predictionsFormat === "pdf") {
      const doc = new jsPDF({ orientation: "landscape" })
      doc.text("All Predictions Data", 14, 15)
      doc.setFontSize(8)
      doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 20)
      autoTable(doc, {
        head: [Object.keys(data[0])],
        body: data.map(row => Object.values(row)),
        startY: 25,
        styles: { fontSize: 6.5, cellPadding: 1.5, overflow: 'linebreak' },
        headStyles: { fontSize: 7, fontStyle: 'bold', fillColor: '#3B82F6' },
        columnStyles: {
          'Explanation': { cellWidth: 60 },
          'ID': { cellWidth: 18 },
          'Date': { cellWidth: 18 },
          'Age': { cellWidth: 10 },
          'P(Good)': { cellWidth: 15 },
          'P(Bad)': { cellWidth: 15 },
          'Risk': { cellWidth: 10 },
        },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages()
          doc.setFontSize(8)
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10)
        }
      })
      doc.save(`predictions_${new Date().toISOString()}.pdf`)
    }
    setIsLoading(false)
  }

  const exportToFile = (content: string, mimeType: string, filename: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generateExplanation = (prediction: Prediction): string => {
    const isHighRisk = prediction.result.prediction === 1
    const prob = isHighRisk 
      ? (prediction.result.probability_bad * 100).toFixed(1)
      : (prediction.result.probability_good * 100).toFixed(1)

    if (isHighRisk) {
      return `Declined (High Risk): The model predicts a ${prob}% probability of default. Key contributing factors may include high loan amount relative to income, poor credit history, or unfavorable terms.`
    }
    return `Approved (Low Risk): The model predicts a ${prob}% probability of successful repayment. The applicant's financial profile meets the criteria for approval.`
  }

  const handleAnalyticsExport = () => {
    setIsLoading(true)
    const stats = predictionStorage.getPredictionStats()
    const predictions = predictionStorage.getAllPredictions()
    
    if (predictions.length === 0) {
      alert("No analytics data to export.")
      setIsLoading(false)
      return
    }

    const report = {
      generatedAt: new Date().toISOString(),
      summary: stats,
      predictions: predictions.map(p => ({
        id: p.id,
        timestamp: p.timestamp,
        risk: p.result.prediction === 1 ? 'High Risk' : 'Low Risk',
        probability_good: p.result.probability_good,
        loan_amount: p.input.loan_amount,
        income: p.input.income,
      }))
    }

    if (analyticsFormat === "json") {
        const jsonContent = JSON.stringify(report, null, 2)
        exportToFile(jsonContent, 'application/json', `analytics-report_${new Date().toISOString()}.json`)
    } else if (analyticsFormat === "pdf") {
        const doc = new jsPDF()
        doc.text("Analytics Report", 14, 16)
        doc.setFontSize(10)
        doc.text(`Generated on: ${new Date(report.generatedAt).toLocaleString()}`, 14, 22)
        
        const summaryData = [
            ["Total Predictions", report.summary.total],
            ["High Risk", `${report.summary.highRisk} (${report.summary.highRiskPercentage.toFixed(1)}%)`],
            ["Low Risk", `${report.summary.lowRisk} (${report.summary.lowRiskPercentage.toFixed(1)}%)`],
            ["Avg. Good Prob.", (report.summary.averageProbabilityGood * 100).toFixed(1) + '%'],
            ["Avg. Bad Prob.", (report.summary.averageProbabilityBad * 100).toFixed(1) + '%'],
        ];

        autoTable(doc, {
            startY: 30,
            head: [['Metric', 'Value']],
            body: summaryData,
        })
        
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 10,
            head: [['ID', 'Timestamp', 'Risk', 'Good Prob.', 'Loan Amount', 'Income']],
            body: report.predictions.map(p => [p.id.substring(0,8), new Date(p.timestamp).toLocaleDateString(), p.risk, (p.probability_good*100).toFixed(1)+'%', p.loan_amount, p.income]),
        })
        
        doc.save(`analytics-report_${new Date().toISOString()}.pdf`)
    } else if (analyticsFormat === 'csv') {
        const headers = 'id,timestamp,risk,probability_good,loan_amount,income'
        const rows = report.predictions.map(p => [p.id, p.timestamp, p.risk, p.probability_good, p.loan_amount, p.income].join(','))
        const csvContent = [headers, ...rows].join('\n')
        exportToFile(csvContent, 'text/csv;charset=utf-8;', `analytics-report_${new Date().toISOString()}.csv`)
    }
    
    setIsLoading(false)
  }

  const handleAnalyticsSelectAll = () => {
    if (analyticsAllChecked) {
      setAnalyticsSelectedIds([])
      setAnalyticsAllChecked(false)
    } else {
      setAnalyticsSelectedIds(predictions.map(p => p.id))
      setAnalyticsAllChecked(true)
    }
  }

  const handleAnalyticsSelect = (id: string) => {
    setAnalyticsSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleSingleAnalyticsExport = (prediction: Prediction) => {
    setIsLoading(true)
    const data = [{
      'ID': prediction.id.substring(0, 8),
      'Date': new Date(prediction.timestamp).toISOString().split('T')[0],
      'Age': prediction.input.age,
      'Income': prediction.input.income,
      'Loan Amount': prediction.input.loan_amount,
      'Int. Rate': prediction.input.interest_rate,
      'Turnover': prediction.input.turnover,
      'Cust. Tenure': prediction.input.customer_tenure,
      'Late Payments': prediction.input.num_late_payments_current,
      'Unpaid Amt': prediction.input.unpaid_amount,
      'Industry': prediction.input.industry_sector,
      'Credit Type': prediction.input.credit_type,
      'Guarantee': prediction.input.has_guarantee ? 'Yes' : 'No',
      'Guarantee Type': prediction.input.guarantee_type,
      'Repay Freq.': prediction.input.repayment_frequency,
      'Risk': prediction.result.prediction === 1 ? 'High' : 'Low',
      'P(Good)': prediction.result.probability_good.toFixed(3),
      'P(Bad)': prediction.result.probability_bad.toFixed(3),
      'Explanation': generateExplanation(prediction)
    }]
    if (analyticsFormat === "csv") {
      const headers = Object.keys(data[0]).join(',')
      const rows = data.map(row => Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      const csvContent = [headers, ...rows].join('\n')
      exportToFile(csvContent, 'text/csv;charset=utf-8;', `analytics_${prediction.id}.csv`)
    } else if (analyticsFormat === "json") {
      const jsonContent = JSON.stringify(data, null, 2)
      exportToFile(jsonContent, 'application/json', `analytics_${prediction.id}.json`)
    } else if (analyticsFormat === "pdf") {
      const doc = new jsPDF({ orientation: "landscape" })
      doc.text("Prediction Data", 14, 15)
      doc.setFontSize(8)
      doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 20)
      autoTable(doc, {
        head: [Object.keys(data[0])],
        body: data.map(row => Object.values(row)),
        startY: 25,
        styles: { fontSize: 6.5, cellPadding: 1.5, overflow: 'linebreak' },
        headStyles: { fontSize: 7, fontStyle: 'bold', fillColor: '#3B82F6' },
        columnStyles: {
          'Explanation': { cellWidth: 60 },
          'ID': { cellWidth: 18 },
          'Date': { cellWidth: 18 },
          'Age': { cellWidth: 10 },
          'P(Good)': { cellWidth: 15 },
          'P(Bad)': { cellWidth: 15 },
          'Risk': { cellWidth: 10 },
        },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages()
          doc.setFontSize(8)
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10)
        }
      })
      doc.save(`analytics_${prediction.id}.pdf`)
    }
    setIsLoading(false)
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Export Center</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Prediction Data</CardTitle>
                <CardDescription>Export raw prediction data with detailed explanations for each case.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={predictionsFormat} onValueChange={(v) => setPredictionsFormat(v as ExportFormat)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-64 overflow-y-auto border rounded p-2 mb-2">
              <div className="flex items-center mb-2">
                <input type="checkbox" checked={allChecked} onChange={handleSelectAll} className="mr-2" />
                <span className="font-medium">Select All</span>
              </div>
              {predictions.length === 0 && <div className="text-muted-foreground text-sm">No predictions available.</div>}
              {predictions.map(p => (
                <div key={p.id} className="flex items-center border-b py-1">
                  <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => handleSelect(p.id)} className="mr-2" />
                  <span className="flex-1 text-xs">{p.id.substring(0,8)} | {new Date(p.timestamp).toLocaleString()} | {p.input.loan_amount} | {p.result.prediction === 1 ? 'High' : 'Low'}</span>
                  <Button size="sm" variant="outline" className="ml-2" onClick={() => handleSingleExport(p)} disabled={isLoading}>Export</Button>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={handlePredictionsExport} disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              {isLoading ? 'Exporting...' : selectedIds.length > 0 ? `Export Selected (${selectedIds.length})` : `Export All as ${predictionsFormat.toUpperCase()}`}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center gap-4">
              <BarChart2 className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Analytics Report</CardTitle>
                <CardDescription>Export a summary report of the overall prediction analytics.</CardDescription>
            </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select value={analyticsFormat} onValueChange={(v) => setAnalyticsFormat(v as ExportFormat)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-64 overflow-y-auto border rounded p-2 mb-2">
              <div className="flex items-center mb-2">
                <input type="checkbox" checked={analyticsAllChecked} onChange={handleAnalyticsSelectAll} className="mr-2" />
                <span className="font-medium">Select All</span>
              </div>
              {predictions.length === 0 && <div className="text-muted-foreground text-sm">No predictions available.</div>}
              {predictions.map(p => (
                <div key={p.id} className="flex items-center border-b py-1">
                  <input type="checkbox" checked={analyticsSelectedIds.includes(p.id)} onChange={() => handleAnalyticsSelect(p.id)} className="mr-2" />
                  <span className="flex-1 text-xs">{p.id.substring(0,8)} | {new Date(p.timestamp).toLocaleString()} | {p.input.loan_amount} | {p.result.prediction === 1 ? 'High' : 'Low'}</span>
                  <Button size="sm" variant="outline" className="ml-2" onClick={() => handleSingleAnalyticsExport(p)} disabled={isLoading}>Export</Button>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={handleAnalyticsExport} disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              {isLoading ? 'Exporting...' : analyticsSelectedIds.length > 0 ? `Export Selected (${analyticsSelectedIds.length})` : `Export All as ${analyticsFormat.toUpperCase()}`}
            </Button>
          </CardContent>
        </Card>
      </div>
       <div className="mt-4 text-sm text-muted-foreground">
        <p><strong>Note:</strong> PDF exports for prediction data might be slow for a very large number of records. For bulk data, CSV or JSON is recommended.</p>
        <p>If PDF export doesn't work, you may need to install the required packages by running <strong>pnpm install jspdf jspdf-autotable</strong> in your terminal.</p>
      </div>
    </div>
  )
} 