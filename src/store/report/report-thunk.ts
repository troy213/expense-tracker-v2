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

export const getFilteredTransactionsThunk = createAsyncThunk(
  'report/getFilteredTransactions',
  async (filters: TransactionFilters) => {
    const transactions =
      await dbServices.transactions.getFilteredTransactions(filters)
    return processMainData(transactions)
  }
)
