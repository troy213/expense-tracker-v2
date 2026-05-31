import { PayloadAction } from '@reduxjs/toolkit'
import { Category, Data } from '@/types'
import { InitialState } from './report-detail-slice'

export const setDetailData = (
  state: InitialState,
  action: PayloadAction<{
    data: Data[]
    totalIncome: number
    totalExpense: number
    totalBudget: number
    remainingBudget: number
    selectedDetailCategory: Category | null
  }>
) => {
  const {
    data,
    totalIncome,
    totalExpense,
    totalBudget,
    remainingBudget,
    selectedDetailCategory,
  } = action.payload

  state.data = data
  state.totalIncome = totalIncome
  state.totalExpense = totalExpense
  state.totalBudget = totalBudget
  state.remainingBudget = remainingBudget
  state.selectedDetailCategory = selectedDetailCategory
  state.isLoading = false
}
