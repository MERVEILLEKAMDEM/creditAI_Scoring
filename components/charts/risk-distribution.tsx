"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const COLORS = {
  "Low Risk": "#10B981",
  "Medium Risk": "#F59E0B",
  "High Risk": "#EF4444"
}

type ChartData = {
  name: string
  value: number
}

export function RiskDistributionChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/dashboard/analysis")
        const result = await response.json()
        
        const chartData: ChartData[] = [
          { name: "Low Risk", value: result.riskDistribution?.low || 0 },
          { name: "Medium Risk", value: result.riskDistribution?.medium || 0 },
          { name: "High Risk", value: result.riskDistribution?.high || 0 }
        ]
        setData(chartData)
      } catch (error) {
        console.error("Error fetching risk distribution data:", error)
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
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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