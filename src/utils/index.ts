import { Category, ConditionArray, Data } from '@/types'

export const combineClassName = (
  defaultStyle: string = '',
  conditionArray: string[] | ConditionArray[] = []
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

  return `${year}-${month}-${date}`
}

export const formatTransactionDate = (
  dateString: string,
  options: { enableTodayFormat?: boolean } = {}
): string => {
  const date = new Date(dateString)
  const today = new Date()

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  if (isToday && options.enableTodayFormat) {
    return 'today'
  } else {
    return date.toLocaleDateString('en-GB', {
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

export const setStateReducerValue = <T, K extends keyof T>(
  state: T,
  key: K,
  value: T[K]
) => {
  state[key] = value
}

export const setStorage = (
  key: string,
  value: string | Data[] | Category[] | number
): void => {
  if (Array.isArray(value)) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.setItem(key, value.toString())
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

export const updateTotal = (data: Data[]) => {
  const { totalIncome, totalExpense } = data.reduce(
    (total, currData) => {
      currData.subdata.forEach((sub) => {
        const itemTotal = sub.item.reduce((sum, i) => sum + i.amount, 0)
        if (sub.type === 'income') {
          total.totalIncome += itemTotal
        } else if (sub.type === 'expense') {
          total.totalExpense += itemTotal
        }
      })
      return total
    },
    { totalIncome: 0, totalExpense: 0 }
  )
  const totalBalance = totalIncome - totalExpense
  return { totalIncome, totalExpense, totalBalance }
}

export const getCurrentMonthRange = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // Months are zero-based, so add 1

  // First day of the month
  const firstDate = `${year}-${String(month).padStart(2, '0')}-01`

  // Last day of the month
  const lastDay = new Date(year, month, 0).getDate()
  const lastDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  return {
    firstDate,
    lastDate,
  }
}

export const calculateRemainingBudget = (
  txData: Data[],
  txDetails: { description: string; amount: number }[],
  categories: string[] = [],
  budget: number = 0
) => {
  const currentExpenses = txDetails.reduce((acc, curr) => acc + curr.amount, 0)
  const { firstDate, lastDate } = getCurrentMonthRange()

  const currentMonthExpenses = txData.reduce((total, entry) => {
    if (entry.date >= firstDate && entry.date <= lastDate) {
      entry.subdata.forEach((subdata) => {
        if (
          subdata.type === 'expense' &&
          categories.includes(subdata.category)
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
