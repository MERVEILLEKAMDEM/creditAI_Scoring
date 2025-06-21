'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useState } from "react"
import { predictionStorage } from "@/lib/predictions"

export default function ExportPage() {
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false)
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false)
  const [isCustomLoading, setIsCustomLoading] = useState(false)

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(',')
    const csvContent = [headers, ...data.map(row => Object.values(row).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleApplicationsExport = async () => {
    try {
      setIsApplicationsLoading(true)
      const predictions = predictionStorage.getAllPredictions()
      
      if (predictions.length === 0) {
        alert('No prediction data to export')
        return
      }

      // Flatten prediction data for export
      const exportData = predictions.map(pred => ({
        ID: pred.id,
        Date: new Date(pred.timestamp).toLocaleDateString(),
        Time: new Date(pred.timestamp).toLocaleTimeString(),
        Age: pred.input.age,
        Income: pred.input.income,
        'Loan Amount': pred.input.loan_amount,
        'Interest Rate': pred.input.interest_rate,
        Turnover: pred.input.turnover,
        'Customer Tenure': pred.input.customer_tenure,
        'Late Payments': pred.input.num_late_payments_current,
        'Unpaid Amount': pred.input.unpaid_amount,
        'Industry Sector': pred.input.industry_sector,
        'Credit Type': pred.input.credit_type,
        'Has Guarantee': pred.input.has_guarantee,
        'Guarantee Type': pred.input.guarantee_type,
        'Repayment Frequency': pred.input.repayment_frequency,
        'Risk Level': pred.result.prediction === 1 ? 'High Risk' : 'Low Risk',
        'Good Probability': `${(pred.result.probability_good * 100).toFixed(2)}%`,
        'Bad Probability': `${(pred.result.probability_bad * 100).toFixed(2)}%`
      }))

      exportToCSV(exportData, `credit_predictions_${new Date().toISOString().split('T')[0]}.csv`)
    } finally {
      setIsApplicationsLoading(false)
    }
  }

  const handleAnalyticsExport = async () => {
    try {
      setIsAnalyticsLoading(true)
      const predictions = predictionStorage.getAllPredictions()
      
      if (predictions.length === 0) {
        alert('No prediction data to export')
        return
      }

      const stats = predictionStorage.getPredictionStats()
      
      // Create analytics report
      const analyticsData = {
        summary: {
          totalPredictions: stats.total,
          highRiskCount: stats.highRisk,
          lowRiskCount: stats.lowRisk,
          highRiskPercentage: stats.highRiskPercentage,
          lowRiskPercentage: stats.lowRiskPercentage,
          averageProbabilityGood: stats.averageProbabilityGood,
          averageProbabilityBad: stats.averageProbabilityBad
        },
        predictions: predictions.map(pred => ({
          id: pred.id,
          timestamp: pred.timestamp,
          riskLevel: pred.result.prediction === 1 ? 'High Risk' : 'Low Risk',
          goodProbability: pred.result.probability_good,
          badProbability: pred.result.probability_bad,
          industry: pred.input.industry_sector,
          creditType: pred.input.credit_type
        }))
      }

      exportToJSON(analyticsData, `analytics_report_${new Date().toISOString().split('T')[0]}.json`)
    } finally {
      setIsAnalyticsLoading(false)
    }
  }

  const handleCustomExport = async () => {
    try {
      setIsCustomLoading(true)
      const predictions = predictionStorage.getAllPredictions()
      
      if (predictions.length === 0) {
        alert('No prediction data to export')
        return
      }

      // Export only risk analysis data
      const riskData = predictions.map(pred => ({
        ID: pred.id,
        Date: new Date(pred.timestamp).toLocaleDateString(),
        'Risk Level': pred.result.prediction === 1 ? 'High Risk' : 'Low Risk',
        'Good Probability': pred.result.probability_good,
        'Bad Probability': pred.result.probability_bad,
        'Industry': pred.input.industry_sector,
        'Credit Type': pred.input.credit_type,
        'Loan Amount': pred.input.loan_amount,
        'Income': pred.input.income
      }))

      exportToCSV(riskData, `risk_analysis_${new Date().toISOString().split('T')[0]}.csv`)
    } finally {
      setIsCustomLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Export Prediction Data</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Complete Predictions Export</CardTitle>
            <CardDescription>Export all prediction data with full details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select defaultValue="csv">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DatePickerWithRange />
            </div>
            <Button 
              className="w-full" 
              onClick={handleApplicationsExport}
              disabled={isApplicationsLoading}
            >
              {isApplicationsLoading ? 'Exporting...' : 'Export All Predictions'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Report Export</CardTitle>
            <CardDescription>Export analytics and risk analysis reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select defaultValue="risk">
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk">Risk Analysis</SelectItem>
                  <SelectItem value="trends">Prediction Trends</SelectItem>
                  <SelectItem value="summary">Summary Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select defaultValue="json">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full"
              onClick={handleAnalyticsExport}
              disabled={isAnalyticsLoading}
            >
              {isAnalyticsLoading ? 'Exporting...' : 'Export Analytics Report'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis Export</CardTitle>
            <CardDescription>Export focused risk analysis data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fields</label>
              <Select defaultValue="risk">
                <SelectTrigger>
                  <SelectValue placeholder="Select fields" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk">Risk Analysis Only</SelectItem>
                  <SelectItem value="financial">Financial Data</SelectItem>
                  <SelectItem value="summary">Summary Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select defaultValue="csv">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full"
              onClick={handleCustomExport}
              disabled={isCustomLoading}
            >
              {isCustomLoading ? 'Exporting...' : 'Export Risk Analysis'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 