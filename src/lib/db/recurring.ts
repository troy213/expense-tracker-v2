import { Recurring, RecurringHistoryEntry } from '@/types'

/** "YYYY-MM" of a "YYYY-MM-DD" date string. */
export const periodOf = (date: string): string => date.slice(0, 7)

/** The "YYYY-MM" period that follows `period`. */
export const nextPeriod = (period: string): string => {
  const [year, month] = period.split('-').map(Number)
  return month === 12
    ? `${year + 1}-01`
    : `${year}-${String(month + 1).padStart(2, '0')}`
}

/**
 * The due date inside `period`, with the day clamped to the month's last day
 * (due_day 31 in February → Feb 28/29).
 */
export const clampDueDate = (period: string, dueDay: number): string => {
  const [year, month] = period.split('-').map(Number)
  // Day 0 of the next month = the last day of `month`.
  const lastDay = new Date(year, month, 0).getDate()
  return `${period}-${String(Math.min(dueDay, lastDay)).padStart(2, '0')}`
}

/** Deterministic ledger key — one row per (definition, month) by construction. */
export const historyRowId = (recurringId: string, period: string): string =>
  `${recurringId}:${period}`

/**
 * Pure generator core: the pending rows `definition` is missing as of `today`
 * ("YYYY-MM-DD"), oldest-first. Walks from the month after the latest existing
 * row (or from start_period for brand-new definitions) up to the current
 * month. A month is generated only once its clamped due date has passed —
 * which is always true for past months, so the gate only affects the current
 * one. Stops at active_until.
 */
export const computeRowsToGenerate = (
  definition: Recurring,
  existingHistory: RecurringHistoryEntry[],
  today: string
): RecurringHistoryEntry[] => {
  if (!definition.is_active) return []

  const currentPeriod = periodOf(today)
  const latestPeriod = existingHistory.reduce<string | null>((latest, row) => {
    if (row.recurring_id !== definition.id) return latest
    const period = periodOf(row.date)
    return latest === null || period > latest ? period : latest
  }, null)

  const rows: RecurringHistoryEntry[] = []
  let period =
    latestPeriod === null ? definition.start_period : nextPeriod(latestPeriod)

  while (period <= currentPeriod) {
    if (definition.active_until !== null && period > definition.active_until) {
      break
    }
    const dueDate = clampDueDate(period, definition.due_day)
    if (dueDate <= today) {
      rows.push({
        id: historyRowId(definition.id, period),
        recurring_id: definition.id,
        date: dueDate,
        category_id: definition.category_id,
        transaction_name: definition.transaction_name,
        amount: definition.amount,
        status: 'pending',
      })
    }
    period = nextPeriod(period)
  }
  return rows
}

/**
 * True once the current month is past active_until — the generator then has
 * nothing left to produce and may flip is_active off.
 */
export const isExpired = (definition: Recurring, today: string): boolean =>
  definition.active_until !== null && periodOf(today) > definition.active_until
