import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStatePayload } from '@/types'
import { DATE_RANGE } from '@/constants'
import { setStateReducerValue } from '@/utils'

export type InitialState = {
  isLoading: boolean
  customRange: { from: string; to: string } | null
  dateRange: number
}

const initialState: InitialState = {
  isLoading: true,
  customRange: null,
  dateRange: DATE_RANGE.ALL_TIME,
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
})

export const reportAction = reportSlice.actions

export default reportSlice
