import { createSlice } from '@reduxjs/toolkit'
import { setDashboardInfo } from './report-actions'
import { getDBDashboardInfo } from './report-thunk'

export type InitialState = {
  totalIncome: number
  totalExpenses: number
  totalBudget: number
  remainingBudget: number
  isLoading: boolean
}

const initialState: InitialState = {
  totalIncome: 0,
  totalExpenses: 0,
  totalBudget: 0,
  remainingBudget: 0,
  isLoading: true,
}

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    resetState() {
      return { ...initialState, isLoading: false }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDBDashboardInfo.fulfilled, setDashboardInfo)
    builder.addCase(getDBDashboardInfo.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getDBDashboardInfo.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const reportAction = reportSlice.actions

export default reportSlice
