import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  Data,
  Locales,
  SetStatePayload,
  Theme,
  TransactionForm,
  TxDetailsForm,
} from '@/types'
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
  hideBalance: boolean
  data: Data[]
}

const initialState: InitialState = {
  theme: (getStorage('theme') as Theme) ?? THEME.LIGHT,
  selectedLocale: (getStorage('locales') as Locales) ?? LOCALES.ENGLISH,
  searchValue: '',
  hideBalance: false,
  data: [],
}

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setData(
      state,
      action: PayloadAction<{
        data: TransactionForm
        transactionDetails: TxDetailsForm[]
        indexes: { dataIndex: number; subdataIndex: number } | undefined
      }>
    ) {
      const { data, transactionDetails, indexes } = action.payload

      const storedData = getStorage('data')
      const transactionsData = storedData
        ? (JSON.parse(storedData) as Data[])
        : []
      const existingTxIndex = transactionsData.findIndex(
        (txData) => txData.date === data.date
      )
      const transactionIsExist = existingTxIndex >= 0
      const isEditForm = indexes !== undefined

      let newData: Data[] | null = null

      if (isEditForm) {
        const { dataIndex, subdataIndex } = indexes
        const isSameDate = transactionsData[dataIndex].date === data.date
        const newSubdata = {
          id: transactionsData[dataIndex].subdata[subdataIndex].id,
          type: data.type,
          category: data.category,
          item: transactionDetails,
        }

        // If transaction is exist and editing the same date
        if (isSameDate) {
          const newTransactionsData = structuredClone(transactionsData)
          newTransactionsData[dataIndex].subdata[subdataIndex] = newSubdata

          newData = newTransactionsData

          // If Transaction is exist but not different date
        } else if (transactionIsExist) {
          const newTransactionsData = structuredClone(transactionsData)
          newTransactionsData[existingTxIndex].subdata.push(newSubdata)

          // Remove old item from the subdata
          if (newTransactionsData[dataIndex].subdata.length === 1) {
            newTransactionsData.splice(dataIndex, 1)
          } else {
            newTransactionsData[dataIndex].subdata.splice(subdataIndex, 1)
          }

          newData = newTransactionsData

          // If transaction doesn't exist on any date, create a new one
        } else {
          const newTransaction = {
            id: crypto.randomUUID() as string,
            date: data.date,
            subdata: [newSubdata],
          }
          const newTransactionsData = structuredClone(transactionsData)

          if (newTransactionsData[dataIndex].subdata.length === 1) {
            newTransactionsData.splice(dataIndex, 1)
          } else {
            newTransactionsData[dataIndex].subdata.splice(subdataIndex, 1)
          }

          newTransactionsData.push(newTransaction)
          newTransactionsData.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )

          newData = newTransactionsData
        }
      } else {
        const newSubdata = {
          id: crypto.randomUUID() as string,
          type: data.type,
          category: data.category,
          item: transactionDetails,
        }

        // If transaction is exist, update the subdata
        if (transactionIsExist) {
          const newTransaction = { ...transactionsData[existingTxIndex] }
          newTransaction.subdata = [...newTransaction.subdata, newSubdata]

          const newTransactionsData = [...transactionsData]
          newTransactionsData[existingTxIndex] = newTransaction

          newData = newTransactionsData

          // If transaction doesn't exist on any date, create a new one
        } else {
          const newTransaction = {
            id: crypto.randomUUID() as string,
            date: data.date,
            subdata: [newSubdata],
          }
          const newTransactionsData = [...transactionsData]
          newTransactionsData.push(newTransaction)
          newTransactionsData.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )

          newData = newTransactionsData
        }
      }

      if (state.searchValue) {
        const filteredData = searchSubdata(newData, state.searchValue)
        state.data = filteredData
      } else {
        state.data = newData
      }

      setStorage('data', newData)
    },
    deleteTransaction(state, action: PayloadAction<{ subdataId: string }>) {
      const storedData = getStorage('data')
      const transactionsData = storedData
        ? (JSON.parse(storedData) as Data[])
        : []

      const newData = transactionsData
        .map((item) => ({
          ...item,
          subdata: item.subdata.filter(
            (sub) => sub.id !== action.payload.subdataId
          ),
        }))
        .filter((item) => item.subdata.length > 0)

      if (state.searchValue) {
        const filteredData = searchSubdata(newData, state.searchValue)
        state.data = filteredData
      } else {
        state.data = newData
      }

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
