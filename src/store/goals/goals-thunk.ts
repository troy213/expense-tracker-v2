import { createAsyncThunk } from '@reduxjs/toolkit'
import { Goal, GoalHistoryEntry } from '@/types'
import dbServices from '@/lib/db'
import { savedAmount, deriveActiveStatus } from '@/lib/db/goals'

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
    return { goal: payload, savedAmount: 0 }
  }
)

/**
 * Edit a goal's editable fields. Fetches this goal's history from DB to
 * re-derive the active status — avoids reading stale history from Redux state.
 */
export const editDBGoal = createAsyncThunk(
  'goals/edit',
  async (payload: Goal) => {
    const isTerminal =
      payload.status === 'spent' || payload.status === 'cancelled'
    const history = await dbServices.goals.getHistoryByGoalId(payload.id)
    const saved = savedAmount(history)
    const goal: Goal = isTerminal
      ? payload
      : {
          ...payload,
          status: deriveActiveStatus(saved, payload.target_amount),
        }
    await dbServices.goals.putGoal(goal)
    return { goal, savedAmount: saved }
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
 * Add a contribution or withdrawal. Fetches this goal's existing history from
 * DB, appends the new entry in memory to compute nextSaved, then persists both.
 */
export const addDBHistory = createAsyncThunk(
  'goals/addHistory',
  async (payload: { goal: Goal; entry: GoalHistoryEntry }) => {
    const { goal, entry } = payload
    const existingHistory = await dbServices.goals.getHistoryByGoalId(goal.id)
    const nextSaved = savedAmount([...existingHistory, entry])
    const updatedGoal: Goal = {
      ...goal,
      status: deriveActiveStatus(nextSaved, goal.target_amount),
    }
    await dbServices.goals.putHistoryEntry(entry)
    await dbServices.goals.putGoal(updatedGoal)
    return { entry, goal: updatedGoal, savedAmount: nextSaved }
  }
)

/**
 * Spend a completed goal: flip to terminal 'spent' and record the linked tx.
 * Fetches history to keep savedAmount in sync for aggregate recalculation.
 */
export const spendDBGoal = createAsyncThunk(
  'goals/spend',
  async (payload: { goal: Goal; linkedTransactionId: string }) => {
    const history = await dbServices.goals.getHistoryByGoalId(payload.goal.id)
    const saved = savedAmount(history)
    const updated: Goal = {
      ...payload.goal,
      status: 'spent',
      linked_transaction_id: payload.linkedTransactionId,
    }
    await dbServices.goals.putGoal(updated)
    return { goal: updated, savedAmount: saved }
  }
)

export const cancelDBGoal = createAsyncThunk(
  'goals/cancel',
  async (goal: Goal) => {
    const history = await dbServices.goals.getHistoryByGoalId(goal.id)
    const saved = savedAmount(history)
    const updated: Goal = { ...goal, status: 'cancelled' }
    await dbServices.goals.putGoal(updated)
    return { goal: updated, savedAmount: saved }
  }
)

/**
 * Resume a cancelled goal: re-derive active status from DB history.
 */
export const resumeDBGoal = createAsyncThunk(
  'goals/resume',
  async (goal: Goal) => {
    const history = await dbServices.goals.getHistoryByGoalId(goal.id)
    const saved = savedAmount(history)
    const updated: Goal = {
      ...goal,
      status: deriveActiveStatus(saved, goal.target_amount),
    }
    await dbServices.goals.putGoal(updated)
    return { goal: updated, savedAmount: saved }
  }
)
