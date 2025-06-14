"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const COLORS = {
  "Business": "#3B82F6",
  "Personal": "#10B981",
  "Education": "#F59E0B",
  "Home": "#EF4444",
  "Vehicle": "#8B5CF6",
  "Other": "#EC4899"
}

type ChartData = {
  name: string
  value: number
}

export function LoanPurposeChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/dashboard/analysis")
        const result = await response.json()
        
        const chartData: ChartData[] = [
          { name: "Business", value: result.loanPurposeDistribution?.business || 0 },
          { name: "Personal", value: result.loanPurposeDistribution?.personal || 0 },
          { name: "Education", value: result.loanPurposeDistribution?.education || 0 },
          { name: "Home", value: result.loanPurposeDistribution?.home || 0 },
          { name: "Vehicle", value: result.loanPurposeDistribution?.vehicle || 0 },
          { name: "Other", value: result.loanPurposeDistribution?.other || 0 }
        ].filter(item => item.value > 0) // Only show categories with values
        setData(chartData)
      } catch (error) {
        console.error("Error fetching loan purpose data:", error)
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            paddingAngle={5}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry) => (
              <Cell 
                key={`cell-${entry.name}`} 
                fill={COLORS[entry.name as keyof typeof COLORS]}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} Applications`, '']}
          />
          <Legend 
            verticalAlign="bottom"
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 