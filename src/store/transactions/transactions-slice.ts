import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data, SetStatePayload } from '@/types'
import { setStateReducerValue } from '@/utils'
import { addData, deleteData, editData } from './transactions-actions'
import {
  addDBTransactions,
  deleteAllDBTransactions,
  deleteDBTransactions,
  editDBTransactions,
} from './transactions-thunk'

export type InitialState = {
  isLoading: boolean
  data: Data[]
}

const initialState: InitialState = {
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
    builder.addCase(addDBTransactions.fulfilled, addData)
    builder.addCase(editDBTransactions.fulfilled, editData)
    builder.addCase(deleteDBTransactions.fulfilled, deleteData)
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

export const transactionsAction = transactionsSlice.actions

export default transactionsSlice
