import { PayloadAction } from '@reduxjs/toolkit'
import { DashboardInfo } from '@/types'
import { InitialState } from './report-slice'

export const setDashboardInfo = (
  state: InitialState,
  action: PayloadAction<DashboardInfo>
) => {
  const { totalIncome, totalExpenses, totalBudget, remainingBudget } =
    action.payload

  state.totalIncome = totalIncome
  state.totalExpenses = totalExpenses
  state.totalBudget = totalBudget
  state.remainingBudget = remainingBudget
  state.isLoading = false
}
