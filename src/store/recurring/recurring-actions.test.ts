import { describe, it, expect } from 'vitest'
import { PayloadAction } from '@reduxjs/toolkit'
import { Recurring, RecurringHistoryEntry } from '@/types'
import { initialState, InitialState } from './recurring-slice'
import { applyGenerated, resolveHistory } from './recurring-actions'

const definition = (overrides: Partial<Recurring> = {}): Recurring => ({
  id: 'r1',
  recurring_name: 'Netflix',
  transaction_name: 'Netflix subscription',
  category_id: 'c1',
  amount: 186_000,
  due_day: 15,
  start_period: '2026-05',
  active_until: null,
  is_active: true,
  ...overrides,
})

const pendingRow = (period: string): RecurringHistoryEntry => ({
  id: `r1:${period}`,
  recurring_id: 'r1',
  date: `${period}-15`,
  category_id: 'c1',
  transaction_name: 'Netflix subscription',
  amount: 186_000,
  status: 'pending',
})

const freshState = (): InitialState => ({
  ...initialState,
  recurring: [definition()],
  history: [pendingRow('2026-05')],
})

const action = <T>(payload: T): PayloadAction<T> => ({
  type: 'test',
  payload,
})

describe('applyGenerated', () => {
  it('appends new rows and replaces deactivated definitions', () => {
    const state = freshState()
    const deactivated = definition({ is_active: false })
    applyGenerated(
      state,
      action({ rows: [pendingRow('2026-06')], deactivated: [deactivated] })
    )
    expect(state.history.map((r) => r.id)).toEqual(['r1:2026-05', 'r1:2026-06'])
    expect(state.recurring[0].is_active).toBe(false)
  })

  it('upserts by id instead of duplicating', () => {
    const state = freshState()
    applyGenerated(
      state,
      action({ rows: [pendingRow('2026-05')], deactivated: [] })
    )
    expect(state.history).toHaveLength(1)
  })
})

describe('resolveHistory', () => {
  it('replaces the row with its resolved version', () => {
    const state = freshState()
    const resolved: RecurringHistoryEntry = {
      ...pendingRow('2026-05'),
      status: 'added',
      amount: 200_000,
    }
    resolveHistory(state, action({ row: resolved }))
    expect(state.history).toHaveLength(1)
    expect(state.history[0]).toMatchObject({ status: 'added', amount: 200_000 })
  })
})
