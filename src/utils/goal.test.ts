import { describe, it, expect, vi, afterEach } from 'vitest'
import { Goal } from '@/types'
import {
  goalProgress,
  goalPerDay,
  goalProgressFillClassName,
  goalDeleteMessageDescriptor,
  isActiveGoal,
} from './goal'

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

describe('goalProgress', () => {
  it('computes percent and clamps barFill to 100', () => {
    expect(goalProgress(500_000, 1_000_000)).toEqual({
      progressPercent: 50,
      barFill: 50,
    })
    const over = goalProgress(1_500_000, 1_000_000)
    expect(over.progressPercent).toBe(150)
    expect(over.barFill).toBe(100)
  })

  it('returns 0 for a non-positive target', () => {
    expect(goalProgress(100, 0)).toEqual({ progressPercent: 0, barFill: 0 })
  })
})

describe('goalPerDay', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns null when there is no deadline', () => {
    expect(goalPerDay(0, 1_000_000, null)).toBeNull()
  })

  it('returns null when nothing is left to save', () => {
    expect(goalPerDay(1_000_000, 1_000_000, '2026-12-31')).toBeNull()
  })

  it('divides the remaining amount across the days left', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-10T00:00:00Z'))
    // 10 days until deadline, 1,000,000 remaining → 100,000/day
    expect(goalPerDay(0, 1_000_000, '2026-06-20')).toBe(100_000)
  })
})

describe('goalProgressFillClassName', () => {
  it('adds the cancelled modifier for cancelled goals', () => {
    expect(goalProgressFillClassName('cancelled')).toContain(
      'progress-bar__fill--goal-cancelled'
    )
  })

  it('adds the success modifier for completed and spent goals', () => {
    expect(goalProgressFillClassName('completed')).toContain(
      'progress-bar__fill--goal-success'
    )
    expect(goalProgressFillClassName('spent')).toContain(
      'progress-bar__fill--goal-success'
    )
  })

  it('uses only the base class while in progress', () => {
    expect(goalProgressFillClassName('in_progress')).toBe(
      'progress-bar__fill--goal'
    )
  })
})

describe('isActiveGoal', () => {
  it('is true for in_progress and completed only', () => {
    expect(isActiveGoal('in_progress')).toBe(true)
    expect(isActiveGoal('completed')).toBe(true)
    expect(isActiveGoal('spent')).toBe(false)
    expect(isActiveGoal('cancelled')).toBe(false)
  })
})

describe('goalDeleteMessageDescriptor', () => {
  it('warns about the saved balance for non-spent goals with savings', () => {
    const d = goalDeleteMessageDescriptor(
      goal({ status: 'in_progress' }),
      500_000
    )
    expect(d.id).toBe('GoalDeleteWithBalance')
    expect(d.values).toHaveProperty('amount')
  })

  it('uses the plain message when nothing is saved', () => {
    const d = goalDeleteMessageDescriptor(goal(), 0)
    expect(d.id).toBe('DeleteDataSpecific')
    expect(d.values).toEqual({ name: 'Phone' })
  })

  it('uses the plain message for a spent goal even with a balance', () => {
    const d = goalDeleteMessageDescriptor(goal({ status: 'spent' }), 500_000)
    expect(d.id).toBe('DeleteDataSpecific')
  })
})
