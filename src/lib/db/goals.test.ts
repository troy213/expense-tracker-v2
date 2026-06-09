import { describe, it, expect } from 'vitest'
import { Goal, GoalHistoryEntry } from '@/types'
import {
  savedAmount,
  goalsLocked,
  deriveActiveStatus,
  computeTotalBalance,
} from './goals'

const entry = (
  type: GoalHistoryEntry['type'],
  amount: number
): GoalHistoryEntry => ({
  id: `${type}-${amount}`,
  goal_id: 'g1',
  type,
  amount,
  date: '2026-06-08',
})

const goal = (overrides: Partial<Goal> = {}): Goal => ({
  id: 'g1',
  name: 'Phone',
  target_amount: 1_000_000,
  deadline: null,
  category_id: 'c1',
  status: 'in_progress',
  created_at: '2026-06-01',
  ...overrides,
})

describe('savedAmount', () => {
  it('is zero with no history', () => {
    expect(savedAmount([])).toBe(0)
  })

  it('sums contributions minus withdrawals', () => {
    // 500k + 800k contributed, 300k withdrawn => 1,000k (Case 1)
    expect(
      savedAmount([
        entry('contribution', 500_000),
        entry('withdrawal', 300_000),
        entry('contribution', 800_000),
      ])
    ).toBe(1_000_000)
  })

  it('can exceed the target (over-goal, Case 4)', () => {
    expect(savedAmount([entry('contribution', 1_500_000)])).toBe(1_500_000)
  })
})

// goalsLocked takes the flat history array (matching Redux state) and attributes
// each entry to its goal by goal_id.
const forGoal = (
  goalId: string,
  type: GoalHistoryEntry['type'],
  amount: number
): GoalHistoryEntry => ({ ...entry(type, amount), goal_id: goalId })

describe('goalsLocked', () => {
  it('sums saved only for in_progress and completed goals', () => {
    const goals = [
      goal({ id: 'a', status: 'in_progress' }),
      goal({ id: 'b', status: 'completed' }),
      goal({ id: 'c', status: 'spent' }),
      goal({ id: 'd', status: 'cancelled' }),
    ]
    const history = [
      forGoal('a', 'contribution', 200_000),
      forGoal('b', 'contribution', 1_000_000),
      forGoal('c', 'contribution', 1_500_000), // spent => excluded
      forGoal('d', 'contribution', 400_000), // cancelled => excluded
    ]
    expect(goalsLocked(goals, history)).toBe(1_200_000)
  })

  it('is zero when every goal is terminal or empty', () => {
    const goals = [goal({ id: 'c', status: 'spent' })]
    expect(goalsLocked(goals, [forGoal('c', 'contribution', 999)])).toBe(0)
  })

  it('treats a goal with no history rows as zero saved', () => {
    const goals = [goal({ id: 'a', status: 'in_progress' })]
    expect(goalsLocked(goals, [])).toBe(0)
  })
})

describe('deriveActiveStatus', () => {
  it('is completed when saved meets or exceeds target', () => {
    expect(deriveActiveStatus(1_000_000, 1_000_000)).toBe('completed')
    expect(deriveActiveStatus(1_500_000, 1_000_000)).toBe('completed')
  })

  it('is in_progress when saved is below target', () => {
    expect(deriveActiveStatus(200_000, 1_000_000)).toBe('in_progress')
  })
})

describe('computeTotalBalance', () => {
  it('subtracts money locked in active goals from income minus expense', () => {
    const goals = [goal({ id: 'a', status: 'in_progress' })]
    const history = [forGoal('a', 'contribution', 300_000)]
    // 2,000,000 − 500,000 − 300,000 = 1,200,000
    expect(computeTotalBalance(2_000_000, 500_000, goals, history)).toBe(
      1_200_000
    )
  })

  it('does not subtract for spent or cancelled goals', () => {
    const goals = [goal({ id: 'a', status: 'spent' })]
    const history = [forGoal('a', 'contribution', 300_000)]
    // spent goal excluded by goalsLocked => 1,000,000 − 0 − 0
    expect(computeTotalBalance(1_000_000, 0, goals, history)).toBe(1_000_000)
  })
})
