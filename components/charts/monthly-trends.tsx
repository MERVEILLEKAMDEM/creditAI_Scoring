"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

type ChartData = {
  month: string
  applications: number
  approvals: number
  rejections: number
}

export function MonthlyTrendsChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/dashboard/analysis")
        const result = await response.json()
        
        const chartData: ChartData[] = result.monthlyTrends?.map((trend: any) => ({
          month: trend.month,
          applications: trend.applications || 0,
          approvals: trend.approvals || 0,
          rejections: trend.rejections || 0
        })) || []

        setData(chartData)
      } catch (error) {
        console.error("Error fetching monthly trends data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="applications" stroke="#3B82F6" name="Total Applications" />
          <Line type="monotone" dataKey="approvals" stroke="#10B981" name="Approved" />
          <Line type="monotone" dataKey="rejections" stroke="#EF4444" name="Rejected" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 