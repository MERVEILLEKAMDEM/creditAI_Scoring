import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useState } from "react"

export default function ExportPage() {
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false)
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false)
  const [isCustomLoading, setIsCustomLoading] = useState(false)

  const handleApplicationsExport = async () => {
    try {
      setIsApplicationsLoading(true)
      // Add your export logic here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated delay
    } finally {
      setIsApplicationsLoading(false)
    }
  }

  const handleAnalyticsExport = async () => {
    try {
      setIsAnalyticsLoading(true)
      // Add your export logic here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated delay
    } finally {
      setIsAnalyticsLoading(false)
    }
  }

  const handleCustomExport = async () => {
    try {
      setIsCustomLoading(true)
      // Add your export logic here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated delay
    } finally {
      setIsCustomLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Export Data</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Applications Export</CardTitle>
            <CardDescription>Export loan applications data</CardDescription>
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
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
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
              loading={isApplicationsLoading}
            >
              Export Applications
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Export</CardTitle>
            <CardDescription>Export analytics and reports</CardDescription>
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
                  <SelectItem value="credit">Credit Score Analysis</SelectItem>
                  <SelectItem value="trends">Monthly Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full"
              onClick={handleAnalyticsExport}
              loading={isAnalyticsLoading}
            >
              Export Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Export</CardTitle>
            <CardDescription>Create a custom data export</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fields</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select fields" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="basic">Basic Information</SelectItem>
                  <SelectItem value="risk">Risk Analysis</SelectItem>
                  <SelectItem value="financial">Financial Data</SelectItem>
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
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full"
              onClick={handleCustomExport}
              loading={isCustomLoading}
            >
              Create Custom Export
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 