import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data, Lang, SetStatePayload, Theme } from '@/types'
import { setStateReducerValue } from '@/utils'

type InitialState = {
  theme: Theme
  lang: Lang
  data: Data[]
}

const initialState: InitialState = {
  theme: 'light',
  lang: 'en-US',
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
