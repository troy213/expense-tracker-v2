import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Goal, SetStatePayload } from '@/types'
import { addAsyncThunkCases, setStateReducerValue } from '../utils'
import {
  addGoal,
  addHistory,
  removeGoal,
  replaceGoal,
  setGoals,
} from './goals-actions'
import {
  addDBGoal,
  addDBHistory,
  cancelDBGoal,
  deleteDBGoal,
  editDBGoal,
  getAllDBGoals,
  resumeDBGoal,
  spendDBGoal,
} from './goals-thunk'

export type InitialState = {
  isLoading: boolean
  goals: Goal[]
  savedAmounts: Record<string, number>
  totalSaved: number
  totalTarget: number
  totalInactiveSaved: number
  totalInactiveTarget: number
  totalCompleted: number
}

export const initialState: InitialState = {
  isLoading: true,
  goals: [],
  savedAmounts: {},
  totalSaved: 0,
  totalTarget: 0,
  totalInactiveSaved: 0,
  totalInactiveTarget: 0,
  totalCompleted: 0,
}

const goalsSlice = createSlice({
  name: 'goals',
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
    addAsyncThunkCases(builder, getAllDBGoals, 'isLoading', setGoals)
    addAsyncThunkCases(builder, addDBGoal, 'isLoading', addGoal)
    addAsyncThunkCases(builder, editDBGoal, 'isLoading', replaceGoal)
    addAsyncThunkCases(builder, deleteDBGoal, 'isLoading', removeGoal)
    addAsyncThunkCases(builder, addDBHistory, 'isLoading', addHistory)
    addAsyncThunkCases(builder, spendDBGoal, 'isLoading', replaceGoal)
    addAsyncThunkCases(builder, cancelDBGoal, 'isLoading', replaceGoal)
    addAsyncThunkCases(builder, resumeDBGoal, 'isLoading', replaceGoal)
  },
})

export const goalsAction = goalsSlice.actions

export default goalsSlice
