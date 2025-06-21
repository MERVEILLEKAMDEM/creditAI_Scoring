"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { SideNav } from "@/components/dashboard/side-nav"
import { TopNav } from "@/components/dashboard/top-nav"
import { ErrorBoundary } from "react-error-boundary"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/1104816.jpg"
          alt="Dashboard Background"
          fill
          className="object-cover object-center opacity-10 dark:opacity-5"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <TopNav />
        </div>
        <div className="flex">
          <SideNav className="w-64 hidden lg:block border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80" />
          <main className="flex-1 min-h-[calc(100vh-4rem)]">
            <div className="container p-6 lg:p-8">
              <ErrorBoundary fallback={<div>Something went wrong in this section. Please try refreshing.</div>}>
                {children}
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
