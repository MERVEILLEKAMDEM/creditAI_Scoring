"use client"

import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/dashboard/user-nav"

export function TopNav() {
  const router = useRouter()

  return (
    <div className="flex h-16 items-center px-4 container">
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      <div className="ml-auto flex items-center space-x-4">
        <ThemeToggle />
        <UserNav />
      </div>
    </div>
  )
} 