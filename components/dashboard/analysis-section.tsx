"use client"

import { useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Prediction } from "@/lib/predictions"

interface AnalysisSectionProps {
  predictions: Prediction[]
}

const COLORS = ["#10B981", "#EF4444"] // Low Risk, High Risk

export function AnalysisSection({ predictions }: AnalysisSectionProps) {

  const analysisData = useMemo(() => {
    if (!predictions || predictions.length === 0) {
      return null
    }

    const totalApplications = predictions.length
    const highRisk = predictions.filter(p => p.result.prediction === 1).length
    const lowRisk = totalApplications - highRisk
    
    // This is a placeholder as credit score is not in the data
    const averageCreditScore = 650 
    
    const approvalRate = totalApplications > 0 ? lowRisk / totalApplications : 0

    const riskDistribution = [
      { name: "Low Risk", value: lowRisk },
      { name: "High Risk", value: highRisk },
    ]

    const monthlyTrendsData = predictions.reduce((acc, p) => {
      const month = new Date(p.timestamp).toLocaleString('default', { month: 'short', year: 'numeric' })
      if (!acc[month]) {
        acc[month] = { month, applications: 0, lowRisk: 0 };
      }
      acc[month].applications++;
      if (p.result.prediction === 0) {
        acc[month].lowRisk++;
      }
      return acc;
    }, {} as Record<string, { month: string; applications: number; lowRisk: number }>)

    const monthlyTrends = Object.values(monthlyTrendsData).map(m => ({
      ...m,
      approvalRate: m.applications > 0 ? (m.lowRisk / m.applications) * 100 : 0
    })).reverse()


    // Placeholder for credit score distribution
    const creditScoreDistribution = [
        { range: '300-579', count: 5 },
        { range: '580-669', count: 15 },
        { range: '670-739', count: 25 },
        { range: '740-799', count: 10 },
        { range: '800-850', count: 5 },
    ];


    return {
      totalApplications,
      averageCreditScore,
      approvalRate,
      riskDistribution,
      creditScoreDistribution,
      monthlyTrends,
    }
  }, [predictions])

  if (!analysisData) {
    return (
      <div className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/2676163.jpg"
            alt="Analysis Background"
            fill
            className="object-cover object-center opacity-20"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 space-y-6 p-6 text-center">
            <Card className="bg-background/60 backdrop-blur-md border-primary/20">
                <CardHeader>
                    <CardTitle>No Analysis Data</CardTitle>
                    <CardDescription>Submit a new application to see analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>The analysis charts will appear here once you have some prediction data.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    )
  }

  const {
    totalApplications,
    averageCreditScore,
    approvalRate,
    riskDistribution,
    creditScoreDistribution,
    monthlyTrends,
  } = analysisData

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/2676163.jpg"
          alt="Analysis Background"
          fill
          className="object-cover object-center opacity-20"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-background/60 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Total Applications</CardTitle>
              <CardDescription>Overall number of applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalApplications}</div>
            </CardContent>
          </Card>
          <Card className="bg-background/60 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Average Credit Score</CardTitle>
              <CardDescription>Mean credit score across all applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(averageCreditScore)}</div>
              <p className="text-xs text-muted-foreground">Placeholder Data</p>
            </CardContent>
          </Card>
          <Card className="bg-background/60 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Approval Rate</CardTitle>
              <CardDescription>Percentage of approved applications (Low Risk)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(approvalRate * 100).toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="risk" className="space-y-4">
          <TabsList className="bg-background/60 backdrop-blur-md">
            <TabsTrigger value="risk">Risk Distribution</TabsTrigger>
            <TabsTrigger value="credit">Credit Score (Placeholder)</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="risk">
            <Card className="bg-background/60 backdrop-blur-md border-primary/20">
              <CardHeader>
                <CardTitle>Risk Level Distribution</CardTitle>
                <CardDescription>Distribution of applications by risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="credit">
            <Card className="bg-background/60 backdrop-blur-md border-primary/20">
              <CardHeader>
                <CardTitle>Credit Score Distribution</CardTitle>
                <CardDescription>Distribution of applications by credit score range (Placeholder Data)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={creditScoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends">
            <Card className="bg-background/60 backdrop-blur-md border-primary/20">
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Application volume and approval rate trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" label={{ value: 'Applications', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Approval Rate (%)', angle: -90, position: 'insideRight' }} />
                      <Tooltip formatter={(value, name) => name === 'approvalRate' ? `${(value as number).toFixed(1)}%` : value} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="applications" name="Total Applications" fill="#3B82F6" />
                      <Bar yAxisId="right" dataKey="approvalRate" name="Approval Rate" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 