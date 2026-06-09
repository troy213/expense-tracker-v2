import { PayloadAction } from '@reduxjs/toolkit'
import { Goal, GoalHistoryEntry } from '@/types'
import { InitialState } from './goals-slice'

export const setGoals = (
  state: InitialState,
  action: PayloadAction<{ goals: Goal[]; history: GoalHistoryEntry[] }>
) => {
  state.goals = action.payload.goals
  state.history = action.payload.history
  state.isLoading = false
}

export const addGoal = (state: InitialState, action: PayloadAction<Goal>) => {
  state.goals = [...state.goals, action.payload]
  state.isLoading = false
}

export const replaceGoal = (
  state: InitialState,
  action: PayloadAction<Goal>
) => {
  state.goals = state.goals.map((goal) =>
    goal.id === action.payload.id ? action.payload : goal
  )
  state.isLoading = false
}

export const removeGoal = (
  state: InitialState,
  action: PayloadAction<string>
) => {
  const id = action.payload
  state.goals = state.goals.filter((goal) => goal.id !== id)
  state.history = state.history.filter((entry) => entry.goal_id !== id)
  state.isLoading = false
}

export const addHistory = (
  state: InitialState,
  action: PayloadAction<{ entry: GoalHistoryEntry; goal: Goal }>
) => {
  const { entry, goal } = action.payload
  state.history = [...state.history, entry]
  state.goals = state.goals.map((g) => (g.id === goal.id ? goal : g))
  state.isLoading = false
}
