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
import { t } from "@/lib/utils"

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
  language: z.enum(['en', 'fr'], {
    required_error: "Please select a language.",
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

const languages = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
]

export function SettingsForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings } = useSettings()
  const lang = settings.language || 'en'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: settings.currency || "XOF",
      exportFormat: settings.exportFormat || "csv",
      theme: settings.theme || "system",
      language: settings.language || "en",
    },
  })

  // Update form when settings change
  useEffect(() => {
    form.reset({
      currency: settings.currency || "XOF",
      exportFormat: settings.exportFormat || "csv",
      theme: settings.theme || "system",
      language: settings.language || "en",
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
      
      // Update language in context
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', data.language)
      }
      
      toast({
        title: "Settings updated",
        description: `Preferences saved successfully!`,
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
        <CardTitle>{t('preferences', lang)}</CardTitle>
        <CardDescription>{t('configure', lang)}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium">{t('display', lang)}</h3>
                <p className="text-sm text-muted-foreground">
                  {lang === 'fr' ? "Personnalisez l'apparence de l'application." : "Customize the appearance of the application."}
                </p>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('theme', lang) || 'Theme'}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={lang === 'fr' ? 'Sélectionner le thème' : 'Select theme'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">{lang === 'fr' ? 'Clair' : 'Light'}</SelectItem>
                            <SelectItem value="dark">{lang === 'fr' ? 'Sombre' : 'Dark'}</SelectItem>
                            <SelectItem value="system">{lang === 'fr' ? 'Système' : 'System'}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {lang === 'fr' ? "Sélectionnez votre thème de couleur préféré." : "Select your preferred color theme."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('language', lang)}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_language', lang)} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languages.map((langOpt) => (
                              <SelectItem key={langOpt.value} value={langOpt.value}>
                                {langOpt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t('select_language', lang)}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">{t('regional', lang)}</h3>
                <p className="text-sm text-muted-foreground">
                  {lang === 'fr' ? "Configurez les paramètres régionaux et les préférences." : "Configure regional settings and preferences."}
                </p>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'fr' ? 'Devise' : 'Currency'}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={lang === 'fr' ? 'Sélectionner une devise' : 'Select a currency'} />
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
                          {lang === 'fr' ? "Choisissez votre devise préférée pour l'affichage des valeurs monétaires." : "Choose your preferred currency for displaying monetary values."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">{t('export', lang)}</h3>
                <p className="text-sm text-muted-foreground">
                  {lang === 'fr' ? "Configurez les paramètres et formats d'exportation." : "Configure export settings and formats."}
                </p>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="exportFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang === 'fr' ? 'Format d\'exportation' : 'Export Format'}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={lang === 'fr' ? 'Sélectionner le format' : 'Select export format'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {lang === 'fr' ? "Choisissez votre format préféré pour l'exportation des rapports." : "Choose your preferred format for exporting reports."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (lang === 'fr' ? 'Enregistrement...' : 'Saving...') : t('save', lang)}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 