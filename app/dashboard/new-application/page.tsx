import type { Metadata } from "next"
import Image from "next/image"
import { NewApplicationForm } from "@/components/dashboard/new-application-form"

export const metadata: Metadata = {
  title: "New Application | AI Credit Risk Analysis System",
  description: "Submit a new credit application for analysis",
}

export default function NewApplicationPage() {
  return (
    <div className="relative space-y-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/3059713.jpg"
          alt="New Application Background"
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
        <h1 className="text-3xl font-bold tracking-tight">New Application</h1>
        <p className="text-muted-foreground">Submit a new credit application for AI-powered risk analysis</p>
      </div>
        <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6">
      <NewApplicationForm />
        </div>
      </div>
    </div>
  )
}
