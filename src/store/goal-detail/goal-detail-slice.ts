import { createSlice } from '@reduxjs/toolkit'
import { GoalHistoryEntry } from '@/types'
import { addAsyncThunkCases } from '../utils'
import { setGoalDetailData } from './goal-detail-actions'
import { getDBGoalDetail } from './goal-detail-thunk'

export type InitialState = {
  isLoading: boolean
  goalHistory: GoalHistoryEntry[]
  deadline: string | null
  totalSaved: number
  totalTarget: number
}

const initialState: InitialState = {
  isLoading: false,
  goalHistory: [],
  deadline: null,
  totalSaved: 0,
  totalTarget: 0,
}

const goalDetailSlice = createSlice({
  name: 'goalDetail',
  initialState,
  reducers: {
    resetDetail() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    addAsyncThunkCases(builder, getDBGoalDetail, 'isLoading', setGoalDetailData)
  },
})

export const goalDetailAction = goalDetailSlice.actions

export default goalDetailSlice
