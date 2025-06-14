"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { useSettings } from "@/contexts/settings-context"

const formSchema = z.object({
  currency: z.string({
    required_error: "Please select a currency.",
  }),
  exportFormat: z.string({
    required_error: "Please select an export format.",
  }),
  theme: z.enum(['light', 'dark', 'system'], {
    required_error: "Please select a theme.",
  }),
})

const currencies = [
  { value: "XOF", label: "XOF (West African CFA franc)" },
  { value: "USD", label: "USD (US Dollar)" },
  { value: "EUR", label: "EUR (Euro)" },
  { value: "GBP", label: "GBP (British Pound)" },
  { value: "JPY", label: "JPY (Japanese Yen)" },
  { value: "CNY", label: "CNY (Chinese Yuan)" },
  { value: "INR", label: "INR (Indian Rupee)" },
  { value: "AUD", label: "AUD (Australian Dollar)" },
  { value: "CAD", label: "CAD (Canadian Dollar)" },
  { value: "CHF", label: "CHF (Swiss Franc)" },
  { value: "HKD", label: "HKD (Hong Kong Dollar)" },
  { value: "SGD", label: "SGD (Singapore Dollar)" },
  { value: "ZAR", label: "ZAR (South African Rand)" },
  { value: "BRL", label: "BRL (Brazilian Real)" },
  { value: "MXN", label: "MXN (Mexican Peso)" },
  { value: "AED", label: "AED (UAE Dirham)" },
  { value: "SAR", label: "SAR (Saudi Riyal)" },
  { value: "NGN", label: "NGN (Nigerian Naira)" },
  { value: "KES", label: "KES (Kenyan Shilling)" },
  { value: "EGP", label: "EGP (Egyptian Pound)" },
]

export function SettingsForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings } = useSettings()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: settings.currency || "XOF",
      exportFormat: settings.exportFormat || "csv",
      theme: settings.theme || "system",
    },
  })

  // Update form when settings change
  useEffect(() => {
    form.reset({
      currency: settings.currency || "XOF",
      exportFormat: settings.exportFormat || "csv",
      theme: settings.theme || "system",
    })
  }, [settings, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      
      // Update theme and settings immediately
      setTheme(data.theme)
      await updateSettings(data)
      
      // Clear localStorage and set new theme
      localStorage.removeItem('settings')
      localStorage.setItem('settings', JSON.stringify(data))
      
      toast({
        title: "Theme updated",
        description: `Switched to ${data.theme} theme`,
      })
      
      return data
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Manage your application preferences and settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium">Display</h3>
                <p className="text-sm text-muted-foreground">
                  Customize the appearance of the application.
                </p>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select your preferred color theme.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Regional</h3>
                <p className="text-sm text-muted-foreground">
                  Configure regional settings and preferences.
                </p>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your preferred currency for displaying monetary values.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Export</h3>
                <p className="text-sm text-muted-foreground">
                  Configure export settings and formats.
                </p>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="exportFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Export Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select export format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your preferred format for exporting reports.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 