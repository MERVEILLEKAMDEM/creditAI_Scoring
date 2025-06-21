"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiskDistributionChart } from "@/components/charts/risk-distribution"
import { CreditScoreChart } from "@/components/charts/credit-score"
import { LoanPurposeChart } from "@/components/charts/loan-purpose"
import { MonthlyTrendsChart } from "@/components/charts/monthly-trends"
import { predictionStorage } from "@/lib/predictions"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"

export default function AnalyticsPage() {
  const [predictions, setPredictions] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    lowRisk: 0,
    highRiskPercentage: 0,
    lowRiskPercentage: 0
  })

  useEffect(() => {
    const allPredictions = predictionStorage.getAllPredictions()
    setPredictions(allPredictions)
    setStats(predictionStorage.getPredictionStats())
  }, [])

  // Prepare data for charts
  const riskDistributionData = [
    { name: 'Low Risk', value: stats.lowRisk, color: '#10b981' },
    { name: 'High Risk', value: stats.highRisk, color: '#ef4444' }
  ]

  const industryData = predictions.reduce((acc, pred) => {
    const industry = pred.input.industry_sector
    acc[industry] = (acc[industry] || 0) + 1
    return acc
  }, {})

  const industryChartData = Object.entries(industryData).map(([industry, count]) => ({
    industry,
    count
  }))

  const creditTypeData = predictions.reduce((acc, pred) => {
    const type = pred.input.credit_type
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const creditTypeChartData = Object.entries(creditTypeData).map(([type, count]) => ({
    type,
    count
  }))

  const monthlyData = predictions.reduce((acc, pred) => {
    const date = new Date(pred.timestamp)
    const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = { lowRisk: 0, highRisk: 0 }
    }
    if (pred.result.prediction === 0) {
      acc[month].lowRisk++
    } else {
      acc[month].highRisk++
    }
    return acc
  }, {})

  const monthlyChartData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    lowRisk: data.lowRisk,
    highRisk: data.highRisk
  }))

  return (
    <div className="relative flex-1 space-y-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/2676163.jpg"
          alt="Analytics Background"
          fill
          className="object-cover object-center opacity-10 dark:opacity-5"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full justify-start bg-background/60 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.total > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={riskDistributionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {riskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No prediction data available
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-1 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Industry Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {industryChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={industryChartData}>
                        <XAxis dataKey="industry" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No prediction data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Credit Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {creditTypeChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={creditTypeChartData}>
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No prediction data available
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-1 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Risk Level Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.total > 0 ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{stats.lowRiskPercentage.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Low Risk Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">{stats.highRiskPercentage.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">High Risk Rate</div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No prediction data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card className="bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Monthly Prediction Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyChartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="lowRisk" stroke="#10b981" name="Low Risk" />
                      <Line type="monotone" dataKey="highRisk" stroke="#ef4444" name="High Risk" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    No prediction data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 