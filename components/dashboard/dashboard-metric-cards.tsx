"use client"

import { ArrowDown, ArrowUp, BarChart3, DollarSign, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useSettings } from "@/contexts/settings-context"

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

export function DashboardMetricCards() {
  const { settings } = useSettings()
  const metrics = [
    {
      title: "Total Applications",
      value: "2,847",
      icon: Users,
      change: "+12.5%",
      changeDirection: "up",
      changeText: "from last month",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
    },
    {
      title: "Approved Amount",
      value: `${currencySymbols[settings.currency] || settings.currency}4.2M`,
      icon: DollarSign,
      change: "+8.3%",
      changeDirection: "up",
      changeText: "from last month",
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
    },
    {
      title: "Average Score",
      value: "687",
      icon: BarChart3,
      change: "+2.1%",
      changeDirection: "up",
      changeText: "from last month",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-100",
    },
    {
      title: "High Risk Rate",
      value: "6.2%",
      icon: BarChart3,
      change: "-1.5%",
      changeDirection: "down",
      changeText: "from last month",
      iconColor: "text-red-500",
      iconBg: "bg-red-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <div className={cn("rounded-full p-2", metric.iconBg)}>
              <metric.icon className={cn("h-4 w-4", metric.iconColor)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {metric.changeDirection === "up" ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={metric.changeDirection === "up" ? "text-green-500" : "text-red-500"}>
                {metric.change}
              </span>
              <span className="ml-1">{metric.changeText}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
