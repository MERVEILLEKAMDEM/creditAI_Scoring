"use client"

import type { Metadata } from "next"
import Image from "next/image"
import { SettingsForm } from "@/components/dashboard/settings-form"
import { useSettings } from "@/contexts/settings-context"
import { t } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const { settings } = useSettings()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const lang = settings.language || 'en'
  if (!mounted) {
    return null // or a loading spinner
  } 
  return (
    <div className="relative space-y-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/2676163.jpg"
          alt="Settings Background"
          fill
          className="object-cover object-center opacity-20 dark:opacity-10"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('settings', lang)}</h1>
              <p className="text-muted-foreground">{t('configure', lang)}</p>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/th.jpg"
                alt="AI Credit Risk Logo"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('display', lang)}</h2>
              <SettingsForm />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              {/* Add security settings section */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 