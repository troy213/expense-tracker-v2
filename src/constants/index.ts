import { english, indonesia } from '@/locales'
import { Locales, Theme } from '@/types'

type CountryKey = 'ENGLISH' | 'INDONESIA'

type ThemeKey = 'LIGHT' | 'DARK'

type Messages = {
  [key: string]: {
    locale: string
    messages: Record<string, string>
  }
}

export const LOCALES: Record<CountryKey, Locales> = {
  ENGLISH: 'en-US',
  INDONESIA: 'id-ID',
} as const

export const THEME: Record<ThemeKey, Theme> = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

export const LANGUAGES: Messages = {
  [LOCALES.ENGLISH]: english,
  [LOCALES.INDONESIA]: indonesia,
} as const

export const REGEX = {
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  COMMON_TEXT: /^[a-zA-Z0-9& ]+$/,
  LETTER: /^[a-zA-Z]+$/,
  NUMBER: /^\d+$/,
}
