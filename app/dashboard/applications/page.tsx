'use client'

import Image from "next/image"
import { useState, useEffect } from "react"
import { predictionStorage, Prediction } from "@/lib/predictions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Eye, Calendar, User, DollarSign, AlertTriangle, CheckCircle } from "lucide-react"

export default function ApplicationsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])

  useEffect(() => {
    const allPredictions = predictionStorage.getAllPredictions()
    setPredictions(allPredictions)
  }, [])

  const handleDeletePrediction = (id: string) => {
    predictionStorage.deletePrediction(id)
    setPredictions(predictionStorage.getAllPredictions())
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRiskColor = (prediction: number) => {
    return prediction === 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
  }

  const getRiskIcon = (prediction: number) => {
    return prediction === 1 ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Prediction History</h1>
          <p className="text-muted-foreground">View all credit risk predictions made</p>
        </div>
        
        <div className="p-6 space-y-4">
          {predictions.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-muted-foreground">No predictions made yet. Start by creating a new application.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {predictions.map((prediction) => (
                <Card key={prediction.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getRiskIcon(prediction.result.prediction)}
                        <CardTitle className="text-lg">
                          Credit Risk Assessment
                        </CardTitle>
                        <Badge className={getRiskColor(prediction.result.prediction)}>
                          {prediction.result.prediction === 1 ? 'High Risk' : 'Low Risk'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(prediction.timestamp)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePrediction(prediction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Applicant Info */}
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Applicant Details
                        </h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Age:</span> {prediction.input.age}</p>
                          <p><span className="font-medium">Income:</span> ${prediction.input.income.toLocaleString()}</p>
                          <p><span className="font-medium">Tenure:</span> {prediction.input.customer_tenure} years</p>
                        </div>
                      </div>

                      {/* Loan Info */}
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Loan Details
                        </h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Amount:</span> ${prediction.input.loan_amount.toLocaleString()}</p>
                          <p><span className="font-medium">Rate:</span> {prediction.input.interest_rate}%</p>
                          <p><span className="font-medium">Type:</span> {prediction.input.credit_type}</p>
                        </div>
                      </div>

                      {/* Risk Analysis */}
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Risk Analysis
                        </h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Good Probability:</span> {(prediction.result.probability_good * 100).toFixed(1)}%</p>
                          <p><span className="font-medium">Bad Probability:</span> {(prediction.result.probability_bad * 100).toFixed(1)}%</p>
                          <p><span className="font-medium">Industry:</span> {prediction.input.industry_sector}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
      </div>
      </div>
    </div>
  )
}
