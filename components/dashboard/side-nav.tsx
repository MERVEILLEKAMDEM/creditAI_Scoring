"use client"

import Link from "next/link"
import { usePathname } from "next/dist/client/components/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  FileText,
  Home,
  Settings,
  Users,
  PlusCircle,
} from "lucide-react"

const items = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Applications",
    href: "/dashboard/applications",
    icon: FileText,
  },
  {
    title: "New Application",
    href: "/dashboard/new-application",
    icon: PlusCircle,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SideNav({ className, ...props }: SideNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn("py-4 sticky top-0 h-screen bg-muted/40", className)} {...props}>
      <div className="px-4 py-2">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-black">
          Navigation
        </h2>
        <div className="space-y-1">
          {items.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}