import { describe, it, expect } from 'vitest'
import { getMonthKey, formatMonthLabel, shouldShowMonthHeader } from './index'

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
