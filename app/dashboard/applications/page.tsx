import type { Metadata } from "next"
import Image from "next/image"
import { ApplicationsList } from "@/components/dashboard/applications-list"

export const metadata: Metadata = {
  title: "Applications | AI Credit Risk Analysis System",
  description: "View and manage credit applications",
}

export default function ApplicationsPage() {
  return (
    <div className="relative space-y-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/1104816.jpg"
          alt="Applications Background"
          fill
          className="object-cover object-center opacity-10 dark:opacity-5"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="rounded-lg p-6">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">View and manage all credit applications</p>
      </div>
      <ApplicationsList />
      </div>
    </div>
  )
}
