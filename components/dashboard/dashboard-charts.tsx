"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Chart from "chart.js/auto"

export function DashboardCharts() {
  const riskDistributionChartRef = useRef<HTMLCanvasElement>(null)
  const riskBreakdownChartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Risk Distribution Chart
    if (riskDistributionChartRef.current) {
      const ctx = riskDistributionChartRef.current.getContext("2d")
      if (ctx) {
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Low Risk",
                data: [65, 68, 72, 70, 75, 78],
                backgroundColor: "#10b981",
                stack: "Stack 0",
              },
              {
                label: "Medium Risk",
                data: [25, 22, 18, 20, 15, 16],
                backgroundColor: "#f59e0b",
                stack: "Stack 0",
              },
              {
                label: "High Risk",
                data: [10, 10, 10, 10, 10, 6],
                backgroundColor: "#ef4444",
                stack: "Stack 0",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: (value) => value + "%",
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: false,
              },
            },
          },
        })

        return () => {
          chart.destroy()
        }
      }
    }
  }, [])

  useEffect(() => {
    // Risk Breakdown Chart
    if (riskBreakdownChartRef.current) {
      const ctx = riskBreakdownChartRef.current.getContext("2d")
      if (ctx) {
        const chart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Low Risk", "Medium Risk", "High Risk"],
            datasets: [
              {
                data: [78, 16, 6],
                backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
              },
            },
          },
        })

        return () => {
          chart.destroy()
        }
      }
    }
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution Trends</CardTitle>
          <CardDescription>Monthly risk assessment breakdown</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[300px]">
            <canvas ref={riskDistributionChartRef} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current Risk Breakdown</CardTitle>
          <CardDescription>Distribution of current portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <canvas ref={riskBreakdownChartRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
