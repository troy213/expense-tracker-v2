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
  ALPHANUMERIC: {
    PATTERN: /^[a-zA-Z0-9]+$/,
    ERROR_MESSAGE: 'AlphanumericError',
  },
  COMMON_TEXT: {
    PATTERN: /^[ a-zA-Z0-9!@#$%^&*()_,.-]+$/,
    ERROR_MESSAGE: 'CommonTextError',
  },
  LETTER: {
    PATTERN: /^[a-zA-Z]+$/,
    ERROR_MESSAGE: 'LetterError',
  },
  NUMBER: {
    PATTERN: /^\d+$/,
    ERROR_MESSAGE: 'NumberError',
  },
}

export const DATE_RANGE = {
  ALL_TIME: 0,
  THIS_MONTH: 1,
  LAST_MONTH: 2,
  THIS_YEAR: 3,
  CUSTOM_FILTER: 4,
}
