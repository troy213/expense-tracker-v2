import { v7 as uuidv7 } from 'uuid'
import {
  DEFAULT_EXPENSE_COLOR,
  DEFAULT_INCOME_COLOR,
} from '@/assets/categories-icons'
import { TIME_FILTER } from '@/constants'
import {
  Category,
  CategoryType,
  ConditionArray,
  Data,
  Locales,
  Theme,
  Transaction,
  TransactionFilters,
} from '@/types'

export const combineClassName = (
  defaultStyle: string = '',
  conditionArray: (string | ConditionArray)[] = []
): string => {
  let result = defaultStyle

  conditionArray.forEach((item) => {
    if (typeof item === 'string' && item.trim()) result += ` ${item}`
    if (item && typeof item !== 'string' && item.condition)
      result += ` ${item.className ?? ''}`
  })

  return result.trim()
}

// return a date with {year}-{month}-{date} format
export const getDate = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()

  return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`
}

export const formatTransactionDate = (
  dateString: string,
  formatMessage: (value: { id: string }) => string = () => '',
  options: { enableTodayFormat?: boolean; enableDayName?: boolean } = {}
): string => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0) // Normalize to start of day
  date.setHours(0, 0, 0, 0) // Normalize input date for accurate comparison

  const isToday = date.getTime() === today.setHours(0, 0, 0, 0)
  const isYesterday = date.getTime() === yesterday.getTime()

  if (isToday && options.enableTodayFormat) {
    return formatMessage({ id: 'today' })
  } else if (isYesterday && options.enableTodayFormat) {
    return formatMessage({ id: 'yesterday' })
  } else {
    return date.toLocaleDateString('en-GB', {
      weekday: options.enableDayName ? 'long' : undefined,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }
}

export const currencyFormatter = (amount: string | number) => {
  const number = typeof amount === 'string' ? Number(amount) : amount

  if (isNaN(number)) return 0

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  })

  return formatter.format(number || 0)
}

export const setStorage = <T>(key: string, value: T): void => {
  if (Array.isArray(value)) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.setItem(key, typeof value === 'string' ? value.toString() : '')
  }
}

export const getStorage = (key: string) => {
  return localStorage.getItem(key)
}

export const calculateModalBottomThreshold = () => {
  const DEFAULT_FONT_SIZE = Number(
    window
      .getComputedStyle(document.body)
      .getPropertyValue('font-size')
      .replace(/[^0-9]/g, '')
  )
  const TOOLBAR_HEIGHT = DEFAULT_FONT_SIZE * 4
  const GAP = DEFAULT_FONT_SIZE * 3 // change this multiplier value to set the modal higher

  const THRESHOLD = GAP + TOOLBAR_HEIGHT

  return THRESHOLD
}

// Returns the first/last date (YYYY-MM-DD) of the month the given date falls in.
// dateString is expected to be a zero-padded 'YYYY-MM-DD' value (see getDate()).
export const getMonthRange = (dateString: string) => {
  const [yearStr, monthStr] = dateString.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr) // 1-based

  // First day of the month
  const firstDate = `${year}-${String(month).padStart(2, '0')}-01`

  // Last day of the month (day 0 of next month)
  const lastDay = new Date(year, month, 0).getDate()
  const lastDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  return {
    firstDate,
    lastDate,
  }
}

export const getCurrentMonthRange = () => getMonthRange(getDate())

// Maps a Date to a zero-padded local 'YYYY-MM-DD' key (mirrors getDate()).
// Exported so callers converting a Date back to a date string stay timezone-safe
// (toISOString() would shift the day in non-UTC timezones).
export const toDateKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Translates a TIME_FILTER selection into inclusive 'YYYY-MM-DD' bounds.
// All Time yields null bounds (no date filtering).
export const getDateRangeForFilter = (
  rangeType: number,
  custom?: { from: string; to: string }
): { dateFrom: string | null; dateTo: string | null } => {
  const now = new Date()

  switch (rangeType) {
    case TIME_FILTER.THIS_MONTH: {
      const { firstDate, lastDate } = getMonthRange(toDateKey(now))
      return { dateFrom: firstDate, dateTo: lastDate }
    }
    case TIME_FILTER.LAST_MONTH: {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const { firstDate, lastDate } = getMonthRange(toDateKey(lastMonth))
      return { dateFrom: firstDate, dateTo: lastDate }
    }
    case TIME_FILTER.THIS_YEAR:
      return {
        dateFrom: `${now.getFullYear()}-01-01`,
        dateTo: `${now.getFullYear()}-12-31`,
      }
    case TIME_FILTER.CUSTOM_FILTER:
      return { dateFrom: custom?.from ?? null, dateTo: custom?.to ?? null }
    case TIME_FILTER.ALL_TIME:
    default:
      return { dateFrom: null, dateTo: null }
  }
}

/**
 *
 * @param date YYYY-MM-DD format
 * @returns total elapsed day
 */
export const getElapsedDay = (date: string): number => {
  const now = getDate()
  const [sy, sm, sd] = date.split('-').map(Number)
  const [ey, em, ed] = now.split('-').map(Number)
  const start = new Date(sy, sm - 1, sd)
  const end = new Date(ey, em - 1, ed)
  const diffMs = end.getTime() - start.getTime()
  return Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1
}

// Pure predicate chain over a flat Transaction[]. All provided filters are
// combined with AND. Dates are 'YYYY-MM-DD' strings (lexicographic compare).
export const filterTransactions = (
  transactions: Transaction[],
  categories: Category[],
  filters: TransactionFilters
): Transaction[] => {
  const { type, category_id, search, date_from, date_to } = filters
  const typeById = type ? new Map(categories.map((c) => [c.id, c.type])) : null
  const lowerSearch = search?.toLowerCase()

  return transactions.filter((tx) => {
    if (type && typeById!.get(tx.category_id) !== type) return false
    if (category_id && tx.category_id !== category_id) return false
    if (lowerSearch && !tx.description.toLowerCase().includes(lowerSearch))
      return false
    if (date_from && tx.date < date_from) return false
    if (date_to && tx.date > date_to) return false
    return true
  })
}

// Builds a report-detail query string, omitting empty/null params.
export const buildReportDetailQuery = (ctx: {
  type?: 'income' | 'expense'
  categoryId?: string
  search?: string
  dateFrom?: string | null
  dateTo?: string | null
}): string => {
  const params = new URLSearchParams()
  if (ctx.type) params.set('type', ctx.type)
  if (ctx.categoryId) params.set('category_id', ctx.categoryId)
  if (ctx.search) params.set('search', ctx.search)
  if (ctx.dateFrom) params.set('date_from', ctx.dateFrom)
  if (ctx.dateTo) params.set('date_to', ctx.dateTo)
  return params.toString()
}

// Returns the 'YYYY-MM' month key of a 'YYYY-MM-DD' date string. Year-aware, so
// the same month in two different years yields different keys.
export const getMonthKey = (dateString: string): string =>
  dateString.slice(0, 7)

// Returns the full month name only (no year), e.g. 'May'. Parsed from the
// numeric parts and built in local time (mirrors getMonthRange) so day-01 dates
// never slip to the previous month in negative-offset timezones.
export const formatMonthLabel = (dateString: string): string => {
  const [yearStr, monthStr] = dateString.split('-')
  const date = new Date(Number(yearStr), Number(monthStr) - 1, 1)
  return date.toLocaleDateString('en-GB', { month: 'long' })
}

// True when `currentDate` starts a new month relative to the entry above it
// (or when there is no entry above it). The boundary key is year-aware.
export const shouldShowMonthHeader = (
  currentDate: string,
  prevDate?: string
): boolean =>
  prevDate === undefined || getMonthKey(prevDate) !== getMonthKey(currentDate)

export const calculateRemainingBudget = (
  txData: Data[],
  txDetails: { description: string; amount: number }[],
  categoriesData: Category[],
  categoryIds: string[] = [],
  budget: number = 0,
  date: string = '',
  excludeSubdataId: string = ''
) => {
  const { firstDate, lastDate } = getCurrentMonthRange()
  const currentExpenses =
    date >= firstDate && date <= lastDate
      ? txDetails.reduce((acc, curr) => acc + curr.amount, 0)
      : 0

  const currentMonthExpenses = txData.reduce((total, entry) => {
    if (entry.date >= firstDate && entry.date <= lastDate) {
      entry.subdata.forEach((subdata) => {
        const category = getCategoryById(subdata.category_id, categoriesData)
        if (
          category?.type === 'expense' &&
          categoryIds.includes(subdata.category_id) &&
          category.id !== excludeSubdataId
        ) {
          total += subdata.item.reduce((acc, curr) => acc + curr.amount, 0)
        }
      })
    }
    return total
  }, 0)

  const remainingBudget = budget - currentMonthExpenses - currentExpenses

  return remainingBudget
}

export const calculatePercentage = (currentValue: number, maxValue: number) => {
  const output = (currentValue / maxValue) * 100

  if (!isFinite(output)) return 100
  return Number(output.toFixed(2))
}

export const calculateSubdataSummary = (
  subdata: Data['subdata'],
  categories: Category[]
) => {
  let totalSubdataIncome = 0
  let totalSubdataExpense = 0

  const categoryTypeMap = new Map(categories.map((c) => [c.id, c.type]))

  subdata.forEach((subdataItem) => {
    const subtotal = subdataItem.item.reduce(
      (acc, curr) => acc + curr.amount,
      0
    )

    const categoryType = categoryTypeMap.get(subdataItem.category_id)

    if (categoryType === 'income') {
      totalSubdataIncome += subtotal
    } else {
      totalSubdataExpense += subtotal
    }
  })

  return { totalSubdataIncome, totalSubdataExpense }
}

export const getStorageConfig = (): { hideBalance: boolean } => {
  const storedConfig = getStorage('config')

  if (storedConfig) {
    return JSON.parse(storedConfig)
  }
  return { hideBalance: false }
}

/**
 * Converts flat transaction array to nested Data structure
 * Logic:
 * 1. Group transactions by date
 * 2. For each date, group transactions by category_id
 * 3. For each category, collect transaction items (id, description, amount)
 */
export const processMainData = (transactions: Transaction[]): Data[] => {
  type SubdataItemType = { id: string; description: string; amount: number }
  const dataMap = new Map<string, Map<string, SubdataItemType[]>>()

  // Step 1: Group by date and category
  transactions.forEach((tx) => {
    const txItem: SubdataItemType = {
      id: tx.id,
      description: tx.description,
      amount: tx.amount,
    }

    if (!dataMap.has(tx.date)) {
      dataMap.set(tx.date, new Map())
    }

    const categoryMap = dataMap.get(tx.date)!

    if (!categoryMap.has(tx.category_id)) {
      categoryMap.set(tx.category_id, [])
    }

    categoryMap.get(tx.category_id)!.push(txItem)
  })

  // Step 2: Convert to Data[] and sort
  const result: Data[] = []

  dataMap.forEach((categoryMap, date) => {
    const subdata: Data['subdata'] = []

    categoryMap.forEach((itemList, category_id) => {
      subdata.push({ category_id, item: itemList })
    })

    result.push({ date, subdata })
  })

  return result.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

/**
 * Groups transactions by date
 * Returns a Map where key is date and value is array of transactions for that date
 */
export const groupTransactionsByDate = (
  transactions: Transaction[]
): Map<string, Transaction[]> => {
  const grouped = new Map<string, Transaction[]>()

  transactions.forEach((tx) => {
    if (!grouped.has(tx.date)) {
      grouped.set(tx.date, [])
    }
    grouped.get(tx.date)!.push(tx)
  })

  // Sort dates in descending order (newest first)
  return new Map(
    Array.from(grouped.entries()).sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime()
    )
  )
}

/**
 * Calculates daily income and expense totals based on category types
 */
export const calculateDailyTotals = (
  transactions: Transaction[],
  categories: Category[] = []
) => {
  const categoryTypeMap = new Map(categories.map((c) => [c.id, c.type]))

  return transactions.reduce(
    (acc, tx) => {
      const txType = categoryTypeMap.get(tx.category_id) || 'expense'
      const isIncome = txType === 'income'
      return {
        income: acc.income + (isIncome ? tx.amount : 0),
        expense: acc.expense + (isIncome ? 0 : tx.amount),
      }
    },
    { income: 0, expense: 0 }
  )
}

/**
 * Gets category from category list by ID
 */
export const getCategoryById = (
  categoryId: string,
  categories: Category[] = []
): Category | undefined => {
  return categories.find((c) => c.id === categoryId)
}

/**
 * Gets category type from category list by ID
 */
export const getCategoryType = (
  categoryId: string,
  categories: Category[] = []
): 'income' | 'expense' => {
  return categories.find((c) => c.id === categoryId)?.type ?? 'expense'
}

/**
 * Formats transaction amount with sign based on type
 */
export const formatTransactionAmount = (
  amount: number,
  type: CategoryType
): number => {
  return type === 'expense' ? -amount : amount
}

export const makeEmptyTransactionItem = () => ({
  id: uuidv7(),
  description: '',
  amount: 0,
})

export const getDefaultCategoryIconColor = (type?: CategoryType): string => {
  if (type === 'income') return DEFAULT_INCOME_COLOR
  return DEFAULT_EXPENSE_COLOR
}

// Keyed by Theme, so adding a theme is a compile error until a label is given.
const THEME_TRANSLATION_KEY: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export const getThemeTranslationKey = (theme: Theme): string =>
  THEME_TRANSLATION_KEY[theme]

const LANGUAGE_TRANSLATION_KEY: Record<Locales, string> = {
  'en-US': 'English',
  'id-ID': 'Indonesia',
}

export const getLanguageTranslationKey = (locale: Locales): string =>
  LANGUAGE_TRANSLATION_KEY[locale]
