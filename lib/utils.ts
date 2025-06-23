import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple i18n translation utility
const translations: Record<string, Record<string, string>> = {
  en: {
    settings: "Settings",
    configure: "Configure system settings and preferences",
    preferences: "Preferences",
    save: "Save changes",
    display: "Display",
    regional: "Regional",
    export: "Export",
    language: "Language",
    select_language: "Select your preferred language for the application.",
  },
  fr: {
    settings: "Paramètres",
    configure: "Configurer les paramètres et préférences du système",
    preferences: "Préférences",
    save: "Enregistrer les modifications",
    display: "Affichage",
    regional: "Régional",
    export: "Exporter",
    language: "Langue",
    select_language: "Sélectionnez votre langue préférée pour l'application.",
  },
}

export function t(key: string, lang: string = 'en') {
  return translations[lang]?.[key] || translations['en'][key] || key
}
