"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/dist/client/components/navigation"
import { ArrowLeft, Calendar, DollarSign, Mail, MapPin, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useSettings } from "@/contexts/settings-context"

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

type ApplicationDetailsProps = {
  applicationId: string
}

const currencySymbols: Record<string, string> = {
  XOF: "CFA",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr",
  HKD: "HK$",
  SGD: "S$",
  ZAR: "R",
  BRL: "R$",
  MXN: "$",
  AED: "د.إ",
  SAR: "﷼",
  NGN: "₦",
  KES: "KSh",
  EGP: "E£",
}

export function ApplicationDetails({ applicationId }: ApplicationDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { settings } = useSettings()
  const [application, setApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [applicationId])

  async function fetchApplication() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/applications/${applicationId}`)
      if (!response.ok) throw new Error("Failed to fetch application")
      const data = await response.json()
      setApplication(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load application details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function updateStatus(newStatus: string) {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setApplication((prev) => prev ? { ...prev, status: newStatus as Application["status"] } : null)
      toast({
        title: "Status updated",
        description: "Application status has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading || !application) {
    return <div>Loading application details...</div>
  }

  const formatCurrency = (amount: number) => {
    const symbol = currencySymbols[settings.currency] || settings.currency
    return `${symbol}${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Applications
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Application #{application.application_id}</h1>
          <p className="text-muted-foreground">
            Submitted on {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
        <Badge
          className={cn(
            "text-sm",
            application.status === "Approved" && "bg-green-100 text-green-800",
            application.status === "Review" && "bg-yellow-100 text-yellow-800",
            application.status === "Declined" && "bg-red-100 text-red-800",
            application.status === "Pending" && "bg-blue-100 text-blue-800"
          )}
        >
          {application.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {application.first_name} {application.last_name}
                </p>
                <p className="text-sm text-muted-foreground">Full Name</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{application.email}</p>
                <p className="text-sm text-muted-foreground">Email Address</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{application.phone}</p>
                <p className="text-sm text-muted-foreground">Phone Number</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{application.address}</p>
                <p className="text-sm text-muted-foreground">Address</p>
              </div>
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
              <span className="text-2xl font-bold">{formatCurrency(application.loan_amount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Purpose</span>
              <span className="text-sm capitalize">{application.loan_purpose.replace("-", " ")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Annual Income</span>
              <span className="text-sm">{formatCurrency(application.annual_income)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Credit Score</span>
              <span className="text-2xl font-bold">{application.credit_score}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Level</span>
              <Badge
                className={cn(
                  "text-sm",
                  application.risk_level === "Low" && "bg-green-100 text-green-800",
                  application.risk_level === "Medium" && "bg-yellow-100 text-yellow-800",
                  application.risk_level === "High" && "bg-red-100 text-red-800"
                )}
              >
                {application.risk_level}
              </Badge>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  )
}
