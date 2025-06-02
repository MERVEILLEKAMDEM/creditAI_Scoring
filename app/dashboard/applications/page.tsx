import type { Metadata } from "next"
import { ApplicationsList } from "@/components/dashboard/applications-list"

export const metadata: Metadata = {
  title: "Applications | AI Credit Risk Analysis System",
  description: "View and manage credit applications",
}

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">View and manage all credit applications</p>
      </div>
      <ApplicationsList />
    </div>
  )
}
