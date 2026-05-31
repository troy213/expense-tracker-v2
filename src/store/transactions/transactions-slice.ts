import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data, SetStatePayload } from '@/types'
import { addAsyncThunkCases, setStateReducerValue } from '../utils'
import {
  addData,
  deleteAllTransactions,
  deleteData,
  editData,
  getAllData,
} from './transactions-actions'
import {
  addDBTransactions,
  deleteAllDBTransactions,
  deleteDBTransactions,
  editDBTransactions,
  getAllDBTransactions,
} from './transactions-thunk'

export type InitialState = {
  isLoading: boolean
  data: Data[]
}

export const initialState: InitialState = {
  isLoading: true,
  data: [],
}

const transactionsSlice = createSlice({
  name: 'transactions',
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
    addAsyncThunkCases(builder, getAllDBTransactions, 'isLoading', getAllData)
    addAsyncThunkCases(builder, addDBTransactions, 'isLoading', addData)
    addAsyncThunkCases(builder, editDBTransactions, 'isLoading', editData)
    addAsyncThunkCases(builder, deleteDBTransactions, 'isLoading', deleteData)
    addAsyncThunkCases(
      builder,
      deleteAllDBTransactions,
      'isLoading',
      deleteAllTransactions
    )
  },
})

export const transactionsAction = transactionsSlice.actions

export default transactionsSlice
