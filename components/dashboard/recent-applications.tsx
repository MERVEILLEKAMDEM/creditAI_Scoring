"use client"

import Link from "next/link"
import Image from "next/image"
import { Eye } from "lucide-react"
import { Prediction } from "@/lib/predictions"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSettings } from "@/contexts/settings-context"

interface RecentApplicationsProps {
  predictions: Prediction[]
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

export function RecentApplications({ predictions }: RecentApplicationsProps) {
  const { settings } = useSettings()

  const getRiskBadgeVariant = (risk: 'Low' | 'High') => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  const getStatusBadgeVariant = (risk: 'Low' | 'High') => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800 hover:bg-green-100" // Approved
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-100" // Declined
      default:
        return ""
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/3059713.jpg"
          alt="Recent Applications Background"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Card className="bg-background/60 backdrop-blur-md border-primary/20">
      <CardHeader>
        <CardTitle>Recent Predictions</CardTitle>
        <CardDescription>Latest credit predictions processed by the AI system</CardDescription>
      </CardHeader>
      <CardContent>
        {predictions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent predictions. Submit a new application to see results here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                    <tr className="border-b border-primary/10">
                  <th className="pb-2 text-left font-medium">Prediction ID</th>
                  <th className="pb-2 text-left font-medium">Applicant</th>
                  <th className="pb-2 text-left font-medium">Risk Level</th>
                  <th className="pb-2 text-left font-medium">Amount</th>
                  <th className="pb-2 text-left font-medium">Status</th>
                  <th className="pb-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => {
                  const riskLevel = p.result.prediction === 0 ? 'Low' : 'High'
                  const status = riskLevel === 'Low' ? 'Approved' : 'Declined'
                  
                  return (
                    <tr key={p.id} className="border-b border-primary/10">
                      <td className="py-3 font-mono text-xs">{p.id.substring(0, 8)}...</td>
                      <td className="py-3">Applicant (Age: {p.input.age})</td>
                      <td className="py-3">
                        <Badge variant="outline" className={cn(getRiskBadgeVariant(riskLevel))}>
                          {riskLevel} Risk
                        </Badge>
                      </td>
                      <td className="py-3">{currencySymbols[settings.currency] || settings.currency}{p.input.loan_amount.toLocaleString()}</td>
                      <td className="py-3">
                        <Badge variant="outline" className={cn(getStatusBadgeVariant(riskLevel))}>
                          {status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/applications`}>
                            <Eye className="mr-1 h-4 w-4" />
                            View All
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
      </div>
    </div>
  )
}
