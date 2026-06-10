import { describe, it, expect } from 'vitest'
import { Goal, GoalHistoryEntry } from '@/types'
import { InitialState } from './goals-slice'
import {
  setGoals,
  addGoal,
  replaceGoal,
  removeGoal,
  addHistory,
} from './goals-actions'

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

const entry = (
  overrides: Partial<GoalHistoryEntry> = {}
): GoalHistoryEntry => ({
  id: 'e1',
  goal_id: 'g1',
  type: 'contribution',
  amount: 500_000,
  date: '2026-06-08',
  ...overrides,
})

const state = (overrides: Partial<InitialState> = {}): InitialState => ({
  isLoading: true,
  goals: [],
  savedAmounts: {},
  totalSaved: 0,
  totalTarget: 0,
  totalInactiveSaved: 0,
  totalInactiveTarget: 0,
  totalCompleted: 0,
  ...overrides,
})

describe('goals-actions', () => {
  it('setGoals replaces goals, computes savedAmounts and aggregates', () => {
    const s = state()
    setGoals(s, {
      type: '',
      payload: {
        goals: [goal()],
        history: [entry({ amount: 300_000 })],
      },
    })
    expect(s.goals).toHaveLength(1)
    expect(s.savedAmounts['g1']).toBe(300_000)
    expect(s.totalSaved).toBe(300_000)
    expect(s.totalTarget).toBe(1_000_000)
    expect(s.isLoading).toBe(false)
  })

  it('setGoals counts cancelled and completed goals into inactive / totalCompleted', () => {
    const s = state()
    setGoals(s, {
      type: '',
      payload: {
        goals: [
          goal({ id: 'a', status: 'cancelled', target_amount: 500_000 }),
          goal({ id: 'b', status: 'spent', target_amount: 200_000 }),
        ],
        history: [
          entry({ goal_id: 'a', amount: 100_000 }),
          entry({ goal_id: 'b', amount: 200_000 }),
        ],
      },
    })
    expect(s.totalInactiveSaved).toBe(100_000)
    expect(s.totalInactiveTarget).toBe(500_000)
    expect(s.totalCompleted).toBe(1)
  })

  it('addGoal appends to the list and updates aggregates', () => {
    const s = state({ goals: [goal({ id: 'a', target_amount: 1_000_000 })] })
    addGoal(s, {
      type: '',
      payload: {
        goal: goal({ id: 'b', target_amount: 500_000 }),
        savedAmount: 0,
      },
    })
    expect(s.goals.map((g) => g.id)).toEqual(['a', 'b'])
    expect(s.totalTarget).toBe(1_500_000)
  })

  it('replaceGoal swaps the matching goal and updates savedAmounts', () => {
    const s = state({
      goals: [goal({ id: 'a', status: 'in_progress' })],
      savedAmounts: { a: 500_000 },
    })
    replaceGoal(s, {
      type: '',
      payload: {
        goal: goal({ id: 'a', status: 'spent' }),
        savedAmount: 500_000,
      },
    })
    expect(s.goals[0].status).toBe('spent')
    expect(s.totalCompleted).toBe(1)
    expect(s.totalSaved).toBe(0)
  })

  it('removeGoal removes the goal and its savedAmount entry', () => {
    const s = state({
      goals: [goal({ id: 'a' }), goal({ id: 'b' })],
      savedAmounts: { a: 100_000, b: 200_000 },
    })
    removeGoal(s, { type: '', payload: 'a' })
    expect(s.goals.map((g) => g.id)).toEqual(['b'])
    expect(s.savedAmounts).not.toHaveProperty('a')
    expect(s.totalSaved).toBe(200_000)
  })

  it('addHistory replaces the goal and updates savedAmount', () => {
    const s = state({
      goals: [goal({ id: 'a', status: 'in_progress' })],
      savedAmounts: { a: 500_000 },
    })
    addHistory(s, {
      type: '',
      payload: {
        entry: entry({ id: 'e2', goal_id: 'a', amount: 800_000 }),
        goal: goal({ id: 'a', status: 'completed' }),
        savedAmount: 1_300_000,
      },
    })
    expect(s.goals[0].status).toBe('completed')
    expect(s.savedAmounts['a']).toBe(1_300_000)
  })
})
