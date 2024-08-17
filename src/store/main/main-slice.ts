import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data, Locales, SetStatePayload, Theme } from '@/types'
import { setStateReducerValue } from '@/utils'
import { LOCALES, THEME } from '@/constants'

type InitialState = {
  theme: Theme
  selectedLocale: Locales
  data: Data[]
}

const initialState: InitialState = {
  theme: THEME.LIGHT,
  selectedLocale: LOCALES.ENGLISH,
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
