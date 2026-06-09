import { Goal, GoalHistoryEntry } from '@/types'
import { getDB } from './connection'

/**
 * Pure helper: a goal's currently saved amount, derived from its history.
 * `Σ contributions − Σ withdrawals`. Can exceed the target (progress > 100%).
 */
export const savedAmount = (history: GoalHistoryEntry[]): number =>
  history.reduce(
    (sum, entry) =>
      entry.type === 'contribution' ? sum + entry.amount : sum - entry.amount,
    0
  )

/**
 * Pure helper: total money locked away in goals, summed only over goals whose
 * status still affects the balance (in_progress / completed). Spent and
 * cancelled goals are excluded — the status is what gates the balance.
 * Takes the flat history array (matching Redux state) and attributes each entry
 * to its goal by `goal_id`.
 */
export const goalsLocked = (
  goals: Goal[],
  history: GoalHistoryEntry[]
): number =>
  goals.reduce((sum, goal) => {
    if (goal.status !== 'in_progress' && goal.status !== 'completed') return sum
    const goalHistory = history.filter((entry) => entry.goal_id === goal.id)
    return sum + savedAmount(goalHistory)
  }, 0)

/**
 * Pure helper: the non-terminal status implied by progress. Used when adding
 * history, editing the target, or resuming — never overrides spent/cancelled.
 */
export const deriveActiveStatus = (
  saved: number,
  target: number
): 'in_progress' | 'completed' =>
  saved >= target ? 'completed' : 'in_progress'

/**
 * Pure helper: the Dashboard's lifetime balance with goal-locked money removed.
 * `(totalIncome − totalExpense) − goalsLocked`. Spent/cancelled goals are
 * already excluded by `goalsLocked`. Dashboard balance site only — Reports stay
 * pure.
 */
export const computeTotalBalance = (
  totalIncome: number,
  totalExpense: number,
  goals: Goal[],
  history: GoalHistoryEntry[]
): number => totalIncome - totalExpense - goalsLocked(goals, history)

// ============================================================================
// DB SERVICE WRAPPERS (thin IndexedDB adapters — covered by the setup mock)
// ============================================================================

/**
 * Get all goals
 */
async function getAllGoals(): Promise<Goal[]> {
  const database = await getDB()
  return database.getAll('goals')
}

/**
 * Get all goal-history entries (flat, across every goal)
 */
async function getAllHistory(): Promise<GoalHistoryEntry[]> {
  const database = await getDB()
  return database.getAll('goal_history')
}

/**
 * Add or update a goal
 */
async function putGoal(goal: Goal): Promise<string> {
  const database = await getDB()
  return database.put('goals', goal)
}

/**
 * Add a goal-history entry (contribution or withdrawal)
 */
async function putHistoryEntry(entry: GoalHistoryEntry): Promise<string> {
  const database = await getDB()
  return database.put('goal_history', entry)
}

/**
 * Delete a goal and cascade-delete its history rows in one transaction, so no
 * orphan entries are left behind.
 */
async function deleteGoal(id: string): Promise<void> {
  const database = await getDB()
  const tx = database.transaction(['goals', 'goal_history'], 'readwrite')

  await tx.objectStore('goals').delete(id)

  const historyStore = tx.objectStore('goal_history')
  const index = historyStore.index('by-goal')
  let cursor = await index.openCursor(id)
  while (cursor) {
    await cursor.delete()
    cursor = await cursor.continue()
  }

  await tx.done
}

/**
 * Clear all goals and history
 */
async function clearGoals(): Promise<void> {
  const database = await getDB()
  await database.clear('goals')
  await database.clear('goal_history')
}

const goalsServices = {
  getAllGoals,
  getAllHistory,
  putGoal,
  putHistoryEntry,
  deleteGoal,
  clearGoals,
}

export default goalsServices
