import { PayloadAction } from '@reduxjs/toolkit'
import { Goal, GoalHistoryEntry } from '@/types'
import { InitialState } from './goals-slice'

function computeSavedAmounts(
  goals: Goal[],
  history: GoalHistoryEntry[]
): Record<string, number> {
  const amounts: Record<string, number> = {}
  goals.forEach((g) => {
    amounts[g.id] = 0
  })
  history.forEach((e) => {
    amounts[e.goal_id] =
      (amounts[e.goal_id] ?? 0) +
      (e.type === 'contribution' ? e.amount : -e.amount)
  })
  return amounts
}

function applyAggregates(state: InitialState) {
  let totalSaved = 0
  let totalTarget = 0
  let totalInactiveSaved = 0
  let totalInactiveTarget = 0
  let totalCompleted = 0
  state.goals.forEach((g) => {
    const s = state.savedAmounts[g.id] ?? 0
    if (g.status === 'in_progress' || g.status === 'completed') {
      totalSaved += s
      totalTarget += g.target_amount
    } else if (g.status === 'cancelled') {
      totalInactiveSaved += s
      totalInactiveTarget += g.target_amount
    } else if (g.status === 'spent') {
      totalCompleted++
    }
  })
  state.totalSaved = totalSaved
  state.totalTarget = totalTarget
  state.totalInactiveSaved = totalInactiveSaved
  state.totalInactiveTarget = totalInactiveTarget
  state.totalCompleted = totalCompleted
  state.isLoading = false
}

export const setGoals = (
  state: InitialState,
  action: PayloadAction<{ goals: Goal[]; history: GoalHistoryEntry[] }>
) => {
  const { goals, history } = action.payload
  state.goals = goals
  state.savedAmounts = computeSavedAmounts(goals, history)
  applyAggregates(state)
}

export const addGoal = (
  state: InitialState,
  action: PayloadAction<{ goal: Goal; savedAmount: number }>
) => {
  const { goal, savedAmount } = action.payload
  state.goals = [...state.goals, goal]
  state.savedAmounts = { ...state.savedAmounts, [goal.id]: savedAmount }
  applyAggregates(state)
}

export const replaceGoal = (
  state: InitialState,
  action: PayloadAction<{ goal: Goal; savedAmount: number }>
) => {
  const { goal, savedAmount } = action.payload
  state.goals = state.goals.map((g) => (g.id === goal.id ? goal : g))
  state.savedAmounts = { ...state.savedAmounts, [goal.id]: savedAmount }
  applyAggregates(state)
}

export const removeGoal = (
  state: InitialState,
  action: PayloadAction<string>
) => {
  const id = action.payload
  state.goals = state.goals.filter((g) => g.id !== id)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [id]: _removed, ...rest } = state.savedAmounts
  state.savedAmounts = rest
  applyAggregates(state)
}

export const addHistory = (
  state: InitialState,
  action: PayloadAction<{
    entry: GoalHistoryEntry
    goal: Goal
    savedAmount: number
  }>
) => {
  const { goal, savedAmount } = action.payload
  state.goals = state.goals.map((g) => (g.id === goal.id ? goal : g))
  state.savedAmounts = { ...state.savedAmounts, [goal.id]: savedAmount }
  applyAggregates(state)
}
