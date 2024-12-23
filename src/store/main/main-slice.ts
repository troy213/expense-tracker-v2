import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data, Locales, SetStatePayload, Theme } from '@/types'
import { setStateReducerValue, setStorage } from '@/utils'
import { LOCALES, THEME } from '@/constants'

type InitialState = {
  theme: Theme
  selectedLocale: Locales
  data: Data[]
  totalIncome: number
  totalExpense: number
  totalBalance: number
}

const initialState: InitialState = {
  theme: THEME.LIGHT,
  selectedLocale: LOCALES.ENGLISH,
  data: [],
  totalIncome: 0,
  totalExpense: 0,
  totalBalance: 0,
}

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Data[]>) {
      state.data = action.payload
      setStorage('data', action.payload)
      mainSlice.caseReducers.updateTotal(state)
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
    updateTotal(state) {
      const { totalIncome, totalExpense } = state.data.reduce(
        (total, currData) => {
          currData.subdata.forEach((sub) => {
            const itemTotal = sub.item.reduce((sum, i) => sum + i.amount, 0)
            if (sub.type === 'income') {
              console.log('income')
              total.totalIncome += itemTotal
            } else if (sub.type === 'expense') {
              total.totalExpense += itemTotal
            }
          })
          return total
        },
        { totalIncome: 0, totalExpense: 0 }
      )
      const totalBalance = totalIncome - totalExpense
      state.totalIncome = totalIncome
      state.totalExpense = totalExpense
      state.totalBalance = totalBalance
      setStorage('totalIncome', totalIncome)
      setStorage('totalExpense', totalExpense)
      setStorage('totalBalance', totalBalance)
    },
  },
})

export const mainAction = mainSlice.actions

export default mainSlice
