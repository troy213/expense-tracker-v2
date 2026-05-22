import { DashboardInfo } from '@/types'
import { getCurrentMonthRange } from '@/utils'
import { getDB } from './connection'

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
  let totalExpenses = 0
  let totalIncome = 0

  transactions.forEach((transaction) => {
    const categoryType = categoryTypeById.get(transaction.category_id)
    if (categoryType === 'expense') {
      totalExpenses += transaction.amount

      if (transaction.date >= firstDate && transaction.date <= lastDate) {
        currentMonthExpenses += transaction.amount
      }
    } else if (categoryType === 'income') {
      totalIncome += transaction.amount
    }
  })

  return {
    totalExpenses,
    totalIncome,
    totalBudget,
    remainingBudget: totalBudget - currentMonthExpenses,
  }
}

const reportServices = {
  getDashboardInfo,
}

export default reportServices
