import { createAsyncThunk } from '@reduxjs/toolkit'
import dbServices from '@/lib/db'
import { Category, TransactionFilters } from '@/types'
import { getCurrentMonthRange, processMainData } from '@/utils'

export const getDBReportDetail = createAsyncThunk(
  'report/getDBReportDetail',
  async (filters: TransactionFilters) => {
    let selectedDetailCategory: Category | null = null
    let detailIncome = 0
    let detailExpense = 0
    let detailBudget = 0
    let detailRemainingBudget = 0

    const categories = await dbServices.categories.getAllCategories()
    const categoriesMap = new Map(categories.map((c) => [c.id, c]))

    if (filters.category_id) {
      selectedDetailCategory = categoriesMap.get(filters.category_id) ?? null
      detailBudget = categoriesMap.get(filters.category_id)?.budget ?? 0
    }

    const transactions =
      await dbServices.transactions.getFilteredTransactions(filters)

    const data = processMainData(transactions)
    const detailCount = data.length

    let currentMonthExpenses = 0

    transactions.forEach((tx) => {
      const { firstDate, lastDate } = getCurrentMonthRange()
      if (tx.date >= firstDate && tx.date <= lastDate) {
        currentMonthExpenses += tx.amount
      }

      if (categoriesMap.get(tx.category_id)?.type === 'income') {
        detailIncome += tx.amount
      } else {
        detailExpense += tx.amount
      }
    })

    if (detailBudget)
      detailRemainingBudget = detailBudget - currentMonthExpenses

    return {
      data,
      detailCount,
      detailIncome,
      detailExpense,
      detailBudget,
      detailRemainingBudget,
      selectedDetailCategory,
    }
  }
)
