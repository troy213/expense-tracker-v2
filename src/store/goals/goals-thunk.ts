import { createAsyncThunk } from '@reduxjs/toolkit'
import { Goal, GoalHistoryEntry } from '@/types'
import dbServices from '@/lib/db'
import { savedAmount, deriveActiveStatus } from '@/lib/db/goals'
import type { RootState } from '..'

export const getAllDBGoals = createAsyncThunk('goals/getAll', async () => {
  const [goals, history] = await Promise.all([
    dbServices.goals.getAllGoals(),
    dbServices.goals.getAllHistory(),
  ])
  return { goals, history }
})

export const addDBGoal = createAsyncThunk(
  'goals/add',
  async (payload: Goal) => {
    await dbServices.goals.putGoal(payload)
    return payload
  }
)

/**
 * Edit a goal's editable fields (name/target/deadline/category). Because the
 * target can change, re-derive the active status from the existing saved amount
 * — unless the goal is terminal (spent/cancelled), which never auto-flips.
 */
export const editDBGoal = createAsyncThunk(
  'goals/edit',
  async (payload: Goal, { getState }) => {
    const { history } = (getState() as RootState).goalsReducer
    const isTerminal =
      payload.status === 'spent' || payload.status === 'cancelled'

    const goal: Goal = isTerminal
      ? payload
      : {
          ...payload,
          status: deriveActiveStatus(
            savedAmount(history.filter((e) => e.goal_id === payload.id)),
            payload.target_amount
          ),
        }

    await dbServices.goals.putGoal(goal)
    return goal
  }
)

export const deleteDBGoal = createAsyncThunk(
  'goals/delete',
  async (id: string) => {
    await dbServices.goals.deleteGoal(id)
    return id
  }
)

/**
 * Add a contribution or withdrawal, then re-derive the goal's active status from
 * the new saved amount (auto-complete at 100%, auto-revert below).
 */
export const addDBHistory = createAsyncThunk(
  'goals/addHistory',
  async (
    payload: {
      goal: Goal
      entry: GoalHistoryEntry
    },
    { getState }
  ) => {
    const { goal, entry } = payload
    const { history } = (getState() as RootState).goalsReducer

    const nextSaved = savedAmount([
      ...history.filter((e) => e.goal_id === goal.id),
      entry,
    ])
    const updatedGoal: Goal = {
      ...goal,
      status: deriveActiveStatus(nextSaved, goal.target_amount),
    }

    await dbServices.goals.putHistoryEntry(entry)
    await dbServices.goals.putGoal(updatedGoal)

    return { entry, goal: updatedGoal }
  }
)

/**
 * Spend a completed goal: the real transaction is created separately (UI
 * dispatches addDBTransactions); here we only flip the goal to terminal `spent`
 * and store the link so the user can jump to the transaction.
 */
export const spendDBGoal = createAsyncThunk(
  'goals/spend',
  async (payload: { goal: Goal; linkedTransactionId: string }) => {
    const updated: Goal = {
      ...payload.goal,
      status: 'spent',
      linked_transaction_id: payload.linkedTransactionId,
    }
    await dbServices.goals.putGoal(updated)
    return updated
  }
)

export const cancelDBGoal = createAsyncThunk(
  'goals/cancel',
  async (goal: Goal) => {
    const updated: Goal = { ...goal, status: 'cancelled' }
    await dbServices.goals.putGoal(updated)
    return updated
  }
)

/**
 * Resume a cancelled goal: re-lock its intact saved amount by recomputing the
 * active status from history.
 */
export const resumeDBGoal = createAsyncThunk(
  'goals/resume',
  async (goal: Goal, { getState }) => {
    const { history } = (getState() as RootState).goalsReducer
    const updated: Goal = {
      ...goal,
      status: deriveActiveStatus(
        savedAmount(history.filter((e) => e.goal_id === goal.id)),
        goal.target_amount
      ),
    }
    await dbServices.goals.putGoal(updated)
    return updated
  }
)
