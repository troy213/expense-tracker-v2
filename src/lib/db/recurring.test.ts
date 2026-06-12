import { describe, it, expect } from 'vitest'
import { Recurring, RecurringHistoryEntry } from '@/types'
import {
  clampDueDate,
  computeRowsToGenerate,
  historyRowId,
  isExpired,
  nextPeriod,
  periodOf,
} from './recurring'

const definition = (overrides: Partial<Recurring> = {}): Recurring => ({
  id: 'r1',
  recurring_name: 'BCA Credit Card',
  transaction_name: 'Credit card payment',
  category_id: 'c1',
  amount: 500_000,
  due_day: 15,
  start_period: '2026-03',
  active_until: null,
  is_active: true,
  ...overrides,
})

const row = (
  period: string,
  status: RecurringHistoryEntry['status'] = 'added'
): RecurringHistoryEntry => ({
  id: historyRowId('r1', period),
  recurring_id: 'r1',
  date: clampDueDate(period, 15),
  category_id: 'c1',
  transaction_name: 'Credit card payment',
  amount: 500_000,
  status,
})

describe('periodOf / nextPeriod', () => {
  it('extracts the period from a date', () => {
    expect(periodOf('2026-06-15')).toBe('2026-06')
  })

  it('advances months and rolls over the year', () => {
    expect(nextPeriod('2026-06')).toBe('2026-07')
    expect(nextPeriod('2026-12')).toBe('2027-01')
  })
})

describe('clampDueDate', () => {
  it('uses the due day when the month has it', () => {
    expect(clampDueDate('2026-06', 15)).toBe('2026-06-15')
  })

  it('clamps 31 to the last day of short months', () => {
    expect(clampDueDate('2026-04', 31)).toBe('2026-04-30')
    expect(clampDueDate('2026-02', 31)).toBe('2026-02-28')
  })

  it('handles leap-year February', () => {
    expect(clampDueDate('2028-02', 30)).toBe('2028-02-29')
  })
})

describe('computeRowsToGenerate', () => {
  it('generates nothing for an inactive definition', () => {
    expect(
      computeRowsToGenerate(definition({ is_active: false }), [], '2026-06-20')
    ).toEqual([])
  })

  it('backfills every due month since start_period for a new definition (catch-up)', () => {
    const rows = computeRowsToGenerate(definition(), [], '2026-06-20')
    expect(rows.map((r) => r.id)).toEqual([
      'r1:2026-03',
      'r1:2026-04',
      'r1:2026-05',
      'r1:2026-06',
    ])
    expect(rows[0]).toMatchObject({
      recurring_id: 'r1',
      date: '2026-03-15',
      category_id: 'c1',
      transaction_name: 'Credit card payment',
      amount: 500_000,
      status: 'pending',
    })
  })

  it('skips the current month while its due date has not passed', () => {
    const rows = computeRowsToGenerate(definition(), [], '2026-06-12')
    expect(rows.map((r) => r.id)).toEqual([
      'r1:2026-03',
      'r1:2026-04',
      'r1:2026-05',
    ])
  })

  it('includes the current month on the due day itself', () => {
    const rows = computeRowsToGenerate(
      definition({ start_period: '2026-06' }),
      [],
      '2026-06-15'
    )
    expect(rows.map((r) => r.id)).toEqual(['r1:2026-06'])
  })

  it('resumes after the latest existing row, whatever its status', () => {
    const rows = computeRowsToGenerate(
      definition(),
      [row('2026-03'), row('2026-04', 'skipped')],
      '2026-06-20'
    )
    expect(rows.map((r) => r.id)).toEqual(['r1:2026-05', 'r1:2026-06'])
  })

  it('ignores rows belonging to other definitions', () => {
    const foreign = { ...row('2026-05'), id: 'r2:2026-05', recurring_id: 'r2' }
    const rows = computeRowsToGenerate(
      definition({ start_period: '2026-06' }),
      [foreign],
      '2026-06-20'
    )
    expect(rows.map((r) => r.id)).toEqual(['r1:2026-06'])
  })

  it('stops at active_until', () => {
    const rows = computeRowsToGenerate(
      definition({ active_until: '2026-04' }),
      [],
      '2026-06-20'
    )
    expect(rows.map((r) => r.id)).toEqual(['r1:2026-03', 'r1:2026-04'])
  })

  it('generates nothing when start_period is in the future', () => {
    expect(
      computeRowsToGenerate(
        definition({ start_period: '2026-07' }),
        [],
        '2026-06-20'
      )
    ).toEqual([])
  })
})

describe('isExpired', () => {
  it('is false while active_until is null or not yet passed', () => {
    expect(isExpired(definition(), '2026-06-20')).toBe(false)
    expect(
      isExpired(definition({ active_until: '2026-06' }), '2026-06-20')
    ).toBe(false)
  })

  it('is true once the current month is past active_until', () => {
    expect(
      isExpired(definition({ active_until: '2026-05' }), '2026-06-20')
    ).toBe(true)
  })
})
