import { createAsyncThunk } from '@reduxjs/toolkit'
import dbServices from '@/lib/db'
import { TransactionFilters } from '@/types'
import { processMainData } from '@/utils'

export const getDBDashboardInfo = createAsyncThunk(
  'report/getDashboardInfo',
  async () => {
    const dashboardInfo = await dbServices.report.getDashboardInfo()

    return dashboardInfo
  }
)

export const getDBReportDetail = createAsyncThunk(
  'report/getDBReportDetail',
  async (filters: TransactionFilters) => {
    let selectedCategory = null
    if (filters.category_id) {
      const category = await dbServices.categories.getCategoryById(
        filters.category_id
      )
      selectedCategory = category || null
    }

    const transactions =
      await dbServices.transactions.getFilteredTransactions(filters)
    return { data: processMainData(transactions), selectedCategory }
  }
)
