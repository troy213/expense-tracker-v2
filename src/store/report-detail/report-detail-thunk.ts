import { createAsyncThunk } from '@reduxjs/toolkit'
import dbServices from '@/lib/db'
import { Category, TransactionFilters } from '@/types'
import { getCurrentMonthRange, processMainData } from '@/utils'

export const getDBReportDetail = createAsyncThunk(
  'reportDetail/getReportDetail',
  async (filters: TransactionFilters) => {
    let selectedDetailCategory: Category | null = null
    let totalIncome = 0
    let totalExpense = 0
    let totalBudget = 0
    let remainingBudget = 0

    const categories = await dbServices.categories.getAllCategories()
    const categoriesMap = new Map(categories.map((c) => [c.id, c]))

    if (filters.category_id) {
      selectedDetailCategory = categoriesMap.get(filters.category_id) ?? null
      totalBudget = categoriesMap.get(filters.category_id)?.budget ?? 0
    }

    const transactions =
      await dbServices.transactions.getFilteredTransactions(filters)

    const data = processMainData(transactions)

    let currentMonthExpenses = 0
    const { firstDate, lastDate } = getCurrentMonthRange()

    transactions.forEach((tx) => {
      if (tx.date >= firstDate && tx.date <= lastDate) {
        currentMonthExpenses += tx.amount
      }

      if (categoriesMap.get(tx.category_id)?.type === 'income') {
        totalIncome += tx.amount
      } else {
        totalExpense += tx.amount
      }
    })

    if (totalBudget) remainingBudget = totalBudget - currentMonthExpenses

    return {
      data,
      totalIncome,
      totalExpense,
      totalBudget,
      remainingBudget,
      selectedDetailCategory,
    }
  }
)
