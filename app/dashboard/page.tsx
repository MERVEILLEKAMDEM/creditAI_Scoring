'use client'

import Image from "next/image"
import { AnalysisSection } from "@/components/dashboard/analysis-section"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { FeatureSection } from "@/components/dashboard/feature-section"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Clock, Users, Sun, Moon, Computer, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { predictionStorage, Prediction } from "@/lib/predictions"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { updateSettings } = useSettings()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    lowRisk: 0,
    highRiskPercentage: 0,
    lowRiskPercentage: 0
  })

  useEffect(() => {
    const updateData = () => {
      const allPredictions = predictionStorage.getAllPredictions()
      const predictionStats = predictionStorage.getPredictionStats()
      setPredictions(allPredictions)
      setStats(predictionStats)
    }

    // Initial data load
    updateData()

    // Listen for changes
    window.addEventListener('storage', updateData)

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', updateData)
    }
  }, [])

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme: newTheme })
  }

  return (
    <div className="space-y-8">
      <div className="relative rounded-xl overflow-hidden">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/2312074.jpg"
            alt="Dashboard Welcome Background"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />
        </div>

        {/* Welcome Content */}
        <div className="relative z-10 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome to Your Dashboard</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Access powerful credit risk analysis tools, manage applications, and make data-driven decisions with our AI-powered system.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Image
                  src="/th.jpg"
                  alt="Credit AI Logo"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card className="p-4 hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
                  <p className="text-xs text-muted-foreground">{stats.highRiskPercentage.toFixed(1)}%</p>
                </CardContent>
              </Card>
              <Card className="p-4 hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.lowRisk}</div>
                  <p className="text-xs text-muted-foreground">{stats.lowRiskPercentage.toFixed(1)}%</p>
                </CardContent>
              </Card>
              <Card className="p-4 hover:bg-accent/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.lowRiskPercentage.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Low Risk Rate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-12">
        <AnalysisSection predictions={predictions} />
        
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Predictions</h2>
          <RecentApplications predictions={predictions.slice(0, 5)} />
        </div>
      </div>
    </div>
  )
}
