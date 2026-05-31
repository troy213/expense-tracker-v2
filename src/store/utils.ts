import {
  ActionReducerMapBuilder,
  AsyncThunk,
  CaseReducer,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit'

// The keys of `State` whose value is a boolean — i.e. the loading flags an async
// thunk is allowed to toggle.
type BooleanKey<State> = {
  [K in keyof State]: State[K] extends boolean ? K : never
}[keyof State]

// RTK doesn't re-export its internal `AsyncThunkConfig`, so mirror its shape here
// to accept a thunk regardless of its thunkAPI config.
type AsyncThunkConfig = {
  state?: unknown
  dispatch?: Dispatch
  extra?: unknown
  rejectValue?: unknown
  serializedErrorType?: unknown
  pendingMeta?: unknown
  fulfilledMeta?: unknown
  rejectedMeta?: unknown
}

/**
 * Wires the standard pending/fulfilled/rejected trio for an async thunk in one
 * call: `pending` flips `loadingKey` on, `rejected` flips it off, and `fulfilled`
 * runs `onFulfilled` (which is expected to turn the flag off as it stores data).
 *
 * Replaces the three-`addCase` boilerplate per thunk in a slice's
 * `extraReducers`.
 */
export const addAsyncThunkCases = <
  State,
  Returned,
  ThunkArg,
  Config extends AsyncThunkConfig,
>(
  builder: ActionReducerMapBuilder<State>,
  thunk: AsyncThunk<Returned, ThunkArg, Config>,
  loadingKey: BooleanKey<State>,
  onFulfilled: CaseReducer<State, PayloadAction<Returned>>
) => {
  builder
    .addCase(thunk.pending, (state) => {
      ;(state as Record<BooleanKey<State>, boolean>)[loadingKey] = true
    })
    .addCase(thunk.fulfilled, onFulfilled)
    .addCase(thunk.rejected, (state) => {
      ;(state as Record<BooleanKey<State>, boolean>)[loadingKey] = false
    })
}
