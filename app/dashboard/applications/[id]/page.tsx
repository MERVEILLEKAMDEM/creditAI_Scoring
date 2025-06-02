import type { Metadata } from "next"
import { ApplicationDetails } from "@/components/dashboard/application-details"

export const metadata: Metadata = {
  title: "Application Details | AI Credit Risk Analysis System",
  description: "View detailed information about a credit application",
}

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <ApplicationDetails applicationId={params.id} />
    </div>
  )
}
