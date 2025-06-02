import type { Metadata } from "next"
import { NewApplicationForm } from "@/components/dashboard/new-application-form"

export const metadata: Metadata = {
  title: "New Application | AI Credit Risk Analysis System",
  description: "Submit a new credit application for analysis",
}

export default function NewApplicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Application</h1>
        <p className="text-muted-foreground">Submit a new credit application for AI-powered risk analysis</p>
      </div>
      <NewApplicationForm />
    </div>
  )
}
