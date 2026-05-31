import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { computeAvgSpending } from './report'

// Pin clock to 2026-05-23 so getElapsedDay's internal getDate() is deterministic.
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 4, 23)) // 2026-05-23 (month is 0-based)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('computeAvgSpending', () => {
  it('divides (totalExpense - totalFutureExpense) by elapsed days for a normal bounded case', () => {
    // oldestDate = 2026-05-01, today = 2026-05-23 => 23 elapsed days
    // totalExpense=2300, totalFutureExpense=0 => 2300/23 = 100
    expect(computeAvgSpending(2300, 0, '2026-05-01')).toBe(100)
  })

  it('excludes future expense from the numerator', () => {
    // totalExpense=5300 (includes 3000 future), totalFutureExpense=3000
    // (5300-3000)/23 = 100
    expect(computeAvgSpending(5300, 3000, '2026-05-01')).toBe(100)
  })

  it('clamps denominator to 1 when oldestDate == today', () => {
    // elapsed = 1 day (same day), totalExpense=500, totalFutureExpense=0
    // 500 / max(1,1) = 500
    expect(computeAvgSpending(500, 0, '2026-05-23')).toBe(500)
  })

  it('clamps denominator to 1 for an all-future range (no negative/NaN)', () => {
    // totalExpense=0 (all future excluded), totalFutureExpense=0
    // oldestDate in the future => getElapsedDay returns negative => max(1, neg) = 1
    // 0 / 1 = 0
    expect(computeAvgSpending(0, 0, '2026-07-01')).toBe(0)
  })
})
