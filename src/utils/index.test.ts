import { describe, it, expect, afterEach, vi } from 'vitest'
import {
  getMonthKey,
  formatMonthLabel,
  shouldShowMonthHeader,
  getDateRangeForFilter,
  filterTransactions,
  buildReportDetailQuery,
} from './index'
import { TIME_FILTER } from '@/constants'
import type { Category, Transaction } from '@/types'

describe('getMonthKey', () => {
  it('returns the YYYY-MM prefix of a date string', () => {
    expect(getMonthKey('2026-05-23')).toBe('2026-05')
  })
})

describe('formatMonthLabel', () => {
  it('returns the full month name without the year', () => {
    expect(formatMonthLabel('2026-05-23')).toBe('May')
  })

  it('handles a year-boundary date correctly', () => {
    expect(formatMonthLabel('2025-12-31')).toBe('December')
    expect(formatMonthLabel('2026-01-01')).toBe('January')
  })

  it('is timezone-safe for the first day of a month', () => {
    // Parsed from the numeric parts (local midnight), so it never slips to the
    // previous month the way `new Date('2026-05-01')` (UTC midnight) could.
    expect(formatMonthLabel('2026-05-01')).toBe('May')
  })
})

describe('shouldShowMonthHeader', () => {
  it('returns true for the first entry (no previous date)', () => {
    expect(shouldShowMonthHeader('2026-05-23', undefined)).toBe(true)
  })

  it('returns false when the previous entry is in the same month', () => {
    expect(shouldShowMonthHeader('2026-05-10', '2026-05-23')).toBe(false)
  })

  it('returns true when the previous entry is in a different month', () => {
    expect(shouldShowMonthHeader('2026-04-30', '2026-05-01')).toBe(true)
  })

  it('returns true for the same month in a different year (year-aware)', () => {
    expect(shouldShowMonthHeader('2025-05-15', '2026-05-15')).toBe(true)
  })
})

describe('getDateRangeForFilter', () => {
  // The function reads `new Date()` internally, so pin the clock per-test.
  afterEach(() => {
    vi.useRealTimers()
  })

  const setNow = (date: Date) => {
    vi.useFakeTimers()
    vi.setSystemTime(date)
  }

  it('returns null bounds for All Time', () => {
    setNow(new Date(2026, 4, 23)) // 2026-05-23 (month is 0-based)
    expect(getDateRangeForFilter(TIME_FILTER.ALL_TIME)).toEqual({
      dateFrom: null,
      dateTo: null,
    })
  })

  it('returns the full current month for This Month', () => {
    setNow(new Date(2026, 4, 23))
    expect(getDateRangeForFilter(TIME_FILTER.THIS_MONTH)).toEqual({
      dateFrom: '2026-05-01',
      dateTo: '2026-05-31',
    })
  })

  it('returns the full previous month for Last Month', () => {
    setNow(new Date(2026, 4, 23))
    expect(getDateRangeForFilter(TIME_FILTER.LAST_MONTH)).toEqual({
      dateFrom: '2026-04-01',
      dateTo: '2026-04-30',
    })
  })

  it('rolls back across the year boundary for Last Month in January', () => {
    setNow(new Date(2026, 0, 15)) // 2026-01-15
    expect(getDateRangeForFilter(TIME_FILTER.LAST_MONTH)).toEqual({
      dateFrom: '2025-12-01',
      dateTo: '2025-12-31',
    })
  })

  it('returns the full calendar year for This Year', () => {
    setNow(new Date(2026, 4, 23))
    expect(getDateRangeForFilter(TIME_FILTER.THIS_YEAR)).toEqual({
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
    })
  })

  it('passes through custom dates for Custom Filter', () => {
    setNow(new Date(2026, 4, 23))
    expect(
      getDateRangeForFilter(TIME_FILTER.CUSTOM_FILTER, {
        from: '2026-03-10',
        to: '2026-03-20',
      })
    ).toEqual({ dateFrom: '2026-03-10', dateTo: '2026-03-20' })
  })
})

describe('filterTransactions', () => {
  const categories: Category[] = [
    {
      id: 'c-exp',
      type: 'expense',
      name: 'Food',
      icon_id: 'food',
      color: '#000',
      index: 0,
      is_active: true,
    },
    {
      id: 'c-inc',
      type: 'income',
      name: 'Salary',
      icon_id: 'salary',
      color: '#fff',
      index: 1,
      is_active: true,
    },
  ]
  const txs: Transaction[] = [
    {
      id: 't1',
      date: '2026-05-10',
      category_id: 'c-exp',
      description: 'Lunch',
      amount: 50,
    },
    {
      id: 't2',
      date: '2026-05-12',
      category_id: 'c-exp',
      description: 'Coffee',
      amount: 20,
    },
    {
      id: 't3',
      date: '2026-05-15',
      category_id: 'c-inc',
      description: 'Payday',
      amount: 9000,
    },
    {
      id: 't4',
      date: '2026-04-30',
      category_id: 'c-exp',
      description: 'Old lunch',
      amount: 30,
    },
  ]

  it('returns all transactions when no filters are given', () => {
    expect(filterTransactions(txs, categories, {})).toHaveLength(4)
  })

  it('filters by category type', () => {
    const result = filterTransactions(txs, categories, { type: 'income' })
    expect(result.map((t) => t.id)).toEqual(['t3'])
  })

  it('filters by category_id', () => {
    const result = filterTransactions(txs, categories, { category_id: 'c-exp' })
    expect(result.map((t) => t.id)).toEqual(['t1', 't2', 't4'])
  })

  it('filters by description substring, case-insensitive', () => {
    const result = filterTransactions(txs, categories, { search: 'lunch' })
    expect(result.map((t) => t.id)).toEqual(['t1', 't4'])
  })

  it('filters by inclusive date range', () => {
    const result = filterTransactions(txs, categories, {
      date_from: '2026-05-01',
      date_to: '2026-05-12',
    })
    expect(result.map((t) => t.id)).toEqual(['t1', 't2'])
  })

  it('combines filters with AND', () => {
    const result = filterTransactions(txs, categories, {
      type: 'expense',
      date_from: '2026-05-01',
      date_to: '2026-05-31',
    })
    expect(result.map((t) => t.id)).toEqual(['t1', 't2'])
  })
})

describe('buildReportDetailQuery', () => {
  it('builds a type query with date bounds', () => {
    expect(
      buildReportDetailQuery({
        type: 'expense',
        dateFrom: '2026-05-01',
        dateTo: '2026-05-31',
      })
    ).toBe('type=expense&date_from=2026-05-01&date_to=2026-05-31')
  })

  it('builds a category query and omits null dates', () => {
    expect(
      buildReportDetailQuery({
        categoryId: 'c-1',
        dateFrom: null,
        dateTo: null,
      })
    ).toBe('category_id=c-1')
  })

  it('returns an empty string when nothing is provided', () => {
    expect(buildReportDetailQuery({})).toBe('')
  })
})
