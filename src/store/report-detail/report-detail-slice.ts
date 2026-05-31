import { createSlice } from '@reduxjs/toolkit'
import { Category, Data } from '@/types'
import { addAsyncThunkCases } from '../utils'
import { setDetailData } from './report-detail-actions'
import { getDBReportDetail } from './report-detail-thunk'

export type InitialState = {
  isLoading: boolean
  data: Data[]
  selectedDetailCategory: Category | null
  totalIncome: number
  totalExpense: number
  totalBudget: number
  remainingBudget: number
}

const initialState: InitialState = {
  isLoading: false,
  data: [],
  selectedDetailCategory: null,
  totalIncome: 0,
  totalExpense: 0,
  totalBudget: 0,
  remainingBudget: 0,
}

const reportDetailSlice = createSlice({
  name: 'reportDetail',
  initialState,
  reducers: {
    resetDetail() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    addAsyncThunkCases(builder, getDBReportDetail, 'isLoading', setDetailData)
  },
})

export const reportDetailAction = reportDetailSlice.actions

export default reportDetailSlice
