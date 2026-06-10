import { PayloadAction } from '@reduxjs/toolkit'
import { GoalHistoryEntry } from '@/types'
import { InitialState } from './goal-detail-slice'

export const setGoalDetailData = (
  state: InitialState,
  action: PayloadAction<{
    goalHistory: GoalHistoryEntry[]
    deadline: string | null
    totalSaved: number
    totalTarget: number
  }>
) => {
  const { goalHistory, deadline, totalSaved, totalTarget } = action.payload
  state.goalHistory = goalHistory
  state.deadline = deadline
  state.totalSaved = totalSaved
  state.totalTarget = totalTarget
  state.isLoading = false
}
