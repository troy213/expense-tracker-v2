import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setDetailData } from './report-actions'
import { getDBReportDetail } from './report-thunk'
import { Category, Data, SetStatePayload } from '@/types'
import { DATE_RANGE } from '@/constants'
import { setStateReducerValue } from '@/utils'
import { addAsyncThunkCases } from '../utils'

export type InitialState = {
  isLoading: boolean
  customRange: { from: string; to: string } | null
  dateRange: number
  detailCount: number
  detailIncome: number
  detailExpense: number
  detailBudget: number
  detailRemainingBudget: number
  detailData: Data[]
  selectedDetailCategory: Category | null
  isDetailLoading: boolean
}

const initialState: InitialState = {
  isLoading: true,
  customRange: null,
  dateRange: DATE_RANGE.ALL_TIME,
  detailCount: 0,
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
    setState(
      state: InitialState,
      action: PayloadAction<SetStatePayload<InitialState>>
    ) {
      const { state: key, value } = action.payload

      setStateReducerValue(state, key, value)
    },
    resetState() {
      return { ...initialState, isLoading: false }
    },
    resetDetail(state) {
      state.detailCount = 0
      state.detailIncome = 0
      state.detailExpense = 0
      state.detailBudget = 0
      state.detailRemainingBudget = 0
      state.detailData = []
      state.isDetailLoading = false
    },
  },
  extraReducers: (builder) => {
    addAsyncThunkCases(
      builder,
      getDBReportDetail,
      'isDetailLoading',
      setDetailData
    )
  },
})

export const reportAction = reportSlice.actions

export default reportSlice
