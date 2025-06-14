import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Smart Risk Assessment",
    description: "Advanced AI algorithms analyze credit applications in real-time",
    image: "/features/risk-assessment.jpg",
  },
  {
    title: "Credit Score Analysis",
    description: "Comprehensive credit score evaluation with detailed insights",
    image: "/features/credit-score.jpg",
  },
  {
    title: "Application Management",
    description: "Streamlined application processing and tracking system",
    image: "/features/application-mgmt.jpg",
  },
  {
    title: "Real-time Analytics",
    description: "Interactive dashboards and reports for data-driven decisions",
    image: "/features/analytics.jpg",
  },
  {
    title: "Automated Workflows",
    description: "Efficient approval processes with automated decision flows",
    image: "/features/workflow.jpg",
  },
  {
    title: "Secure Data Handling",
    description: "Enterprise-grade security for sensitive financial data",
    image: "/features/security.jpg",
  },
]

export function FeatureSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Key Features</h2>
        <p className="text-muted-foreground">
          Powerful tools for credit risk analysis and management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover"
                priority={index < 2}
              />
            </div>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
} 