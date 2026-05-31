import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LOCALES, THEME } from '@/constants'
import { Locales, Theme } from '@/types'
import { getStorage, getStorageConfig, setStorage } from '@/utils'

export type InitialState = {
  theme: Theme
  locale: Locales
  hideBalance: boolean
}

const initialState: InitialState = {
  theme: (getStorage('theme') as Theme) ?? THEME.LIGHT,
  locale: (getStorage('locales') as Locales) ?? LOCALES.ENGLISH,
  hideBalance: getStorageConfig()?.hideBalance ?? false,
}

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      setStorage('theme', action.payload)
    },
    setLocale(state, action: PayloadAction<Locales>) {
      state.locale = action.payload
      setStorage('locales', action.payload)
    },
    // Ephemeral eye-toggle on the dashboard. NOT persisted.
    toggleHideBalance(state) {
      state.hideBalance = !state.hideBalance
    },
    // Persisted startup default set from AdvancedSetting. Updates live state and
    // writes the config blob in localStorage (the blob holds only hideBalance).
    setHideBalanceDefault(state, action: PayloadAction<boolean>) {
      state.hideBalance = action.payload
      setStorage('config', JSON.stringify({ hideBalance: action.payload }))
    },
  },
})

export const configAction = configSlice.actions

export default configSlice
