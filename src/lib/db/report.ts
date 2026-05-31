import { DashboardInfo, ReportCategory } from '@/types'
import {
  filterTransactions,
  getCurrentMonthRange,
  getDate,
  getElapsedDay,
} from '@/utils'
import { getDB } from './connection'

/**
 * Pure helper: average daily expense within the window defined by oldestDate
 * through today, excluding future-dated expenses from the numerator.
 * The denominator is clamped to at least 1 so we never divide by zero or
 * produce a negative/NaN result when oldestDate is in the future.
 */
export const computeAvgSpending = (
  totalExpense: number,
  totalFutureExpense: number,
  oldestDate: string
): number => {
  const elapsedDay = Math.max(1, getElapsedDay(oldestDate))
  return (totalExpense - totalFutureExpense) / elapsedDay
}

/**
 * Get dashboard info
 */
async function getDashboardInfo(): Promise<DashboardInfo> {
  const database = await getDB()
  const transactions = await database.getAll('transactions')
  const categories = await database.getAll('categories')
  const { firstDate, lastDate } = getCurrentMonthRange()

  const totalBudget = categories.reduce((sum, category) => {
    if (category.type === 'expense' && category.budget) {
      return sum + category.budget
    }
    return sum
  }, 0)

  const categoryTypeById = new Map(categories.map((c) => [c.id, c.type]))

  let currentMonthExpenses = 0
  let totalExpense = 0
  let totalIncome = 0

  transactions.forEach((transaction) => {
    const categoryType = categoryTypeById.get(transaction.category_id)
    if (categoryType === 'expense') {
      totalExpense += transaction.amount

      if (transaction.date >= firstDate && transaction.date <= lastDate) {
        currentMonthExpenses += transaction.amount
      }
    } else if (categoryType === 'income') {
      totalIncome += transaction.amount
    }
  })

  return {
    totalExpense,
    totalIncome,
    totalBudget,
    remainingBudget: totalBudget - currentMonthExpenses,
  }
}

/**
 * Get report data
 */
async function getReportData(
  dateFrom?: string | null,
  dateTo?: string | null
): Promise<{
  totalIncome: number
  totalExpense: number
  avgSpending: number
  incomeReport: ReportCategory[]
  expenseReport: ReportCategory[]
}> {
  const database = await getDB()
  const [categories, transactions] = await Promise.all([
    database.getAll('categories'),
    database.getAll('transactions'),
  ])

  // null/undefined bounds mean "All Time" — skip that edge of the filter.
  const filteredTransactions = filterTransactions(transactions, categories, {
    date_from: dateFrom ?? undefined,
    date_to: dateTo ?? undefined,
  })

  // Sum amounts per category in a single pass over the filtered transactions.
  // Dates are 'YYYY-MM-DD', so lexicographic string compare is correct and
  // avoids allocating a Date per transaction.
  const typeById = new Map(categories.map((c) => [c.id, c.type]))
  let oldestDate = getDate()
  const currentDate = getDate()
  let totalFutureExpense = 0
  const totalByCategory = new Map<string, number>()
  filteredTransactions.forEach((t) => {
    if (t.date < oldestDate) oldestDate = t.date
    if (t.date > currentDate && typeById.get(t.category_id) === 'expense')
      totalFutureExpense += t.amount

    const categoryTotal = totalByCategory.get(t.category_id) ?? 0

    totalByCategory.set(t.category_id, categoryTotal + t.amount)
  })

  let totalIncome = 0
  let totalExpense = 0
  const incomeReport: ReportCategory[] = []
  const expenseReport: ReportCategory[] = []

  categories.forEach((c) => {
    const categoryTotal = totalByCategory.get(c.id) ?? 0
    if (categoryTotal <= 0) return // omit categories with no activity in range

    if (c.type === 'income') {
      totalIncome += categoryTotal
      incomeReport.push({ ...c, total: categoryTotal })
    } else if (c.type === 'expense') {
      totalExpense += categoryTotal
      expenseReport.push({ ...c, total: categoryTotal })
    }
  })

  incomeReport.sort((a, b) => b.total - a.total)
  expenseReport.sort((a, b) => b.total - a.total)

  const avgSpending = computeAvgSpending(
    totalExpense,
    totalFutureExpense,
    oldestDate
  )

  return {
    totalIncome,
    totalExpense,
    avgSpending,
    incomeReport,
    expenseReport,
  }
}

const reportServices = {
  getDashboardInfo,
  getReportData,
}

export default reportServices
