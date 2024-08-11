import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data, SetStatePayload } from '@/types'

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
    setState<K extends keyof InitialState>(
      state: InitialState,
      action: PayloadAction<SetStatePayload<InitialState, K>>
    ) {
      const { state: key, value } = action.payload

      state[key] = value as InitialState[K]
    },

    resetState() {
      return initialState
    },
  },
})

export const mainAction = mainSlice.actions

export default mainSlice
