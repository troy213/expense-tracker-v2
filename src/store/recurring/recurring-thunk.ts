import { createAsyncThunk } from '@reduxjs/toolkit'
import { v7 as uuidv7 } from 'uuid'
import {
  Recurring,
  RecurringHistoryEntry,
  Transaction,
  TxFormData,
} from '@/types'
import dbServices from '@/lib/db'
import {
  clampDueDate,
  computeRowsToGenerate,
  isExpired,
  periodOf,
} from '@/lib/db/recurring'

export const getAllDBRecurring = createAsyncThunk(
  'recurring/getAll',
  async () => {
    const [recurring, history] = await Promise.all([
      dbServices.recurring.getAllRecurring(),
      dbServices.recurring.getAllHistory(),
    ])
    return { recurring, history }
  }
)

/**
 * The generator (see spec §Generator): for every active definition, write the
 * pending rows newly due as of `today`, then deactivate definitions whose
 * active_until has been exceeded (after generation, so their final periods got
 * their rows). Idempotent — addHistoryRows swallows already-exists per row.
 */
export const generateDBRecurring = createAsyncThunk(
  'recurring/generate',
  async (today: string) => {
    const [definitions, history] = await Promise.all([
      dbServices.recurring.getAllRecurring(),
      dbServices.recurring.getAllHistory(),
    ])

    const rows: RecurringHistoryEntry[] = []
    const deactivated: Recurring[] = []

    for (const definition of definitions) {
      if (!definition.is_active) continue
      const written = await dbServices.recurring.addHistoryRows(
        computeRowsToGenerate(definition, history, today)
      )
      rows.push(...written)
      if (isExpired(definition, today)) {
        const updated: Recurring = { ...definition, is_active: false }
        await dbServices.recurring.putRecurring(updated)
        deactivated.push(updated)
      }
    }

    return { rows, deactivated }
  }
)

/**
 * Create a definition and materialize immediately, so a rule whose due date
 * already passed this month shows its pending row without waiting for the
 * next generator trigger.
 */
export const addDBRecurring = createAsyncThunk(
  'recurring/add',
  async (payload: { definition: Recurring; today: string }) => {
    const { definition, today } = payload
    await dbServices.recurring.putRecurring(definition)
    const rows = await dbServices.recurring.addHistoryRows(
      computeRowsToGenerate(definition, [], today)
    )
    return { definition, rows }
  }
)

/**
 * Edit a definition. Snapshots on its still-PENDING rows are refreshed (date
 * recomputed from due_day; category/name/amount copied) — resolved rows and
 * generated transactions are untouched. Then newly-due months are generated
 * (e.g. due_day moved earlier, or the definition was just reactivated — note
 * that reactivating intentionally catches up all months missed while off).
 */
export const editDBRecurring = createAsyncThunk(
  'recurring/edit',
  async (payload: { definition: Recurring; today: string }) => {
    const { today } = payload
    // Expiry wins over the submitted flag (mirroring the generator's
    // deactivate-after-generation rule), so the Active pill never lags until
    // the next trigger when active_until is edited into the past.
    const definition: Recurring = {
      ...payload.definition,
      is_active:
        payload.definition.is_active && !isExpired(payload.definition, today),
    }
    await dbServices.recurring.putRecurring(definition)

    const own = await dbServices.recurring.getHistoryByRecurringId(
      definition.id
    )
    const refreshed = own
      .filter((row) => row.status === 'pending')
      .map((row) => ({
        ...row,
        date: clampDueDate(periodOf(row.date), definition.due_day),
        category_id: definition.category_id,
        transaction_name: definition.transaction_name,
        amount: definition.amount,
      }))
    await dbServices.recurring.putHistoryRows(refreshed)

    // Generate from the user's intent (pre-expiry flag) so the final periods
    // up to active_until still get their pending rows even when the edit
    // itself expires the definition; the walk breaks at active_until.
    const generated = payload.definition.is_active
      ? await dbServices.recurring.addHistoryRows(
          computeRowsToGenerate(payload.definition, own, today)
        )
      : []

    return { definition, rows: [...refreshed, ...generated] }
  }
)

export const deleteDBRecurring = createAsyncThunk(
  'recurring/delete',
  async (id: string) => {
    await dbServices.recurring.deleteRecurring(id)
    return id
  }
)

/**
 * Resolve a pending month as 'added': writes the real transaction + the
 * resolved row atomically. Returns `data` in TxFormData shape so the
 * transactions slice can reuse its existing addData reducer.
 */
export const resolveAddDBRecurring = createAsyncThunk(
  'recurring/resolveAdd',
  async (payload: {
    row: RecurringHistoryEntry
    amount: number
    name: string
  }) => {
    const { row, amount, name } = payload
    const resolved: RecurringHistoryEntry = {
      ...row,
      status: 'added',
      transaction_name: name,
      amount,
    }
    const transaction: Transaction = {
      id: uuidv7(),
      date: row.date,
      category_id: row.category_id,
      description: name,
      amount,
    }
    await dbServices.recurring.resolveAdd(resolved, transaction)

    const data: TxFormData = {
      date: transaction.date,
      category_id: transaction.category_id,
      item: [
        {
          id: transaction.id,
          description: transaction.description,
          amount: transaction.amount,
        },
      ],
    }
    return { row: resolved, data }
  }
)

/**
 * Resolve a pending month as 'skipped' — no transaction, one tap.
 */
export const resolveSkipDBRecurring = createAsyncThunk(
  'recurring/resolveSkip',
  async (row: RecurringHistoryEntry) => {
    const resolved: RecurringHistoryEntry = { ...row, status: 'skipped' }
    await dbServices.recurring.putHistoryRows([resolved])
    return { row: resolved }
  }
)
