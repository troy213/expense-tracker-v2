import { Recurring, RecurringHistoryEntry, Transaction } from '@/types'
import { getDB } from './connection'

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
    // The id (`${recurring_id}:${period}`) is the authoritative period source —
    // row.date is display data and must not steer the walk.
    const period = row.id.slice(row.recurring_id.length + 1)
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

// ============================================================================
// DB SERVICE WRAPPERS (thin IndexedDB adapters — covered by the setup mock)
// ============================================================================

/**
 * Get all recurring definitions
 */
async function getAllRecurring(): Promise<Recurring[]> {
  const database = await getDB()
  return database.getAll('recurring')
}

/**
 * Get all recurring-history rows (flat, across every definition)
 */
async function getAllHistory(): Promise<RecurringHistoryEntry[]> {
  const database = await getDB()
  return database.getAll('recurring_history')
}

/**
 * Get all history rows for a single definition
 */
async function getHistoryByRecurringId(
  recurringId: string
): Promise<RecurringHistoryEntry[]> {
  const database = await getDB()
  return database.getAllFromIndex(
    'recurring_history',
    'by-recurring',
    recurringId
  )
}

/**
 * Add or update a recurring definition
 */
async function putRecurring(definition: Recurring): Promise<string> {
  const database = await getDB()
  return database.put('recurring', definition)
}

/**
 * Insert generated pending rows with add() — NEVER put(). Each add is its own
 * one-shot transaction, so a ConstraintError (the row already exists: StrictMode
 * double-effect, second tab, date-change re-run) is swallowed per-row without
 * aborting the rest and, critically, without clobbering an already-resolved
 * month back to pending. Returns only the rows actually written.
 */
async function addHistoryRows(
  rows: RecurringHistoryEntry[]
): Promise<RecurringHistoryEntry[]> {
  const database = await getDB()
  const written: RecurringHistoryEntry[] = []
  for (const row of rows) {
    try {
      await database.add('recurring_history', row)
      written.push(row)
    } catch (error) {
      if ((error as DOMException).name !== 'ConstraintError') throw error
    }
  }
  return written
}

/**
 * Overwrite existing history rows (edit-cascade into pending rows, skip-resolve)
 */
async function putHistoryRows(rows: RecurringHistoryEntry[]): Promise<void> {
  const database = await getDB()
  const tx = database.transaction('recurring_history', 'readwrite')
  for (const row of rows) {
    await tx.store.put(row)
  }
  await tx.done
}

/**
 * Resolve a pending month as 'added': write the generated transaction and the
 * updated history row in ONE IndexedDB transaction across both stores, so the
 * ledger can never disagree with the transaction list.
 */
async function resolveAdd(
  row: RecurringHistoryEntry,
  transaction: Transaction
): Promise<void> {
  const database = await getDB()
  const tx = database.transaction(
    ['transactions', 'recurring_history'],
    'readwrite'
  )
  await tx.objectStore('transactions').put(transaction)
  await tx.objectStore('recurring_history').put(row)
  await tx.done
}

/**
 * Delete a definition and cascade-delete ALL its history rows (pending and
 * resolved) in one transaction. Generated transactions are real money events
 * and are intentionally kept.
 */
async function deleteRecurring(id: string): Promise<void> {
  const database = await getDB()
  const tx = database.transaction(
    ['recurring', 'recurring_history'],
    'readwrite'
  )

  await tx.objectStore('recurring').delete(id)

  const historyStore = tx.objectStore('recurring_history')
  const index = historyStore.index('by-recurring')
  let cursor = await index.openCursor(id)
  while (cursor) {
    await cursor.delete()
    cursor = await cursor.continue()
  }

  await tx.done
}

/**
 * Clear all recurring definitions and history
 */
async function clearRecurring(): Promise<void> {
  const database = await getDB()
  await database.clear('recurring')
  await database.clear('recurring_history')
}

const recurringServices = {
  getAllRecurring,
  getAllHistory,
  getHistoryByRecurringId,
  putRecurring,
  addHistoryRows,
  putHistoryRows,
  resolveAdd,
  deleteRecurring,
  clearRecurring,
}

export default recurringServices
