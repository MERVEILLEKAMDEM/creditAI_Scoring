"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiskDistributionChart } from "@/components/charts/risk-distribution"
import { CreditScoreChart } from "@/components/charts/credit-score"
import { LoanPurposeChart } from "@/components/charts/loan-purpose"
import { MonthlyTrendsChart } from "@/components/charts/monthly-trends"

export default function AnalyticsPage() {
  return (
    <div className="relative flex-1 space-y-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/2676163.jpg"
          alt="Analytics Background"
          fill
          className="object-cover object-center opacity-10 dark:opacity-5"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full justify-start bg-background/60 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <RiskDistributionChart />
                </CardContent>
              </Card>
              <Card className="col-span-1 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Credit Score Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CreditScoreChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Loan Purpose Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <LoanPurposeChart />
                </CardContent>
              </Card>
              <Card className="col-span-1 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Risk Level Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <RiskDistributionChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card className="bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Monthly Application Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyTrendsChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 