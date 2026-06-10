import { createAsyncThunk } from '@reduxjs/toolkit'
import dbServices from '@/lib/db'
import { savedAmount } from '@/lib/db/goals'

export const getDBGoalDetail = createAsyncThunk(
  'goalDetail/get',
  async (goalId: string) => {
    const [goal, history] = await Promise.all([
      dbServices.goals.getGoalById(goalId),
      dbServices.goals.getHistoryByGoalId(goalId),
    ])
    return {
      goalHistory: history,
      deadline: goal?.deadline ?? null,
      totalSaved: savedAmount(history),
      totalTarget: goal?.target_amount ?? 0,
    }
  }
)
