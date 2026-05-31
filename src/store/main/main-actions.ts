import { PayloadAction } from '@reduxjs/toolkit'
import { DashboardInfo } from '@/types'
import { InitialState } from './main-slice'

export const setDashboardInfo = (
  state: InitialState,
  action: PayloadAction<DashboardInfo>
) => {
  const { totalIncome, totalExpense, totalBudget, remainingBudget } =
    action.payload

  state.totalIncome = totalIncome
  state.totalExpense = totalExpense
  state.totalBudget = totalBudget
  state.remainingBudget = remainingBudget
  state.isLoading = false
}
