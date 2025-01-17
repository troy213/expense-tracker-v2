import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data, Locales, SetStatePayload, Theme } from '@/types'
import {
  getStorage,
  searchSubdata,
  setStateReducerValue,
  setStorage,
} from '@/utils'
import { LOCALES, THEME } from '@/constants'

type InitialState = {
  theme: Theme
  selectedLocale: Locales
  searchValue: string
  data: Data[]
}

const initialState: InitialState = {
  theme: (getStorage('theme') as Theme) ?? THEME.LIGHT,
  selectedLocale: (getStorage('locales') as Locales) ?? LOCALES.ENGLISH,
  searchValue: '',
  data: [],
}

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Data[]>) {
      state.data = action.payload
      setStorage('data', action.payload)
    },
    deleteTransaction(state, action: PayloadAction<{ subdataId: string }>) {
      const newData = state.data
        .map((item) => ({
          ...item,
          subdata: item.subdata.filter(
            (sub) => sub.id !== action.payload.subdataId
          ),
        }))
        .filter((item) => item.subdata.length > 0)

      state.data = newData
      setStorage('data', newData)
    },
    searchData(state, action: PayloadAction<{ searchValue: string }>) {
      const { searchValue } = action.payload

      if (searchValue) {
        const storedData = getStorage('data')
        const parsedData = storedData ? JSON.parse(storedData) : []
        const newData = searchSubdata(parsedData, action.payload.searchValue)

        state.searchValue = searchValue
        state.data = newData
      } else {
        const storedData = getStorage('data')
        const newData = storedData ? JSON.parse(storedData) : []

        state.searchValue = ''
        state.data = newData
      }
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
