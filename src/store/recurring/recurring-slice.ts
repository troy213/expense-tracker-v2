import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Recurring, RecurringHistoryEntry, SetStatePayload } from '@/types'
import { addAsyncThunkCases, setStateReducerValue } from '../utils'
import {
  addRecurring,
  applyGenerated,
  removeRecurring,
  replaceRecurring,
  resolveHistory,
  setRecurringData,
} from './recurring-actions'
import {
  addDBRecurring,
  deleteDBRecurring,
  editDBRecurring,
  generateDBRecurring,
  getAllDBRecurring,
  resolveAddDBRecurring,
  resolveSkipDBRecurring,
} from './recurring-thunk'

export type InitialState = {
  isLoading: boolean
  recurring: Recurring[]
  history: RecurringHistoryEntry[]
}

export const initialState: InitialState = {
  isLoading: true,
  recurring: [],
  history: [],
}

const recurringSlice = createSlice({
  name: 'recurring',
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
    addAsyncThunkCases(
      builder,
      getAllDBRecurring,
      'isLoading',
      setRecurringData
    )
    addAsyncThunkCases(
      builder,
      generateDBRecurring,
      'isLoading',
      applyGenerated
    )
    addAsyncThunkCases(builder, addDBRecurring, 'isLoading', addRecurring)
    addAsyncThunkCases(builder, editDBRecurring, 'isLoading', replaceRecurring)
    addAsyncThunkCases(builder, deleteDBRecurring, 'isLoading', removeRecurring)
    addAsyncThunkCases(
      builder,
      resolveAddDBRecurring,
      'isLoading',
      resolveHistory
    )
    addAsyncThunkCases(
      builder,
      resolveSkipDBRecurring,
      'isLoading',
      resolveHistory
    )
  },
})

export const recurringAction = recurringSlice.actions

export default recurringSlice
