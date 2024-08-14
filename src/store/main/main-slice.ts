import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data, SetStatePayload } from '@/types'
import { setStateReducerValue } from '@/utils'

type InitialState = {
  theme: 'light' | 'dark'
  data: Data[]
}

const initialState: InitialState = {
  theme: 'light',
  data: [],
}

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Data[]>) {
      state.data = action.payload
    },
    setState(
      state: InitialState,
      action: PayloadAction<SetStatePayload<InitialState>>
    ) {
      const { state: key, value } = action.payload

      setStateReducerValue(state, key, value)
    },

    resetState() {
      return initialState
    },
  },
})

export const mainAction = mainSlice.actions

export default mainSlice
