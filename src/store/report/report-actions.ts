import { PayloadAction } from '@reduxjs/toolkit'
import { Data, Category } from '@/types'
import { InitialState } from './report-slice'

export const setDetailData = (
  state: InitialState,
  action: PayloadAction<{
    data: Data[]
    detailCount: number
    detailIncome: number
    detailExpense: number
    detailBudget: number
    detailRemainingBudget: number
    selectedDetailCategory: Category | null
  }>
) => {
  const {
    data,
    detailCount,
    detailIncome,
    detailExpense,
    detailBudget,
    detailRemainingBudget,
    selectedDetailCategory,
  } = action.payload

  state.detailData = data
  state.detailCount = detailCount
  state.detailIncome = detailIncome
  state.detailExpense = detailExpense
  state.detailBudget = detailBudget
  state.detailRemainingBudget = detailRemainingBudget
  state.selectedDetailCategory = selectedDetailCategory || null
  state.isDetailLoading = false
}
