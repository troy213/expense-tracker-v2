import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReportCategory, SetStatePayload } from '@/types'
import { TIME_FILTER } from '@/constants'
import { setStateReducerValue } from '@/utils'
import { addAsyncThunkCases } from '../utils'
import { setReportData } from './report-actions'
import { getDBReportData } from './report-thunk'

export type InitialState = {
  isLoading: boolean
  customRange: { from: string; to: string } | null
  timeFilter: number
  totalIncome: number
  totalExpense: number
  avgSpending: number
  incomeReport: ReportCategory[]
  expenseReport: ReportCategory[]
}

const initialState: InitialState = {
  isLoading: false,
  customRange: null,
  timeFilter: TIME_FILTER.ALL_TIME,
  totalIncome: 0,
  totalExpense: 0,
  avgSpending: 0,
  incomeReport: [],
  expenseReport: [],
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
  },
  extraReducers: (builder) => {
    addAsyncThunkCases(builder, getDBReportData, 'isLoading', setReportData)
  },
})

export const reportAction = reportSlice.actions

export default reportSlice
