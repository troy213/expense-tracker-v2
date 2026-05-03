import {
  Category,
  CategoryType,
  ConditionArray,
  Data,
  Transaction,
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

export const setStateReducerValue = <T, K extends keyof T>(
  state: T,
  key: K,
  value: T[K]
) => {
  state[key] = value
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

export const updateTotal = (data: Data[], categories: Category[]) => {
  const { totalIncome, totalExpense } = data.reduce(
    (total, currData) => {
      currData.subdata.forEach((sub) => {
        const category = getCategoryById(sub.category_id, categories)
        const itemTotal = sub.item.reduce((sum, i) => sum + i.amount, 0)
        if (category?.type === 'income') {
          total.totalIncome += itemTotal
        } else if (category?.type === 'expense') {
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
