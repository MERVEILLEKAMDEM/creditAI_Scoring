"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Application = {
  id: number
  application_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  employment_status: string
  annual_income: number
  loan_amount: number
  loan_purpose: string
  credit_history: string
  additional_notes: string
  credit_score: number
  risk_level: "Low" | "Medium" | "High"
  status: "Approved" | "Review" | "Declined" | "Pending"
  created_at: string
  updated_at: string
}

export function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter, riskFilter])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications")
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.application_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status.toLowerCase() === statusFilter)
    }

    // Risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter((app) => app.risk_level.toLowerCase() === riskFilter)
    }

    setFilteredApplications(filtered)
  }

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
      case "Pending":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return ""
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading applications...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Applications</CardTitle>
        <CardDescription>Manage and review credit applications</CardDescription>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
                <th className="pb-2 text-left font-medium">Date</th>
                <th className="pb-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} className="border-b">
                  <td className="py-3">{app.application_id}</td>
                  <td className="py-3">{`${app.first_name} ${app.last_name}`}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span>{app.credit_score}</span>
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className={cn("h-full rounded-full", getScoreColor(app.credit_score))}
                          style={{ width: getScoreWidth(app.credit_score) }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant="outline" className={cn(getRiskBadgeVariant(app.risk_level))}>
                      {app.risk_level}
                    </Badge>
                  </td>
                  <td className="py-3">${app.loan_amount.toLocaleString()}</td>
                  <td className="py-3">
                    <Badge variant="outline" className={cn(getStatusBadgeVariant(app.status))}>
                      {app.status}
                    </Badge>
                  </td>
                  <td className="py-3">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/applications/${app.application_id}`}>
                        <Eye className="mr-1 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApplications.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">No applications found matching your criteria.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
