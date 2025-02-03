import { Category, ConditionArray, Data } from '@/types'

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
  options: { enableTodayFormat?: boolean } = {}
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
        if (
          subdata.type === 'expense' &&
          categories.includes(subdata.category) &&
          subdata.id !== excludeSubdataId
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

export const searchSubdata = (data: Data[], searchValue: string): Data[] => {
  return data
    .map((entry) => {
      const filteredSubdata = entry.subdata.filter((sub) =>
        sub.item.some((item) =>
          item.description.toLowerCase().includes(searchValue.toLowerCase())
        )
      )

      if (filteredSubdata.length > 0) {
        return {
          ...entry,
          subdata: filteredSubdata,
        }
      }

      return null
    })
    .filter((entry) => entry !== null) as Data[]
}

export const calculateSubdataSummary = (subdata: Data['subdata']) => {
  let totalSubdataIncome = 0
  let totalSubdataExpense = 0

  subdata.forEach((subdataItem) => {
    const subtotal = subdataItem.item.reduce(
      (acc, curr) => acc + curr.amount,
      0
    )

    if (subdataItem.type === 'income') {
      totalSubdataIncome += subtotal
    } else {
      totalSubdataExpense += subtotal
    }
  })

  return { totalSubdataIncome, totalSubdataExpense }
}
export function filterDataByCategory(
  data: Data[],
  category: string | null,
  from: string | null,
  to: string | null
): Data[] {
  const fromDate = from ? new Date(from) : null
  const toDate = to ? new Date(to) : null
  return data
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      const isBeforeTo = toDate ? entryDate <= toDate : true
      const isAfterFrom = fromDate ? entryDate >= fromDate : true
      return isBeforeTo && isAfterFrom
    })
    .map((entry) => {
      const filteredSubdata = entry.subdata.filter(
        (sub) => sub.category === category
      )

      if (filteredSubdata.length > 0) {
        return {
          ...entry,
          subdata: filteredSubdata,
        }
      }

      return null
    })
    .filter((entry) => entry !== null) as Data[]
}
