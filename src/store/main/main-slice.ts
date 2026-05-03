import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LOCALES, THEME } from '@/constants'
import { Data, Locales, SetStatePayload, Theme } from '@/types'
import { getStorage, setStateReducerValue } from '@/utils'
import { addData, deleteData, editData, searchData } from './main-actions'
import {
  addDBTransactions,
  deleteAllDBTransactions,
  deleteDBTransactions,
  editDBTransactions,
  searchDBTransactions,
} from './main-thunk'

export type InitialState = {
  theme: Theme
  selectedLocale: Locales
  searchValue: string
  hideBalance: boolean
  isLoading: boolean
  data: Data[]
}

const initialState: InitialState = {
  theme: (getStorage('theme') as Theme) ?? THEME.LIGHT,
  selectedLocale: (getStorage('locales') as Locales) ?? LOCALES.ENGLISH,
  searchValue: '',
  hideBalance: false,
  isLoading: true,
  data: [],
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
    builder.addCase(addDBTransactions.fulfilled, addData)
    builder.addCase(editDBTransactions.fulfilled, editData)
    builder.addCase(deleteDBTransactions.fulfilled, deleteData)
    builder.addCase(searchDBTransactions.fulfilled, searchData)
    builder.addCase(deleteAllDBTransactions.fulfilled, () => {
      return { ...initialState, isLoading: false }
    })
    builder
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state) => {
          state.isLoading = false
        }
      )
  },
})

export const mainAction = mainSlice.actions

export default mainSlice
