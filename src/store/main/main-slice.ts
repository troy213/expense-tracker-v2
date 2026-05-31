import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SetStatePayload } from '@/types'
import { setStateReducerValue } from '@/utils'

export type InitialState = Record<string, never>

const initialState: InitialState = {}

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
      return { ...initialState }
    },
  },
})

export const mainAction = mainSlice.actions

export default mainSlice
