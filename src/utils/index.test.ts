import { describe, it, expect } from 'vitest'
import {
  getMonthKey,
  formatMonthLabel,
  shouldShowMonthHeader,
  getDateRangeForFilter,
  calculateAverageSpending,
  filterTransactions,
  buildReportDetailQuery,
} from './index'
import { DATE_RANGE } from '@/constants'
import type { Category, Data, Transaction } from '@/types'

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
  const now = new Date(2026, 4, 23) // 2026-05-23 (month is 0-based)

  it('returns null bounds for All Time', () => {
    expect(getDateRangeForFilter(DATE_RANGE.ALL_TIME, now)).toEqual({
      dateFrom: null,
      dateTo: null,
    })
  })

  it('returns the full current month for This Month', () => {
    expect(getDateRangeForFilter(DATE_RANGE.THIS_MONTH, now)).toEqual({
      dateFrom: '2026-05-01',
      dateTo: '2026-05-31',
    })
  })

  it('returns the full previous month for Last Month', () => {
    expect(getDateRangeForFilter(DATE_RANGE.LAST_MONTH, now)).toEqual({
      dateFrom: '2026-04-01',
      dateTo: '2026-04-30',
    })
  })

  it('rolls back across the year boundary for Last Month in January', () => {
    const jan = new Date(2026, 0, 15) // 2026-01-15
    expect(getDateRangeForFilter(DATE_RANGE.LAST_MONTH, jan)).toEqual({
      dateFrom: '2025-12-01',
      dateTo: '2025-12-31',
    })
  })

  it('returns the full calendar year for This Year', () => {
    expect(getDateRangeForFilter(DATE_RANGE.THIS_YEAR, now)).toEqual({
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
    })
  })

  it('passes through custom dates for Custom Filter', () => {
    expect(
      getDateRangeForFilter(DATE_RANGE.CUSTOM_FILTER, now, {
        from: '2026-03-10',
        to: '2026-03-20',
      })
    ).toEqual({ dateFrom: '2026-03-10', dateTo: '2026-03-20' })
  })
})

describe('calculateAverageSpending', () => {
  const categories: Category[] = [
    {
      id: 'c-exp',
      type: 'expense',
      name: 'Food',
      icon_id: 'food',
      color: '#000',
    },
    {
      id: 'c-inc',
      type: 'income',
      name: 'Salary',
      icon_id: 'salary',
      color: '#fff',
    },
  ]
  const today = '2026-05-23'

  const makeData = (entries: [string, string, number][]): Data[] => {
    // entries: [date, category_id, amount]
    const byDate = new Map<string, Data>()
    for (const [date, category_id, amount] of entries) {
      if (!byDate.has(date)) byDate.set(date, { date, subdata: [] })
      byDate.get(date)!.subdata.push({
        category_id,
        item: [{ id: date + amount, description: 'x', amount }],
      })
    }
    return [...byDate.values()]
  }

  it('divides expense by inclusive elapsed days for a bounded range', () => {
    // window = 2026-05-01..2026-05-23 (today) = 23 days; expense 2300 => 100/day
    const data = makeData([['2026-05-10', 'c-exp', 2300]])
    expect(
      calculateAverageSpending(
        data,
        categories,
        '2026-05-01',
        '2026-05-31',
        today
      )
    ).toBe(100)
  })

  it('excludes future-dated expense from both numerator and day count', () => {
    // a 2026-05-30 expense is after today; it must not count
    const data = makeData([
      ['2026-05-10', 'c-exp', 2300],
      ['2026-05-30', 'c-exp', 999999],
    ])
    expect(
      calculateAverageSpending(
        data,
        categories,
        '2026-05-01',
        '2026-05-31',
        today
      )
    ).toBe(100)
  })

  it('ignores income entirely', () => {
    const data = makeData([
      ['2026-05-10', 'c-exp', 2300],
      ['2026-05-10', 'c-inc', 5000000],
    ])
    expect(
      calculateAverageSpending(
        data,
        categories,
        '2026-05-01',
        '2026-05-31',
        today
      )
    ).toBe(100)
  })

  it('for All Time uses oldest transaction date through today', () => {
    // oldest = 2026-05-21, today = 2026-05-23 => 3 inclusive days; expense 300 => 100/day
    const data = makeData([
      ['2026-05-21', 'c-exp', 100],
      ['2026-05-23', 'c-exp', 200],
      ['2026-07-01', 'c-exp', 999999], // future, excluded
    ])
    expect(calculateAverageSpending(data, categories, null, null, today)).toBe(
      100
    )
  })

  it('returns 0 when the range is entirely in the future', () => {
    const data = makeData([['2026-06-10', 'c-exp', 100]])
    expect(
      calculateAverageSpending(
        data,
        categories,
        '2026-06-01',
        '2026-06-30',
        today
      )
    ).toBe(0)
  })

  it('returns 0 when there are no transactions', () => {
    expect(calculateAverageSpending([], categories, null, null, today)).toBe(0)
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
    },
    {
      id: 'c-inc',
      type: 'income',
      name: 'Salary',
      icon_id: 'salary',
      color: '#fff',
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
