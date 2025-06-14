"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

type ChartData = {
  range: string
  count: number
}

export function CreditScoreChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/dashboard/analysis")
        const result = await response.json()
        
        const chartData: ChartData[] = [
          { range: "300-499", count: result.creditScoreDistribution?.veryPoor || 0 },
          { range: "500-599", count: result.creditScoreDistribution?.poor || 0 },
          { range: "600-699", count: result.creditScoreDistribution?.fair || 0 },
          { range: "700-799", count: result.creditScoreDistribution?.good || 0 },
          { range: "800-850", count: result.creditScoreDistribution?.excellent || 0 }
        ]
        setData(chartData)
      } catch (error) {
        console.error("Error fetching credit score data:", error)
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
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 