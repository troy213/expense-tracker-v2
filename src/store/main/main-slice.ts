import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStatePayload } from '@/types'
import { setStateReducerValue } from '@/utils'
import { addAsyncThunkCases } from '../utils'
import { setDashboardInfo } from './main-actions'
import { getDBDashboardInfo } from './main-thunk'

export type InitialState = {
  isLoading: boolean
  totalIncome: number
  totalExpense: number
  totalBudget: number
  remainingBudget: number
}

const initialState: InitialState = {
  isLoading: true,
  totalIncome: 0,
  totalExpense: 0,
  totalBudget: 0,
  remainingBudget: 0,
}

const mainSlice = createSlice({
  name: 'main',
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
    addAsyncThunkCases(
      builder,
      getDBDashboardInfo,
      'isLoading',
      setDashboardInfo
    )
  },
})

export const mainAction = mainSlice.actions

export default mainSlice
