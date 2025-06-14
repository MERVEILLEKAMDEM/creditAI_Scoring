import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserStats } from "./user-stats"
import { UsersTable } from "./users-table"

export default function UsersPage() {
  return (
    <div className="relative flex-1 space-y-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/2312074.jpg"
          alt="Users Background"
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
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <Button>Add New User</Button>
        </div>
        <div className="mt-6">
          <UserStats />
        </div>
        <Card className="mt-6 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage system users and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input placeholder="Search by name or email..." className="bg-background/60" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-background/60">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">Regular User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="bg-background/60">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <UsersTable />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 