import { PayloadAction } from '@reduxjs/toolkit'
import { ReportCategory } from '@/types'
import { InitialState } from './report-slice'

export const setReportData = (
  state: InitialState,
  action: PayloadAction<{
    totalIncome: number
    totalExpense: number
    avgSpending: number
    incomeReport: ReportCategory[]
    expenseReport: ReportCategory[]
  }>
) => {
  const {
    totalIncome,
    totalExpense,
    avgSpending,
    incomeReport,
    expenseReport,
  } = action.payload
  state.totalIncome = totalIncome
  state.totalExpense = totalExpense
  state.avgSpending = avgSpending
  state.incomeReport = incomeReport
  state.expenseReport = expenseReport
  state.isLoading = false
}
