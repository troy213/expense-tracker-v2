import { createSlice } from '@reduxjs/toolkit'
import { setDashboardInfo, setDetailData } from './report-actions'
import { getDBDashboardInfo, getDBReportDetail } from './report-thunk'
import { Category, Data } from '@/types'

export type InitialState = {
  totalIncome: number
  totalExpenses: number
  totalBudget: number
  remainingBudget: number
  isLoading: boolean
  detailIncome: number
  detailExpense: number
  detailBudget: number
  detailRemainingBudget: number
  detailData: Data[]
  selectedDetailCategory: Category | null
  isDetailLoading: boolean
}

const initialState: InitialState = {
  totalIncome: 0,
  totalExpenses: 0,
  totalBudget: 0,
  remainingBudget: 0,
  isLoading: true,
  detailIncome: 0,
  detailExpense: 0,
  detailBudget: 0,
  detailRemainingBudget: 0,
  detailData: [],
  selectedDetailCategory: null,
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
      state.detailIncome = 0
      state.detailExpense = 0
      state.detailBudget = 0
      state.detailRemainingBudget = 0
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
    builder.addCase(getDBReportDetail.pending, (state) => {
      state.isDetailLoading = true
    })
    builder.addCase(getDBReportDetail.fulfilled, setDetailData)
    builder.addCase(getDBReportDetail.rejected, (state) => {
      state.isDetailLoading = false
    })
  },
})

export const reportAction = reportSlice.actions

export default reportSlice
