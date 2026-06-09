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
  history: [],
  ...overrides,
})

describe('goals-actions', () => {
  it('setGoals replaces goals + history and clears loading', () => {
    const s = state()
    setGoals(s, {
      type: '',
      payload: { goals: [goal()], history: [entry()] },
    })
    expect(s.goals).toHaveLength(1)
    expect(s.history).toHaveLength(1)
    expect(s.isLoading).toBe(false)
  })

  it('addGoal appends to the list', () => {
    const s = state({ goals: [goal({ id: 'a' })] })
    addGoal(s, { type: '', payload: goal({ id: 'b' }) })
    expect(s.goals.map((g) => g.id)).toEqual(['a', 'b'])
  })

  it('replaceGoal swaps the matching goal by id', () => {
    const s = state({ goals: [goal({ id: 'a', status: 'in_progress' })] })
    replaceGoal(s, { type: '', payload: goal({ id: 'a', status: 'spent' }) })
    expect(s.goals[0].status).toBe('spent')
  })

  it('removeGoal deletes the goal and cascade-removes its history', () => {
    const s = state({
      goals: [goal({ id: 'a' }), goal({ id: 'b' })],
      history: [
        entry({ id: 'e1', goal_id: 'a' }),
        entry({ id: 'e2', goal_id: 'b' }),
        entry({ id: 'e3', goal_id: 'a' }),
      ],
    })
    removeGoal(s, { type: '', payload: 'a' })
    expect(s.goals.map((g) => g.id)).toEqual(['b'])
    expect(s.history.map((h) => h.id)).toEqual(['e2'])
  })

  it('addHistory appends the entry and replaces the recomputed goal', () => {
    const s = state({
      goals: [goal({ id: 'a', status: 'in_progress' })],
      history: [entry({ id: 'e1', goal_id: 'a' })],
    })
    addHistory(s, {
      type: '',
      payload: {
        entry: entry({ id: 'e2', goal_id: 'a', amount: 800_000 }),
        goal: goal({ id: 'a', status: 'completed' }),
      },
    })
    expect(s.history.map((h) => h.id)).toEqual(['e1', 'e2'])
    expect(s.goals[0].status).toBe('completed')
  })
})
