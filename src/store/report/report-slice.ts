import { createSlice } from '@reduxjs/toolkit'
import { setDashboardInfo, setDetailData } from './report-actions'
import {
  getDBDashboardInfo,
  getFilteredTransactionsThunk,
} from './report-thunk'
import { Data } from '@/types'

export type InitialState = {
  totalIncome: number
  totalExpenses: number
  totalBudget: number
  remainingBudget: number
  isLoading: boolean
  detailData: Data[]
  isDetailLoading: boolean
}

const initialState: InitialState = {
  totalIncome: 0,
  totalExpenses: 0,
  totalBudget: 0,
  remainingBudget: 0,
  isLoading: true,
  detailData: [],
  isDetailLoading: false,
}

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    resetState() {
      return { ...initialState, isLoading: false }
    },
    resetDetail(state) {
      state.detailData = []
      state.isDetailLoading = false
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
    builder.addCase(getFilteredTransactionsThunk.pending, (state) => {
      state.isDetailLoading = true
    })
    builder.addCase(getFilteredTransactionsThunk.fulfilled, setDetailData)
    builder.addCase(getFilteredTransactionsThunk.rejected, (state) => {
      state.isDetailLoading = false
    })
  },
})

export const reportAction = reportSlice.actions

export default reportSlice
