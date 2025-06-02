import type { Metadata } from "next"
import { DashboardMetricCards } from "@/components/dashboard/dashboard-metric-cards"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { RecentApplications } from "@/components/dashboard/recent-applications"

export const metadata: Metadata = {
  title: "Dashboard | AI Credit Risk Analysis System",
  description: "Dashboard for the AI Credit Risk Analysis System",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your credit risk analysis system</p>
      </div>
      <DashboardMetricCards />
      <DashboardCharts />
      <RecentApplications />
    </div>
  )
}
