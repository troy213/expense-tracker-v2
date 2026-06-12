import { PayloadAction } from '@reduxjs/toolkit'
import { Recurring, RecurringHistoryEntry } from '@/types'
import { InitialState } from './recurring-slice'

/** Replace-or-append history rows by their deterministic id. */
const upsertRows = (state: InitialState, rows: RecurringHistoryEntry[]) => {
  rows.forEach((row) => {
    const index = state.history.findIndex((r) => r.id === row.id)
    if (index === -1) state.history.push(row)
    else state.history[index] = row
  })
}

export const setRecurringData = (
  state: InitialState,
  action: PayloadAction<{
    recurring: Recurring[]
    history: RecurringHistoryEntry[]
  }>
) => {
  state.recurring = action.payload.recurring
  state.history = action.payload.history
  state.isLoading = false
}

export const addRecurring = (
  state: InitialState,
  action: PayloadAction<{
    definition: Recurring
    rows: RecurringHistoryEntry[]
  }>
) => {
  state.recurring.push(action.payload.definition)
  upsertRows(state, action.payload.rows)
  state.isLoading = false
}

export const replaceRecurring = (
  state: InitialState,
  action: PayloadAction<{
    definition: Recurring
    rows: RecurringHistoryEntry[]
  }>
) => {
  const { definition, rows } = action.payload
  state.recurring = state.recurring.map((d) =>
    d.id === definition.id ? definition : d
  )
  upsertRows(state, rows)
  state.isLoading = false
}

export const removeRecurring = (
  state: InitialState,
  action: PayloadAction<string>
) => {
  state.recurring = state.recurring.filter((d) => d.id !== action.payload)
  state.history = state.history.filter((r) => r.recurring_id !== action.payload)
  state.isLoading = false
}

export const applyGenerated = (
  state: InitialState,
  action: PayloadAction<{
    rows: RecurringHistoryEntry[]
    deactivated: Recurring[]
  }>
) => {
  upsertRows(state, action.payload.rows)
  action.payload.deactivated.forEach((definition) => {
    state.recurring = state.recurring.map((d) =>
      d.id === definition.id ? definition : d
    )
  })
  state.isLoading = false
}

export const resolveHistory = (
  state: InitialState,
  action: PayloadAction<{ row: RecurringHistoryEntry }>
) => {
  upsertRows(state, [action.payload.row])
  state.isLoading = false
}
