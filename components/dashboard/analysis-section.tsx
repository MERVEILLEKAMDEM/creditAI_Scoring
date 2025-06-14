"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface AnalysisData {
  riskDistribution: {
    name: string
    value: number
  }[]
  creditScoreDistribution: {
    range: string
    count: number
  }[]
  monthlyTrends: {
    month: string
    applications: number
    approvalRate: number
  }[]
  totalApplications: number
  averageCreditScore: number
  approvalRate: number
}

const COLORS = ["#10B981", "#F59E0B", "#EF4444"]

export function AnalysisSection() {
  const { toast } = useToast()
  const [data, setData] = useState<AnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalysisData()
  }, [])

  async function fetchAnalysisData() {
    try {
      const response = await fetch("/api/dashboard/analysis")
      if (!response.ok) throw new Error("Failed to fetch analysis data")
      const data = await response.json()
      setData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analysis data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !data) {
    return <div>Loading analysis...</div>
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/2676163.jpg"
          alt="Analysis Background"
          fill
          className="object-cover object-center"
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
              <div className="text-3xl font-bold">{data.totalApplications}</div>
            </CardContent>
          </Card>
          <Card className="bg-background/60 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Average Credit Score</CardTitle>
              <CardDescription>Mean credit score across all applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(data.averageCreditScore)}</div>
            </CardContent>
          </Card>
          <Card className="bg-background/60 backdrop-blur-md border-primary/20">
            <CardHeader>
              <CardTitle>Approval Rate</CardTitle>
              <CardDescription>Percentage of approved applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(data.approvalRate * 100).toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="risk" className="space-y-4">
          <TabsList className="bg-background/60 backdrop-blur-md">
            <TabsTrigger value="risk">Risk Distribution</TabsTrigger>
            <TabsTrigger value="credit">Credit Score Distribution</TabsTrigger>
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
                        data={data.riskDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {data.riskDistribution.map((entry, index) => (
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
                <CardDescription>Distribution of applications by credit score range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.creditScoreDistribution}>
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
                    <BarChart data={data.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="applications" fill="#3B82F6" />
                      <Bar yAxisId="right" dataKey="approvalRate" fill="#10B981" />
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