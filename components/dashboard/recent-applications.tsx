"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Application = {
  id: string
  applicant: string
  creditScore: number
  riskLevel: "Low" | "Medium" | "High"
  amount: string
  status: "Approved" | "Review" | "Declined"
}

export function RecentApplications() {
  const [applications] = useState<Application[]>([
    {
      id: "APP001",
      applicant: "John Smith",
      creditScore: 785,
      riskLevel: "Low",
      amount: "$50,000",
      status: "Approved",
    },
    {
      id: "APP002",
      applicant: "Sarah Johnson",
      creditScore: 620,
      riskLevel: "Medium",
      amount: "$25,000",
      status: "Review",
    },
    {
      id: "APP003",
      applicant: "Mike Wilson",
      creditScore: 450,
      riskLevel: "High",
      amount: "$30,000",
      status: "Declined",
    },
    {
      id: "APP004",
      applicant: "Emily Davis",
      creditScore: 720,
      riskLevel: "Low",
      amount: "$40,000",
      status: "Approved",
    },
    {
      id: "APP005",
      applicant: "David Brown",
      creditScore: 580,
      riskLevel: "Medium",
      amount: "$20,000",
      status: "Review",
    },
  ])

  const getScoreColor = (score: number) => {
    if (score >= 700) return "bg-green-500"
    if (score >= 600) return "bg-amber-500"
    return "bg-red-500"
  }

  const getScoreWidth = (score: number) => {
    return `${Math.min(100, Math.max(0, (score / 850) * 100))}%`
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Review":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "Declined":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Latest credit applications processed by the AI system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium">Application ID</th>
                <th className="pb-2 text-left font-medium">Applicant</th>
                <th className="pb-2 text-left font-medium">Credit Score</th>
                <th className="pb-2 text-left font-medium">Risk Level</th>
                <th className="pb-2 text-left font-medium">Amount</th>
                <th className="pb-2 text-left font-medium">Status</th>
                <th className="pb-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b">
                  <td className="py-3">{app.id}</td>
                  <td className="py-3">{app.applicant}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span>{app.creditScore}</span>
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className={cn("h-full rounded-full", getScoreColor(app.creditScore))}
                          style={{ width: getScoreWidth(app.creditScore) }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant="outline" className={cn(getRiskBadgeVariant(app.riskLevel))}>
                      {app.riskLevel}
                    </Badge>
                  </td>
                  <td className="py-3">{app.amount}</td>
                  <td className="py-3">
                    <Badge variant="outline" className={cn(getStatusBadgeVariant(app.status))}>
                      {app.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/applications/${app.id}`}>
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
