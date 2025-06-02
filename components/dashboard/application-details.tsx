"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, DollarSign, Mail, MapPin, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
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

interface ApplicationDetailsProps {
  applicationId: string
}

export function ApplicationDetails({ applicationId }: ApplicationDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [application, setApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [applicationId])

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`)
      if (response.ok) {
        const data = await response.json()
        setApplication(data)
      } else {
        toast({
          title: "Error",
          description: "Application not found",
          variant: "destructive",
        })
        router.push("/dashboard/applications")
      }
    } catch (error) {
      console.error("Error fetching application:", error)
      toast({
        title: "Error",
        description: "Failed to load application details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!application) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedApp = await response.json()
        setApplication(updatedApp)
        toast({
          title: "Status Updated",
          description: `Application status changed to ${newStatus}`,
        })
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-green-600"
    if (score >= 600) return "text-amber-600"
    return "text-red-600"
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
          <div className="text-center">Loading application details...</div>
        </CardContent>
      </Card>
    )
  }

  if (!application) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Application not found</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Application Details</h1>
            <p className="text-muted-foreground">Application ID: {application.application_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className={cn(getRiskBadgeVariant(application.risk_level))}>
            {application.risk_level} Risk
          </Badge>
          <Badge variant="outline" className={cn(getStatusBadgeVariant(application.status))}>
            {application.status}
          </Badge>
        </div>
      </div>

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
          <CardDescription>Change the application status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={application.status} onValueChange={updateStatus} disabled={isUpdating}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Declined">Declined</SelectItem>
              </SelectContent>
            </Select>
            {isUpdating && <span className="text-sm text-muted-foreground">Updating...</span>}
          </div>
        </CardContent>
      </Card>

      {/* Application Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credit Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Credit Score</span>
              <span className={cn("text-2xl font-bold", getScoreColor(application.credit_score))}>
                {application.credit_score}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Level</span>
              <Badge variant="outline" className={cn(getRiskBadgeVariant(application.risk_level))}>
                {application.risk_level}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Credit History</span>
              <span className="text-sm capitalize">{application.credit_history.replace("-", " ")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Requested Amount</span>
              <span className="text-2xl font-bold">${application.loan_amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Purpose</span>
              <span className="text-sm capitalize">{application.loan_purpose.replace("-", " ")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Annual Income</span>
              <span className="text-sm">${application.annual_income.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">
                    {application.first_name} {application.last_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{application.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{application.phone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{application.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Employment Status</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {application.employment_status.replace("-", " ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Application Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      {application.additional_notes && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{application.additional_notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
